const shortid = require('shortid');
const { redisClient } = require('../config/redisConfig');
const Url = require('../models/Url');


// POST: Save analytics data when a URL is accessed
const recordAnalytics = async (req, res) => {
    try {
      const { alias } = req.body;
      const { userId, os, device } = req.body;
  
      if (!alias || !userId) {
        return res.status(400).json({ error: "Missing required data" });
      }
  
      const url = await Url.findOne({ alias });
  
      if (!url) {
        return res.status(404).json({ error: "URL not found" });
      }
  
      // Add analytics to the URL
      url.analytics.push({
        date: new Date(),
        userId,
        os,
        device,
      });
  
      await url.save();
      return res.status(200).json({ message: "Analytics recorded" });
    } catch (error) {
      console.error("Error recording analytics:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  

// POST: Create Short URL
const createShortUrl = async (req, res) => {
  try {
    const { nanoid } = await import("nanoid");
    const { longUrl, customAlias,topic } = req.body;
    if (!longUrl) {
      return res.status(400).json({ error: "longUrl error" });
    }
    let alias = customAlias;
    if (!alias) alias = nanoid(8);

    let shortUrl = `localhost:3000/a/${alias}` 

    const url = new Url({ longUrl: longUrl, alias:alias, shortUrl,topic,userId:req.user.userId });
    await url.save();
    return res.status(200).json({ message: "URL Generated", url: url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
}

// GET: Redirect Short URL
const redirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ alias:shortUrl });
    if (url) {
      url.clicks++;
      await url.save();
      return res.json(url);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
}

// GET: Analytics for a specific URL
const getAnalytics = async (req, res) => {
    const { alias } = req.params;
  
    try {
      // Find the URL by alias
      const url = await Url.findOne({ alias });
      if (!url) {
        return res.status(404).json({ error: 'URL not found.' });
      }
  
      // Total clicks and unique users
      const totalClicks = url.analytics.length;
      const uniqueUsers = new Set(url.analytics.map((entry) => entry.userId)).size;
  
      // Get analytics for the past 7 days
      const recent7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
      });
  
      const clicksByDate = recent7Days.map((date) => ({
        date,
        clickCount: url.analytics.filter(
          (entry) => entry.date.split('T')[0] === date
        ).length,
      }));
  
      // OS Type Analytics
      const osData = url.analytics.reduce((acc, entry) => {
        const osName = entry.os || 'Unknown';
        if (!acc[osName]) {
          acc[osName] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[osName].uniqueClicks += 1;
        acc[osName].uniqueUsers.add(entry.userId);
        return acc;
      }, {});
  
      const osType = Object.entries(osData).map(([osName, data]) => ({
        osName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      }));
  
      // Device Type Analytics
      const deviceData = url.analytics.reduce((acc, entry) => {
        const deviceName = entry.device || 'Unknown';
        if (!acc[deviceName]) {
          acc[deviceName] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[deviceName].uniqueClicks += 1;
        acc[deviceName].uniqueUsers.add(entry.userId);
        return acc;
      }, {});
  
      const deviceType = Object.entries(deviceData).map(([deviceName, data]) => ({
        deviceName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      }));
  
      // Send response
      res.status(200).json({
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  };
  

// GET: Topic-based Analytics
const getTopicAnalytics = async (req, res) => {
    const { topic } = req.params;
  
    try {
      // Find all URLs with the specified topic
      const urls = await Url.find({ topic });
      if (urls.length === 0) {
        return res.status(404).json({ error: 'No URLs found for the specified topic.' });
      }
  
      // Calculate total clicks and unique users across all URLs
      const totalClicks = urls.reduce((sum, url) => sum + url.analytics.length, 0);
      const uniqueUsers = new Set(
        urls.flatMap((url) => url.analytics.map((entry) => entry.userId))
      ).size;
  
      // Get analytics grouped by date
      const analyticsByDate = {};
      urls.forEach((url) => {
        url.analytics.forEach((entry) => {
          const date = entry.date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          if (!analyticsByDate[date]) {
            analyticsByDate[date] = 0;
          }
          analyticsByDate[date] += 1;
        });
      });
  
      const clicksByDate = Object.entries(analyticsByDate).map(([date, count]) => ({
        date,
        clickCount: count,
      }));
  
      // Generate URL-specific analytics
      const urlsData = urls.map((url) => {
        const uniqueUsersForUrl = new Set(url.analytics.map((entry) => entry.userId)).size;
        return {
          shortUrl: url.shortUrl,
          totalClicks: url.analytics.length,
          uniqueUsers: uniqueUsersForUrl,
        };
      });
  
      // Send response
      res.status(200).json({
        topic,
        totalClicks,
        uniqueUsers,
        clicksByDate,
        urls: urlsData,
      });
    } catch (err) {
      console.error('Error fetching topic analytics:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  };
  




// GET: Overall Analytics
const getOverallAnalytics = async (req, res) => {
    try {
      // Fetch all URLs created by the authenticated user
      const urls = await Url.find();
  
      if (!urls.length) {
        return res.status(404).json({ error: "No URLs found for this user." });
      }
  
      // Calculate total clicks
      const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  
      // Calculate unique users
      const uniqueUsersSet = new Set();
      const clicksByDateMap = new Map();
      const osTypeMap = new Map();
      const deviceTypeMap = new Map();
  
      urls.forEach((url) => {
        url.analytics.forEach((click) => {
          // Add user ID to the unique set
          if (click.userId) uniqueUsersSet.add(click.userId);
  
          // Aggregate clicks by date
          const date = click.date.toISOString().split("T")[0];
          clicksByDateMap.set(date, (clicksByDateMap.get(date) || 0) + 1);
  
          // Aggregate clicks by OS type
          if (click.os) {
            const osData = osTypeMap.get(click.os) || { osName: click.os, uniqueClicks: 0, uniqueUsers: new Set() };
            osData.uniqueClicks += 1;
            osData.uniqueUsers.add(click.userId);
            osTypeMap.set(click.os, osData);
          }
  
          // Aggregate clicks by device type
          if (click.device) {
            const deviceData = deviceTypeMap.get(click.device) || { deviceName: click.device, uniqueClicks: 0, uniqueUsers: new Set() };
            deviceData.uniqueClicks += 1;
            deviceData.uniqueUsers.add(click.userId);
            deviceTypeMap.set(click.device, deviceData);
          }
        });
      });
  
      // Format the response data
      const clicksByDate = Array.from(clicksByDateMap.entries()).map(([date, count]) => ({ date, count }));
      const osType = Array.from(osTypeMap.values()).map(({ osName, uniqueClicks, uniqueUsers }) => ({
        osName,
        uniqueClicks,
        uniqueUsers: uniqueUsers.size,
      }));
      const deviceType = Array.from(deviceTypeMap.values()).map(({ deviceName, uniqueClicks, uniqueUsers }) => ({
        deviceName,
        uniqueClicks,
        uniqueUsers: uniqueUsers.size,
      }));
  
      // Send the response
      res.json({
        totalUrls: urls.length,
        totalClicks,
        uniqueUsers: uniqueUsersSet.size,
        clicksByDate,
        osType,
        deviceType,
      });
    } catch (err) {
      console.error("Error fetching overall analytics:", err);
      res.status(500).json({ error: "Server error." });
    }
  };
  

module.exports = {
    createShortUrl,
    redirectUrl,
    getAnalytics,
    getTopicAnalytics,
    getOverallAnalytics,
    recordAnalytics,
};
