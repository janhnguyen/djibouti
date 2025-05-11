import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { RiCentosLine } from "react-icons/ri";
import cityArt from "../assets/CitySkyline.png";
import airplane from "../assets/airplane.png";
import LanguageContext from "../context/LanguageContext";



const LoginForm = ({ setLoggedIn }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const submitHandler = (event) => {
    // event.preventDefault() prevents the browser from performing its default action
    // In this instance, it will prevent the page from reloading
    // keeps the form from actually submitting as well
    event.preventDefault();

    fetch(process.env.REACT_APP_API_PATH + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed, check your credentials.");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result)
        if (result.userID) {
          // Successfully logged in
          console.log(result);
          // set the auth token and user ID in the session state
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("user", result.userID);
          // call setLoggedIn hook from App.jsx to save the login state throughout the app
          setLoggedIn(true);
          setSessionToken(result.token);
          console.log(sessionToken, " SESSION TOKEN");
          // go to the homepage
          navigate("/");
          window.location.reload();
        }  else {
          setErrorMessage("Incorrect email or password.");
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("An error occurred. Please check your credentials.");
      });
  };


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "white", overflowX: "hidden" }}>
      <div style={{
        width: "400px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "rgba(217, 217, 217, 0.3)", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 1,
      }}>        
        <h2 style={{ color: "#000000", textAlign: "center", marginBottom: "20px", fontSize:'24px' }}>{language === "zh-tw" ? "登入" : "Login"}</h2>
        {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
        <form onSubmit={submitHandler}>
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px", fontSize:'18px', fontWeight:'normal', width: '97%', marginLeft:'auto'}}>{language === "zh-tw" ? "電子郵件" : "Email"}</h4>
          <input 
            type="email" 
            placeholder={language === "zh-tw" ? "輸入電子郵件" : "Enter Email"}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc", }}
          />
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px", fontSize:'18px', fontWeight:'normal', width: '97%', marginLeft:'auto'}}>{language === "zh-tw" ? "密碼" : "Password"}</h4>
          <div style={{ position: "relative" }}>
            <input 
              type="password" 
              placeholder={language === "zh-tw" ? "輸入您的密碼" : "Enter your Password"}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: "90%", padding: "10px", marginBottom: "30px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>

          <button type="submit" style={{ width: "90%", padding: "10px", marginTop: "10px", borderRadius: "5px", backgroundColor: "#D7A582", color: "white", border: "none", cursor: "pointer" }}>
          {language === "zh-tw" ? "登入" : "Login"}
          </button>
        </form>

        <Link to="/register">
          <button style={{ width: "90%", padding: "10px", marginTop: "10px", borderRadius: "5px", backgroundColor: "#D9D9D9", color: "black", border: "1px solid gray", cursor: "pointer"}}>
          {language === "zh-tw" ? "註冊" : "Register"}
          </button>
        </Link>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", fontSize: "14px", color: "#2563eb" }}>
          <Link to="/reset-password">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "blue" }}>{language === "zh-tw" ? "忘記密碼？" : "Forgot Password?"}</button>
          </Link>
        </div>
      </div>

      <div className="settingsTop"></div>
      <img src={cityArt}  className="cityArtLogin"></img>
      <img src={airplane}  className="loginPageAirplane"></img>
      
    </div>
  );
};

export default LoginForm;