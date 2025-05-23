import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Component/HomePage";
import Navbar from "./Component/Navbar";
import Friends from "./Component/Friends";
import Groups from "./Component/Groups";
import Modal from "./Component/Modal";
import PromiseComponent from "./Component/PromiseComponent";
import RegisterForm from "./Component/RegisterForm";
import ResetPassword from "./Component/ResetPassword";
import Messaging from "./Component/Messaging";
import HeaderBar from "./Component/HeaderBar";
import Michael from "./Component/Michael";
import Jason from "./Component/Jason";
import Sajjad from "./Component/Sajjad"
import Jackson from "./Component/Jackson"
import About from "./Component/About";
import Dylan from "./Component/Dylan";
import Settings from "./Component/Settings";
import Bookmarked from "./Component/Bookmarked";
import ProfilePage from "./Component/Profile";
import CitiesList from "./Component/CitiesList";
import { io } from "socket.io-client";
import Login from "./Component/login";
import Buffalo from "./Component/Buffalo";
import Footer from "./Component/Footer";
import FriendSettings from "./Component/friendsettings";
import NotificationSettings from "./Component/notificationSettings";
import FaqSettings from "./Component/faqSettings";
import Styleguide from "./Component/Styleguide";
import ProfilePages from "./Component/ProfilePage";
import CityInfo from "./Component/cityInfo";
import ActivitiesPage from "./Component/ActivitiesPage";
import LanguageContext from "./context/LanguageContext"; 


// import { AboutMe } from "./Component/AboutMe";


// App.jsx is the starting point for the application.  This is the component called by index, which will be rendered when
// a user goes to your app URL.  This component will handle routing to other parts of your app, and any initial setup.

// Initalize the socket with the respective path and tenantID
// NEED this in App.jsx to use the socket throughout the application for real-time connections
const socket = io(process.env.REACT_APP_API_PATH_SOCKET, {
  path: '/hci/api/realtime-socket/socket.io',
  query: {
    tenantID: "djibouti"
  }
})
export { socket }

function App() {
  
  // logged in state, which tracks the state if the user is currently logged in or not
  // initially set to false
  const [loggedIn, setLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [language, setLanguage] = useState("en"); // default


  // basic logout function, removes token and user id from session storage
  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setLoggedIn(false);
    // reloads the window, so we get back to the login form
    window.location.reload();
  };

  //const login = (e) => {
  //  e.preventDefault();
  //  setRefreshPosts(true);
  //  setLoggedIn(true);
  //};

  const doRefreshPosts = () => {
    console.log("CALLING DOREFRESHPOSTS IN APP.JSX");
    setRefreshPosts(true);
  };

  const toggleModal = (e) => {
    e.preventDefault();
    // Take the current state of openModal, and update it to be the negated value of that
    // ex) if openModal == false, this will update openModal to true
    setOpenModal((prev) => !prev);
    console.log(openModal);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to HCI socket server")
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
    <div className="App">
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <header className="App-header">
          < HeaderBar 
            toggleModal={(e) => toggleModal(e)}
            logout={(e) => logout(e)}
          />
          {/* <Navbar
            toggleModal={(e) => toggleModal(e)}
            logout={(e) => logout(e)}
          /> */}
          <div className="maincontent" id="mainContent">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    setLoggedIn={setLoggedIn}
                    doRefreshPosts={doRefreshPosts}
                    appRefresh={refreshPosts}
                  />
                }
              />

              <Route path="/homepage" element={
              <HomePage
                    setLoggedIn={setLoggedIn}
                    doRefreshPosts={doRefreshPosts}
                    appRefresh={refreshPosts}
                  />
                } />
              
              <Route path="/profile/:username" element={<ProfilePages />} />
              <Route path="/about" element={<About />} />
              <Route path="/michael" element={<Michael />}/>
              <Route path="/jason" element={<Jason />}/>
              <Route path="/sajjad" element={<Sajjad />}/>
              <Route path="/jackson" element={<Jackson />}/>
              <Route path="/profilepage" element={<ProfilePage/>}/>
              <Route path="/dylan" element={<Dylan />}/>
              <Route path="/mobile-friends-view" element={<Friends />} />
              <Route path="/mobile-chat-view" element={<Groups />} />
              <Route path="/mobile-setting" element={<Settings />} />
              {/* <Route path = "/styleguide" element = {<Styleguide/>}/>
              <Route path="/bookmarked" element={<Bookmarked />} />
              <Route path="/cities-list" element = {<CitiesList/>}/> */}
              <Route path = "/styleguide" element = {<Styleguide/>}/>
              <Route path="/bookmarked" element={<Bookmarked />} />
              <Route path="/cities-list" element = {<CitiesList/>}/>
              <Route path="/buffalo" element={<Buffalo />} />
              <Route
                path="/register"
                element={<RegisterForm setLoggedIn={setLoggedIn} />}
              />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/promise" element={<PromiseComponent />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/friendSettings" element={<FriendSettings />} />
              <Route path="/notificationSettings" element={<NotificationSettings />} />
              <Route path="/faqSettings" element={<FaqSettings />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:userCity" element={<CityInfo />} />
              <Route
                path="/login"
                element={<Login setLoggedIn={setLoggedIn} />}
              />
              {/* Declaring a route with a URL parameter "roomID" so that React router dynamically 
              captures the corresponding values in the URL when there is a match. 
              It is useful when dynamically rendering the same component for multiple paths.
              You can see how this is used in the Messaging component 
              as well as how this path is being set up in the FriendList component */}
              <Route path="/messages/:roomID" element={<Messaging />} />
              {/* <Route path="/aboutme" element={<AboutMe />} /> */}

            </Routes>
          </div>
        </header>
        <Footer />

        <Modal show={openModal} onClose={(e) => toggleModal(e)}>
          This is a modal dialog!
        </Modal>
      </div>
    </Router>
    </div>
  </LanguageContext.Provider>
    // the app is wrapped in a router component, that will render the
    // appropriate content based on the URL path.  Since this is a
    // single page app, it allows some degree of direct linking via the URL
    // rather than by parameters.  Note that the "empty" route "/", uses the HomePage
    // component, if you look in the HomePage component you will see a ternary operation:
    // if the user is logged in, show the "home page", otherwise show the login form.
    
  );
}
export default App;
