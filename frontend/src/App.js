import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import axios from "axios";
import GoogleLoginButton from "./GoogleLoginButton";

// Component for Login Page
function Login({ onLoginSuccess }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login
        </h1>
        <p className="text-center mb-4">
          Sign in with your Google account to get started.
        </p>
        <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}

// Component for generating short URL
function ShortenUrl() {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setcustomAlias] = useState("");
  const [topic, settopic] = useState("")

  const handleSubmit = () => {
    const authToken = localStorage.getItem("auth-token"); // Get the token from local storage

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/short`,
        { longUrl, customAlias ,topic},
        {
          headers: {
            Authorization: `${authToken}`, // Set the Authorization header
          },
        }
      )
      .then((res) => {
        setcustomAlias(res.data.url.shortUrl);
        console.log("API response", res.data.url.shortUrl);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          URL Shortener
        </h1>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter URL to shorten"
            onChange={(e) => setLongUrl(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Enter custom alias"
            onChange={(e) => setcustomAlias(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Enter custom topic"
            onChange={(e) => settopic(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition"
          >
            Shorten
          </button>
          {customAlias && (
            <div className="mt-6 text-center">
              <p className="text-lg font-medium">Shortened URL:</p>
              <a
                href={`http://localhost:3000/a/${customAlias}`}
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2"
                target="_blank"
              >
                {`http://localhost:3000/a/${customAlias}`}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for handling redirection
function RedirectHandler() {
  const { alias } = useParams();

  useEffect(() => {
    const os = navigator.platform; // Get user's operating system
    const device = navigator.userAgent; // Get user's device

    console.log('@@ Alias ',alias)
    console.log('backend ',process.env )

    console.log('backend url', process.env.REACT_APP_BACKEND_BASE_URL )

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/${alias}`)
      .then((res) => {
        // Send analytics data to backend when redirect happens
        axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/analytics`, {
          alias,
          os,
          device,
        });

        window.location.href = res.data.longUrl; // Redirect to original URL
      })
      .catch((err) => {
        console.error("Error fetching URL:", err);
        alert("The short URL does not exist!");
      });
  }, [alias]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <h1 className="text-2xl font-bold text-blue-600">
        Redirecting, please wait...
      </h1>
    </div>
  );
}

// Main App component
const App = () => {
if(!window.localStorage.getItem("auth-token")){
   window.location.href = "/login"
}
  const handleLoginSuccess = (data) => {
    console.log("Login Successful:", data);
    window.localStorage.setItem("auth-token", data.idToken);

    // Example: Send the ID token to the backend
   window.location.href = "/shortner"
  };

  return (
    <Router> {/* Ensure Router is wrapping the entire application */}
      <div>
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-center text-2xl">URL Shortener </h1>
        </header>
        <main>
          <Routes>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/shortner" element={<ShortenUrl />} />
            <Route path="/a/:alias" element={<RedirectHandler />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
