# Url-Shortner
URL Shortener with Google Login
## Overview
This is a URL shortener web application built with React, Firebase for Google authentication, and Node.js as the backend. The app allows users to shorten URLs, assign custom aliases, and track redirects with analytics. The project integrates Google OAuth for authentication, and users can sign in to shorten URLs.
## Features Implemented
-	Google Authentication: Users can log in using their Google account via Firebase Authentication.
-	URL Shortening: Users can shorten long URLs, assign custom aliases, and categorize them with topics.
-	Redirect Handling: When accessing a shortened URL, the app fetches the original long URL from the backend and redirects the user to it.
-	Analytics Tracking: The app tracks user analytics (OS, device) when a redirect occurs and sends this data to the backend for analysis.
Tech Stack
-	Frontend: React, React Router, Firebase Authentication, Axios (for API calls)
-	Backend: Node.js, Express.js, MongoDB (for storing URLs)
-	Authentication: Firebase Authentication (Google login)
-	URL Redirection: Handles redirects and custom alias mapping
-	Analytics: Tracks user platform and device data during URL redirection
Instructions to Run the Project
Prerequisites
Make sure you have the following installed on your system:
-	Node.js (>= 14.x)
-	npm (>= 6.x) or yarn (optional, but recommended for package management)
1. Clone the Repository
First, clone the repository to your local machine:
https://github.com/nitu2003/Url-Shortner
2. Install Dependencies
Install the necessary dependencies for both the backend and frontend:
Backend (Node.js)
Go to the backend folder and run:
cd backend
npm install
Frontend (React)
Go to the frontend folder and run:
bash
cd frontend
npm install
3. Set Up Firebase
-	Create a Firebase project on the Firebase Console.
-	Obtain your Firebase configuration details (API key, Auth domain, etc.) and replace the values in frontend/src/firebase.js.
4. Set Up the Backend
-	Set up a MongoDB database (either locally or on a cloud service like MongoDB Atlas).
-	Create an .env file in the backend directory with your MongoDB connection string, e.g.,:


5. Run the Project
Backend
Start the backend server:
cd backend
npm start
By default, the backend runs on http://localhost:3010.
Frontend
Start the frontend development server:
cd frontend
npm run dev
The frontend will run on http://localhost:3000.
Now you can open the app in your browser and start using the URL shortener.
## Features in Detail
1. Google Authentication
-	Users log in using Google via Firebase Authentication.
-	Upon successful login, an ID token is stored in localStorage for subsequent API calls.
2. Shorten URLs
-	Users can input a long URL and a custom alias.
-	The frontend calls the backend API to shorten the URL and store it in the database.
-	The app displays the shortened URL, which can be accessed or shared.
3. Redirection
-	When a user visits a shortened URL, the app fetches the original long URL from the backend and redirects the user.
-	The app sends analytics data, such as the user's operating system and device, to the backend during redirection.
4. Analytics Tracking
-	During each redirection, the app tracks the user's platform (OS) and device details and stores this information in the backend for analytics.
Routes for the URL Shortener Project

## The server will start on   http://localhost:3000

1.	Login Route
-	Path: /login
-	Method: POST
-	Description: Displays the login page where users can log in with their Google account

2.      Shorten URL Route
-	Path: /shortner
-	Method: GET
-	Description: Displays the URL shortening form, where authenticated users can shorten URLs, add custom aliases, and assign topics.

 3.  Redirect Route
-	Path: /a/:alias
-	Method: GET
-	Description: Handles the redirection when a user accesses a shortened URL. The app fetches the original long URL and redirects the user accordingly. Analytics for the redirect (e.g., OS, device) are sent to the backend.
Backend Routes

Here are the routes you’ll need in the backend to support the frontend functionality:
## The server will start on http://localhost:3010

1. Shorten URL Endpoint
-	Path: /api/short
-	Method: POST
-	Description: Accepts a long URL, custom alias, and topic to create a shortened URL. Requires authentication via an authorization token (from Google login).
-	Request Body:
o	longUrl (string): The long URL to shorten.
o	customAlias (string): Custom alias for the shortened URL.
o	topic (string): Optional, the topic for categorizing the link.
•	Headers:
o	Authorization:  <auth-token>

