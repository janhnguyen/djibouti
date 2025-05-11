import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/resetPassword.css';
import check from '../assets/checkmark.png'
import x from '../assets/xmark.png'

// example of how you can set up a component to request a password reset for an account
// The only thing you need to do is send the email of the account to the backend api route and then
// the email will get a code and you use that code with the reset-password route
// (You can see more on the swagger API documentation)
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  // State used to conditionally render different forms
  // When the user gets the token, this is set to true to show the second form to input a new password
  const [gotToken, setGotToken] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [isLong, setIsLong] = useState(false);
  const [hasNum, setHasNum] = useState(false);
  const [hasSpec, setHasSpec] = useState(false);
  const [hasCap, setHasCap] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleResetRequest = (event) => {
    event.preventDefault();

    // fetch the api route to send a reset password request

    fetch(process.env.REACT_APP_API_PATH + "/auth/request-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }).then((res) => {
      // the request successfully worked, so set gotToken state to true
      if (res.ok) {
        setGotToken(true);
      }
    });
  };
  useEffect(() => {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasCapital = /[A-Z]/.test(password);
    const isLongEnough = password.length >= 8;
  
    setHasSpec(hasSpecial);
    setHasNum(hasNumber);
    setHasCap(hasCapital);
    setIsLong(isLongEnough);
  
    const isValid = hasSpecial && hasNumber && hasCapital && isLongEnough;
    setIsDisabled(!isValid);
  }, [password]);

  const handleResetPassword = (event) => {
    event.preventDefault();

    console.log("Token is " + token + " new password is " + password)

    fetch(process.env.REACT_APP_API_PATH + "/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    }).then((res) => {
      if (res.ok) {
        // New password submitted, so have them go to login page to login with new password
        navigate("/");
      }
    });
  };
  // return (
  //   <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3f4f6" }}>
  //     <div style={{ width: "400px", padding: "20px", borderRadius: "10px", backgroundColor: "#D9D9D9", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
  //       <h2 style={{ color: "#000000", textAlign: "center", marginBottom: "20px" }}>Forgot Password</h2>
  //       <form onSubmit={handleResetPassword}>

  //         <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>Email</h4>
  //         <input 
  //           type="email" 
  //           placeholder="Enter Email" 
  //           value={email} 
  //           onChange={(e) => setEmail(e.target.value)} 
  //           required
  //           style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc" }}
  //         />
  //         <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}></h4>
  //         <button type="submit" style={{ width: "90%", padding: "10px", marginTop: "10px", borderRadius: "5px", backgroundColor: "#D7A582", color: "white", border: "none", cursor: "pointer" }}>
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );
  return (
    <>
      {!gotToken ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3f4f6" }}>
          <div style={{ width: "400px", padding: "20px", borderRadius: "10px", backgroundColor: "#D9D9D9", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h2 style={{ color: "#000000", textAlign: "center", marginBottom: "20px" }}>Forgot Password</h2>
            <form onSubmit={handleResetRequest}>

              <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}>Email</h4>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "90%", padding: "10px", marginBottom: "0px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
              <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}></h4>
              <button type="submit" style={{ width: "90%", padding: "10px", marginTop: "10px", borderRadius: "5px", backgroundColor: "#D7A582", color: "white", border: "none", cursor: "pointer" }}>
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (



        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3f4f6" }}>
          <div style={{ width: "500px", padding: "20px", borderRadius: "10px", backgroundColor: "#D9D9D9", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h2 style={{ color: "#000000", textAlign: "center", marginBottom: "20px" }}>Reset Password</h2>
            <form onSubmit={handleResetPassword} className="reset">
              <label className="co">
                Token
                <input
                  className="lilGap"
                  type="text"
                  value={token}
                  // event.target refers to the DOM that is triggered from an event, such as onChange, onClick, etc.
                  // event.target.value holds the value that is passed in to the input field from the onChange
                  onChange={(event) => setToken(event.target.value)}
                />
              </label>
              <br />
              <label className="co">
                New Password
                <input
                  className="lilGap"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                />
              </label>
              <div className="passrequire">
                {isLong && (<div className="requirementcor"><img src={check} alt="checkmark"></img> is long enough</div>)}
                {!isLong && (<div className="requirementwrong"><img src={x} alt="xmark"></img> Must be 8 characters long</div>)}
                {hasCap && (<div className="requirementcor"><img src={check} alt="checkmark"></img> Has 1 Uppercase letter</div>)}
                {!hasCap && (<div className="requirementwrong"><img src={x} alt="xmark"></img> Must have 1 Uppercase letter</div>)}
                {hasNum && (<div className="requirementcor"><img src={check} alt="checkmark"></img> Has 1 number</div>)}
                {!hasNum && (<div className="requirementwrong"><img src={x} alt="xmark"></img> Must have 1 number</div>)}
                {hasSpec && (<div className="requirementcor"><img src={check} alt="checkmark"></img>  Has 1 special character</div>)}
                {!hasSpec && (<div className="requirementwrong"><img src={x} alt="xmark"></img> Must have 1 special character</div>)}
              </div>


              <h4 style={{ color: "#000000", textAlign: "left", marginBottom: "0px" }}></h4>
              <button type="submit" disabled={isDisabled} style={{ width: "90%", padding: "10px", marginTop: "10px", borderRadius: "5px", backgroundColor: "#D7A582", color: "white", border: "none", cursor: "pointer" }}>
                Submit
              </button>
            </form>
            <div>
              <p className="co">
                Login <Link to="/login">here</Link>
              </p>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ResetPassword;