import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/RegisterForm.css';
import check from '../assets/checkmark.png'
import x from '../assets/xmark.png'
import LanguageContext from "../context/LanguageContext";
import cityArt from "../assets/CitySkyline.png";
import airplane from "../assets/airplane.png";

const RegisterForm = ({ setLoggedIn }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [age, setAge] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [registerErrorMessage, setErrorMessage] = useState("");
  const [isLong, setIsLong] = useState(false);
  const [hasNum, setHasNum] = useState(false);
  const [hasSpec, setHasSpec] = useState(false);
  const [hasCap, setHasCap] = useState(false);

  const navigate = useNavigate();
  // You can assign the user extra attributes for when they register an account.
  // As you can see on swagger, attributes is optional where its an object and you
  // can store extra attributes like profile picture, favorite color, etc.
  // to fill out when the user creates an account.

  useEffect(() => {
    // AI generated regex
    const isValidZipcode = /^\d{5}$/.test(zipcode); // Ensures zipcode is exactly 5 digits
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email format validation

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setHasSpec(false)
    }
    else{
      setHasSpec(true)
    }
    if (!/\d/.test(password)) {
      setHasNum(false)
    }
    else{
      setHasNum(true)
    }
    if (!/[A-Z]/.test(password)) {
      setHasCap(false)
    }
    else{
      setHasCap(true)
    }
    if (password.length < 8) {
      setIsLong(false)
    } 
    else{
      setIsLong(true)
    }

    if (!username) {
      setErrorMessage(language === "zh-tw" ? "帳號名稱為必填項目。" : "Username is required.");
    } else if (!isValidEmail) {
      setErrorMessage(language === "zh-tw" ? "電子郵件格式無效。" : "Invalid email format.");
    } else if (!password) {
      setErrorMessage(language === "zh-tw" ? "密碼為必填項目。" : "Password is required.");
    } else if (password !== confirmPassword) {
      setErrorMessage(language === "zh-tw" ? "密碼不一致。" : "Passwords do not match.");
    } else if (!isValidZipcode) {
      setErrorMessage(language === "zh-tw" ? "郵遞區號必須是 5 位數。" : "Zipcode must be a 5-digit number.");
    } else if (!age || isNaN(age) || Number(age) < 18) {
      setErrorMessage(language === "zh-tw" ? "年齡必須滿 18 歲。" : "Age must be 18 or older.");
    } else if (!hasCap || !hasSpec || !isLong || !hasNum) {
      setErrorMessage(language === "zh-tw" ? "密碼未符合所有規則。" : "Password doesn't meet requirements");
    } else {
      setErrorMessage("");
      setIsDisabled(false);
      return;
    }
    

    setIsDisabled(true);

  }, [username, email, password, confirmPassword, zipcode, age]);

  const submitHandler = (event) => {
    // event.preventDefault() prevents the browser from performing its default action
    // In this instance, it will prevent the page from reloading
    // keeps the form from actually submitting as well
    event.preventDefault();
    fetch(process.env.REACT_APP_API_PATH + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email, password, attributes: {
          Zipcode: { zipcode },
          Age: { age },
          Username: { username }
        }
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // Successfully registered an account
        console.log(result);
        // set the auth token and user ID in the session state
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("user", result.userID);
        // call setLoggedIn hook from App.jsx to save the login state throughout the app
        setLoggedIn(true);
        // Reload the window for when the user logs in to show the posts
        navigate("/");
        window.location.reload();
      });
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150vh", backgroundColor: "white" }}>
      <div style={{ zIndex: '1000', width: "500px", padding: "20px", borderRadius: "10px", backgroundColor: "#D9D9D9", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#000000", textAlign: "center", marginBottom: "20px" }}>{language === "zh-tw" ? "註冊" : "Register"}</h2>
        <form onSubmit={submitHandler}>
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>{language === "zh-tw" ? "帳號名稱" : "Username"}</h4>
          <input
            type="text"
            placeholder={language === "zh-tw" ? "輸入帳號名稱" : "Enter Username"}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>{language === "zh-tw" ? "電子郵件" : "Email"}</h4>
          <input
            type="email"
            placeholder={language === "zh-tw" ? "輸入電子郵件" : "Enter Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>{language === "zh-tw" ? "密碼" : "Password"}</h4>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              placeholder={language === "zh-tw" ? "輸入您的密碼" : "Enter your Password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }
              }
              required
              style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
          <div className="passrequire">
            {isLong && (<div className="requirementcor"><img src={check} alt="checkmark"></img>{language === "zh-tw" ? " 長度足夠" : " is long enough"}</div>)}
            {!isLong && (<div className="requirementwrong"><img src={x} alt="xmark"></img>{language === "zh-tw" ? " 必須至少 8 個字元" : " Must be 8 characters long"}</div>)}
            {hasCap && (<div className="requirementcor"><img src={check} alt="checkmark"></img>{language === "zh-tw" ? "必須有 1 個大寫字母" : "Must have 1 uppercase letter"}</div>)}
            {!hasCap && (<div className="requirementwrong"><img src={x} alt="xmark"></img> {language === "zh-tw" ? "必須有 1 個大寫字母" : "Must have 1 uppercase letter"}</div>)}
            {hasNum && (<div className="requirementcor"><img src={check} alt="checkmark"></img>{language === "zh-tw" ? "必須有 1 個數字" : "Must have 1 number"}</div>)}
            {!hasNum && (<div className="requirementwrong"><img src={x} alt="xmark"></img> {language === "zh-tw" ? "必須有 1 個數字" : "Must have 1 number"}</div>)}
            {hasSpec && (<div className="requirementcor"><img src={check} alt="checkmark"></img> {language === "zh-tw" ? "必須有 1 個特殊字元" : "Must have 1 special character"}</div>)}
            {!hasSpec && (<div className="requirementwrong"><img src={x} alt="xmark"></img>{language === "zh-tw" ? "必須有 1 個特殊字元" : "Must have 1 special character"}</div>)}
          </div>
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>{language === "zh-tw" ? "確認密碼" : "Confirm Password"}</h4>
          <div style={{ position: "relative" }}>
            <input
              className="inputContainer"
              type="password"
              placeholder={language === "zh-tw" ? "確認密碼" : "Confirm Password"}
              onChange={(event) => setConfirmPassword(event.target.value)}
              style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc" }}

            />
          </div>
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>{language === "zh-tw" ? "郵遞區號" : "Zipcode"}</h4>
          <div style={{ position: "relative" }}>
            <input
              className="inputContainer"
              type="text"
              placeholder={language === "zh-tw" ? "輸入郵遞區號" : "Enter Zipcode"}
              onChange={(event) => setZipcode(event.target.value)}
              style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc" }}

            />
          </div>
          <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>{language === "zh-tw" ? "年齡" : "Age"}</h4>
          <div style={{ position: "relative" }}>
            <input
              className="inputContainer"
              type="number"
              placeholder={language === "zh-tw" ? "輸入年齡" : "Enter Age"}
              onChange={(event) => setAge(event.target.value)}
              style={{ width: "90%", padding: "10px", marginBottom: "30px", borderRadius: "5px", border: "1px solid #ccc" }}

            />
          </div>
          <button type="submit" disabled= {isDisabled} style={{ width: "90%", padding: "10px", marginTop: "10px", borderRadius: "5px", backgroundColor: "#D7A582", color: "white", border: "none", cursor: "pointer" }}>
          {language === "zh-tw" ? "註冊" : "Register"}
          </button>
        </form>
        {registerErrorMessage && (
          <div className="registerErrorMessage">
            <p>{registerErrorMessage}</p>
          </div>
        )}
        <div>
        <p className="registerAAU">
          {language === "zh-tw" ? (
            <>已經有帳號了嗎？<Link to="/">登入！</Link></>
          ) : (
            <>Already a user? <Link to="/login">Log In!</Link></>
          )}
        </p>
        </div>
      </div>

      <div className="settingsTop"></div>
      <img src={cityArt}  className="cityArtLogin" style={{bottom:'0px', position:'fixed'}}></img>

    </div>
  );
  // return (
  //     <div className="registerContainer">
  //         <h1 className="registerText">Register</h1>
  //         <form className="form-container" onSubmit={submitHandler}>
  //             <div className="registerFieldText">
  //                 Username
  //                 <br/>
  //                 <input
  //                     className="inputContainer"
  //                     type="text"
  //                     placeholder="Enter Username"
  //                     onChange={(event) => setUsername(event.target.value)}
  //                 />
  //             </div>
  //             <div className="registerFieldText">
  //                 Email
  //                 <br/>
  //                 <input
  //                     className="inputContainer"
  //                     type="email"
  //                     placeholder="Enter Email"
  //                     // event.target refers to the DOM that is triggered from an event, such as onChange, onClick, etc.
  //                     // event.target.value holds the value that is passed in to the input field from the onChange
  //                     onChange={(event) => setEmail(event.target.value)}
  //                 />
  //             </div>
  //             <div className="registerFieldText">
  //                 Password
  //                 <br/>
  //                 <input
  //                     className="inputContainer"
  //                     type="password"
  //                     placeholder="Enter Password"
  //                     onChange={(event) => setPassword(event.target.value)}
  //                 />
  //             </div>
  //             <div className="registerFieldText">
  //                 Confirm Password
  //                 <br/>
  //                 <input
  //                     className="inputContainer"
  //                     type="password"
  //                     placeholder="Confirm Password"
  //                     onChange={(event) => setConfirmPassword(event.target.value)}
  //                 />
  //             </div>
  //             <div className="registerFieldText">
  //                 Zipcode
  //                 <br/>
  //                 <input
  //                     className="inputContainer"
  //                     type="text"
  //                     placeholder="Enter Zipcode"
  //                     onChange={(event) => setZipcode(event.target.value)}
  //                 />
  //             </div>
  //             <div className="registerFieldText">
  //                 Age
  //                 <br/>
  //                 <input
  //                     className="inputContainer"
  //                     type="number"
  //                     placeholder="Enter Age"
  //                     onChange={(event) => setAge(event.target.value)}
  //                 />
  //             </div>
  //             <br/>
  //             <input
  //                 type="submit"
  //                 className="registerButton"
  //                 value="     Register     "
  //                 disabled={isDisabled}
  //             />
  //         </form>
  //         {registerErrorMessage && (
  //             <div className="registerErrorMessage">
  //                 <p>{registerErrorMessage}</p>
  //             </div>
  //         )}
  //         <div>
  //             <p className="registerAAU">
  //                 Already a user? <Link to="/">Log In!</Link>
  //             </p>
  //         </div>
  //     </div>
  // );
};

export default RegisterForm;
