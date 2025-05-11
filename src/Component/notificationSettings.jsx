import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import blankphoto from "../assets/emptyphoto.jpg"


function Settings() {
   const navigate = useNavigate();
   const userToken = sessionStorage.getItem("token");


   useEffect(() => {
       if (!userToken) {
           navigate("/");
       }
   }, [userToken, navigate]);


   const [name, setName] = useState(localStorage.getItem("name") || "Name");
   const [username, setUsername] = useState(localStorage.getItem('username') || 'Username');
   const [email, setEmail] = useState(localStorage.getItem('email') || 'email@email.com');
   const [birthday, setBirthday] = useState(localStorage.getItem("birthday") || "1990-01-01");
   const [phone, setPhone] = useState(localStorage.getItem("phone") || "123-456-7890");
   const [followers, setFollowers] = useState(1200);
   const [following, setFollowing] = useState(890);
   const [errorMessage, setErrorMessage] = useState("");
   const storedProfilePicture = localStorage.getItem("profilePicture");
   const [profilePicture, setProfilePicture] = useState(storedProfilePicture ? storedProfilePicture : blankphoto);



   const handleSignOut = () => {
       sessionStorage.removeItem("token");
       sessionStorage.removeItem("user");
       navigate("/");
   };


   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result);
            localStorage.setItem("profilePicture", reader.result);
        };
        reader.readAsDataURL(file);
    }
};



   const handleSaveChanges = () => {
       const cleanedPhone = phone.replace(/\D/g, ""); // remove non numbers from phone numnber
       if (cleanedPhone.length !== 10) {
           setErrorMessage("Phone number must be exactly 10 digits.");
           return;
       }
       setErrorMessage("");
       localStorage.setItem("name", name);
       localStorage.setItem("birthday", birthday);
       localStorage.setItem("phone", phone);
       localStorage.setItem("profilePicture", profilePicture);
       localStorage.setItem("username", username);
       localStorage.setItem("email", email);
       alert("Changes saved!");
   };


   return (
       <div className='settingsLayout'>
           <div className='leftSetting'>
               <Link to='/profilePage' className='noDecLink'>
                   <div className='profileSetting'>
                       <img
                           src={profilePicture}
                           style={{ height: "200px", width: "200px", padding: "20px" }}
                       />
                       <div>
                           <div>
                               <label style={{fontWeight: 'bold', fontSize: '30px'}}>{name}</label>
                           </div>
                           <div>
                               <label style={{fontWeight: 'bold', fontSize: '30px'}}></label>
                           </div>
                           <div>
                               <label style={{fontSize: '25px'}}>Followers : 4</label>
                           </div>
                           <div>
                               <label style={{fontSize: '25px'}}>Following : 2</label>
                           </div>
                       </div>
                   </div>
               </Link>
               <Link to='/settings' className='noDecLink'>
                  <div className='settingButtons' style={{alignContent: 'center'}}>
                  <img
                          src={blankphoto}
                          style={{height: '40px', width: '40px', marginRight: '20px'}}
                      />
                      Account
                  </div>
              </Link>
               <Link to='/friendSettings' className='noDecLink'>
                   <div className='settingButtons' style={{alignContent: 'center'}}>
                   <img
                           src={blankphoto}
                           style={{height: '40px', width: '40px', marginRight: '20px'}}
                       />
                       Friends
                   </div>
               </Link>
               <Link to='/notificationSettings' className='noDecLink'>
                   <div className='settingButtons' style={{alignContent: 'center'}}>
                   <img
                           src={blankphoto}
                           style={{height: '40px', width: '40px', marginRight: '20px'}}
                       />

                       Notifications
                   </div>
               </Link>
               <Link to='/faqSettings' className='noDecLink'>
                   <div className='settingButtons' style={{alignContent: 'center'}}>
                       <img
                           src={blankphoto}
                           style={{height: '40px', width: '40px', marginRight: '20px'}}
                       />
                       FAQ
                   </div>
               </Link>
           </div>
           <div className='rightSetting'>
               My Account
               <div className='accountInfo'>
                   <div className='settingsField' style={{alignContent: 'center'}}>
                       <label style={{marginLeft: '20px'}}>Mentions</label>
                   </div>
                   <div className='settingsField' style={{borderTop: "1px solid #b8b8b8", alignContent: 'center'}}>
                       <label style={{marginLeft: '20px'}}>Messages</label>
                   </div>
                   <div className='settingsField' style={{borderTop: "1px solid #b8b8b8", alignContent: 'center'}}>
                       <label style={{marginLeft: "20px"}}>Friend Requests</label>
                       <br/>
                   </div>
                   <div className='settingsField' style={{borderTop: "1px solid #b8b8b8", alignContent: 'center'}}>
                       <label style={{marginLeft: "20px"}}>Friend Birthdays</label>
                       <br/>
                   </div>
               </div>
               <button
                   type="button"
                   onClick={handleSaveChanges}
                   style={{
                       width: "98%",
                       padding: "10px",
                       marginTop: "10px",
                       borderRadius: "20px",
                       backgroundColor: "#D7A582",
                       color: "white",
                       border: "none",
                       cursor: "pointer"
                   }}
               >
                   Save Changes
               </button>
               <button
                   type="button"
                   onClick={handleSignOut}
                   style={{
                       width: "98%",
                       padding: "10px",
                       marginTop: "10px",
                       borderRadius: "20px",
                       backgroundColor: "#E37479",
                       color: "white",
                       border: "none",
                       cursor: "pointer"
                   }}
               >
                   Sign Out
               </button>
           </div>
       </div>
   );
}


export default Settings;



