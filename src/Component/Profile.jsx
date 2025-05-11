import React, { useState, useEffect } from "react";
import "../App.css";
import '../styles/Profile.css';
import basePic from "../assets/baseProfilePic.png"
import friendLogo from "../assets/friends.png";
import chatLogo from "../assets/chatLogo.png";
import postLogo from "../assets/postIcon.png"
import {Link} from "react-router-dom";
import blankphoto from "../assets/emptyphoto.jpg";

// The Profile component shows data from the user table.  This is set up fairly generically to allow for you to customize
// user data by adding it to the attributes for each user, which is just a set of name value pairs that you can add things to
// in order to support your group specific functionality.  In this example, we store basic profile information for the user
const Profile = (props) => {
  // states which contain basic user information/attributes
  // Initially set them all as empty strings to post them to the backend
  const [name, setName] = useState(localStorage.getItem("name") || "Name");
  const [username, setUsername] = useState('');
  const storedProfilePicture = localStorage.getItem("profilePicture");
  const [picture, setProfilePicture] = useState(storedProfilePicture ? storedProfilePicture : blankphoto);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Replace componentDidMount for fetching data
  useEffect(() => {
    fetch(
        `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem(
            "user"
        )}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
    )
        .then((res) => res.json())
        .then((result) => {
          if (result && result.attributes) {
            // if the attributes already exists, and they are stored, set the states to those attributes
            // so that nothing gets overwritten
            setUsername(result.attributes.username || "");
            setFirstName(result.attributes.firstName || "");
            setLastName(result.attributes.lastName || "");
            setFavoriteColor(result.attributes.favoritecolor || "");
            setProfilePicture(result.attributes.picture || "");
          }
        })
        .catch((error) => {
          alert("error!");
        });
  }, []);

  // This is the function that will get called the first time that the component gets rendered.  This is where we load the current
  // values from the database via the API, and put them in the state so that they can be rendered to the screen.
  const submitHandler = (event) => {
    //keep the form from actually submitting, since we are handling the action ourselves via
    //the fetch calls to the API
    event.preventDefault();

    //make the api call to the user controller, and update the user fields (username, firstname, lastname)
    fetch(
        `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem(
            "user"
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            attributes: {
              username: username,
              firstName: firstName,
              lastName: lastName,
              favoritecolor: favoriteColor,
              picture: picture,
            },
          }),
        }
    )
        .then((res) => res.json())
        .then((result) => {
          setResponseMessage(result.Status);
        })
        .catch((error) => {
          alert("error!");
        });
  };

  const uploadPicture = (event) => {
    event.preventDefault();

    // event.target.files[0] holds the file object that the user is uploading
    const file = event.target.files[0];

    // FormData objects are used to capture HTML form and submit it using fetch or another network method.
    // provides a way to construct a set of key/value pairs representing form fields and their values
    // we can use this formData to send the attributes for the file-uploads endpoint
    const formData = new FormData();

    formData.append("uploaderID", sessionStorage.getItem("user")); // the id of the user who is uploading the file
    formData.append("attributes", JSON.stringify({})); // attributes holds an empty object, can put whatever you want here
    formData.append("file", file); // the file itself

    // make api call to file-uploads endpoint to post the profile picture
    fetch(process.env.REACT_APP_API_PATH + "/file-uploads", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: formData, // send the formdata to the backend
    })
        .then((res) => res.json())
        .then((result) => {
          // pictureURL holds the url of where the picture is stored to show on the page
          let pictureURL = "https://webdev.cse.buffalo.edu" + result.path;
          setProfilePicture(pictureURL);
        });
  };

  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.
  return (
      <div className="profileContainer">
          <div className="leftProfileColumn">
              <Link to="/settings" className="noDecLink">
                  <div className="profileButton">
                      <div>
                          <img
                              src={basePic}
                              className="profilePic"
                          />
                      </div>
                      <div className="profileText">
                          <div className="profileName">
                              {name}
                          </div>
                          <br/>
                          <div>
                              Age:
                              <br/>
                              Lo:
                          </div>
                      </div>
                  </div>
              </Link>
              <Link to="/notifications" className="noDecLink">
                  <div className="profileNotifications">
                      <div className="notifHeader">
                          <br/>
                          Notifications
                      </div>
                      <br/>
                      No notifications...
                  </div>
              </Link>
              <Link to="/events" className="noDecLink">
                  <div className="profileEvents">
                      <div className="eventHeader">
                          <br/>
                          Upcoming Events
                      </div>
                      <br/>
                      No upcoming events...
                  </div>
              </Link>
              <Link to="/post" className="noDecLink">
                  <div className="postButton">
                      <img
                          src={postLogo}
                      />
                      POST
                  </div>
              </Link>
          </div>
          <div className="middleProfileColumn">
          </div>
          <div className="rightProfileColumn">
              <div className="profileFriends">
                  <div className="searchContainer">
                      <input
                          type="text"
                          className="searchBar"
                          placeholder="   Search for people or chats..."
                      />
                  </div>
                  <br/>
                  <div className="friendsLogoText">
                      <img
                          src={friendLogo}
                          className="friendLogo"
                      />
                      Friends
                  </div>
                  <Link to="/friend" className="noDecLink">
                      <div className="friend">
                          <img
                              src={friendLogo}
                              className="friendPic"
                          />
                          <div>
                              <div className="friendName">
                                  Friend's Name
                              </div>
                              <div className="friendUser">
                                  @username
                              </div>
                          </div>
                      </div>
                  </Link>
                  <Link to="/friend" className="noDecLink">
                      <div className="friend">
                          <img
                              src={friendLogo}
                              className="friendPic"
                          />
                          <div>
                              <div className="friendName">
                                  Friend's Name
                              </div>
                              <div className="friendUser">
                                  @username
                              </div>
                          </div>
                      </div>
                  </Link>
                  <Link to="/friend" className="noDecLink">
                      <div className="friend">
                          <img
                              src={friendLogo}
                              className="friendPic"
                          />
                          <div>
                              <div className="friendName">
                                  Friend's Name
                              </div>
                              <div className="friendUser">
                                  @username
                              </div>
                          </div>
                      </div>
                  </Link>
                  <Link to="/friend" className="noDecLink">
                      <div className="friend">
                          <img
                              src={friendLogo}
                              className="friendPic"
                          />
                          <div>
                              <div className="friendName">
                                  Friend's Name
                              </div>
                              <div className="friendUser">
                                  @username
                              </div>
                          </div>
                      </div>
                  </Link>
              </div>
              <div className="profileChats">
                  <div className="chatLogoText">
                      <img
                          src={chatLogo}
                          className="chatLogo"
                      />
                      Chats
                  </div>
                  <Link to="/messages/1" className="noDecLink">
                      <div className="chatGroup">
                          <img
                              src={chatLogo}
                              className="chatPic"
                          />
                          <div>
                              <div className="friendName">
                                  GC / Event Name
                              </div>
                              <div className="friendUser">
                                  7 Members
                              </div>
                          </div>
                      </div>
                  </Link>
                  <Link to="/messages/1" className="noDecLink">
                      <div className="chatGroup">
                          <img
                              src={chatLogo}
                              className="chatPic"
                          />
                          <div>
                              <div className="friendName">
                                  GC / Event Name
                              </div>
                              <div className="friendUser">
                                  7 Members
                              </div>
                          </div>
                      </div>
                  </Link>
                  <Link to="/messages/1" className="noDecLink">
                      <div className="chatGroup">
                          <img
                              src={chatLogo}
                              className="chatPic"
                          />
                          <div>
                              <div className="friendName">
                                  GC / Event Name
                              </div>
                              <div className="friendUser">
                                  7 Members
                              </div>
                          </div>
                      </div>
                  </Link>
                  <Link to="/messages/0" className="noDecLink">
                      <button className="showAllChats">
                          Show All
                      </button>
                  </Link>
              </div>
          </div>
      </div>
  );
};

export default Profile;