2. GET /:shortUrl
 -  Redirects to the original URL.

3. Analytics Endpoint
-	Path: /api/analytics
-	Method: POST
-	Description: Receives analytics data (such as OS and device details) for a redirect event and stores it in the database for tracking.
-	Request Body:
o	alias (string): The alias for which the redirect occurred.
o	os (string): The user's operating system.
o	device (string): The user's device information.

4. GET, Path:  /api/analytics/topic/:topic
 -  Get analytics for URLs grouped by a specific topic.

5. GET Path: api /analytics/overall
 -  Get overall analytics for all URLs created by the authenticated user.

6. GET Path: api/analytics/:alias
 -   Get analytics for a specific shortened URL.


## Summary of Routes
Frontend Routes
-	/login   - Login page for Google authentication
-	/shortner   - URL shortening form
-	/a/:alias    - Redirect handler for shortened URLs

Backend Routes
-	POST /api/short  - Create shortened URL
-	GET /api/:shortUrl  - Redirects to the original URL.
-	POST /api/analytics  - Store redirect analytics (OS, device)
-	GET Path: api/analytics/:alias  -  Get analytics for a specific shortened URL.
-	GET /api/analytics/topic/:topic  - Get analytics for URLs grouped by a specific topic.
-	GET /api/analytics/overall  - get overall analytics for all URLs created by the authenticated user.

 ## API Documentation
You can test the API endpoints using the Postman collection provided:
 https://documenter.getpostman.com/view/25655704/2sAYQdhpBt

## Deployment URL : USING VERCEL
For frontend   the server will start on    : https://url-shortner-br1q.vercel.app/

1.   Login Route
-	Path: /login
-	Description: Displays the login page where users can log in with their Google account

2.    Shorten URL Route
-	Path: /shortner
-	Description: Displays the URL shortening form, where authenticated users can shorten URLs, add custom aliases, and assign topics.

 3.  Redirect Route
-	Path: /a/:alias
-	Description: Handles the redirection when a user accesses a shortened URL. The app fetches the original long URL and redirects the user accordingly. Analytics for the redirect (e.g., OS, device) are sent to the backend.

For backend the server will start on    : https://url-shortner-tan-omega.vercel.app/

-	POST /api/short - Create shortened URL
-	GET /api/:shortUrl - Redirects to the original URL.
-	POST /api/analytics - Store redirect analytics (OS, device)
-	GET Path: api/analytics/:alias -  Get analytics for a specific shortened URL.
-	GET /api/analytics/topic/:topic - Get analytics for URLs grouped by a specific topic.
-	GET /api/analytics/overall - get overall analytics for all URLs created by the authenticated user.

Challenges Faced & Solutions Implemented
1. Google Authentication Integration
-	Challenge: Integrating Google OAuth with Firebase was challenging because it required the correct Firebase project configuration and handling token storage properly.
-	Solution: I used Firebase Authentication to handle the Google login. The signInWithPopup() method was used to authenticate users, and the ID token was stored in localStorage for secure API calls.
2. Handling Redirection with Custom Aliases
-	Challenge: Ensuring that each shortened URL redirects properly, especially with custom aliases, and avoids conflicts.
-	Solution: The backend checks if the alias already exists in the database before shortening the URL. If it does, the app prompts the user to choose a different alias.
3. API Calls and Token Handling
-	Challenge: Passing the ID token securely with API requests after login and ensuring that it is included in the authorization header.
-	Solution: The token is retrieved from localStorage after login and included in the request headers when making API calls to the backend.
4. Analytics and Device Tracking
-	Challenge: Tracking the user's device and operating system during redirection.
-	Solution: Used navigator.platform to get the OS and navigator.userAgent for device details, and sent this data to the backend during the redirection process.

## Conclusion
This project successfully integrates Google authentication, URL shortening, and redirection with analytics tracking. By following this guide, you can set up the project locally and start using it. The app can be extended further by adding features like user profile management, URL expiration, or analytics dashboards.

