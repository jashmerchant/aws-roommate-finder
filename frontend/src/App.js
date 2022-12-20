import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "./Home"
import Login from "./Login"
import Register from "./Register"
import MyProfile from "./MyProfile"
// import PremiumContent from "./PremiumContent"
import { getUser, getToken, setUserSession, resetUserSession } from './service/AuthService'
import axios from 'axios';
import NotFound from './NotFound';

const verifyTokenUrl = "https://lqjgcqa4lf.execute-api.us-east-1.amazonaws.com/prod/verify"

function App() {
  const [isAuthenticating, setAuthenticating] = useState(true);


  useEffect(() => {
    const token = getToken();
    if (token === 'undefined' || token === undefined || token === null || !token) {
      return;
    }

    const requestBody = {
      user: getUser(),
      token: token
    }

    axios.post(verifyTokenUrl, requestBody).then(response => {
      setUserSession(response.data.user, response.data.token);
      setAuthenticating(false)
    }).catch((error) => {
      resetUserSession();
      setAuthenticating(false)
    })
  }, []);

  // const token = getToken()

  return (
    <div className="App">
      <BrowserRouter>
        <div className="header">
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          {/* <Link to="/premium-content">Premium Content</Link> */}
          <Link to="/my-profile">My Profile</Link>
        </div>
        <div className="content">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/premium-content" element={<PremiumContent />} /> */}
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
