import "../styles/buffalo.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaEllipsisH, FaUserCircle, FaMapMarkerAlt, FaHome, FaCommentDots, FaCog, FaPlus } from "react-icons/fa";
import Posts from "./Posts";
import ProfileIcon from "../assets/Sheff_G.png";
import UserInfo from "./UserInfo";
import Footer from "./Footer";


// Buffalo is a functional component that displays a buffalo image and a link to the homepage

const Buffalo = (isLoggedIn, setLoggedIn, doRefreshPosts, appRefresh) => { 
    const [showAll, setShowAll] = useState(false);

    const handleShowAllClick = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="buffalo-container">

            <div className="rightSide">
                <div className="search-section">
                    <input type="text" placeholder="Search"  className="community-searchbar"/>
                </div>

                <h3>Current Members</h3>
                <div className="community-members-list-container">
                    <div className="community-members-list" 
                        style={{overflowY: showAll ? 'scroll' : 'hidden',
                        maxHeight: showAll ? '90%' : '325px',
                    }}>

                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        <UserInfo />
                        
                    </div>

                    <button onClick={handleShowAllClick}>
                        {showAll ? 'Show Less' : 'Show All'} 
                    </button>

                </div>
            </div>



            <div className="center">
                <h2>Welcome to Buffalo, NY!</h2>
                <Link to="/buffalo-info"><h3>Visit City page</h3></Link>   
                
            </div>


            <div className="leftSide">
                <div className="profile-section">
                    <div className="profile-section-left">
                    <Link to="/profilepage">
                        <FaUserCircle className="profile-icon" />
                    </Link>
                    </div>
                    <div className="profile-section-right">
                        <h5 className="name">'Your Name'</h5>
                        <p>Age: </p>
                        <p>LO:</p>
                    </div>
                </div>
                <div className="Notifications-section">
                    <h5>Notification</h5>
                </div>
                <div className="UpcomingEvents-section">
                    <h5>Upcoming Events</h5>
                </div>

                <button>
                    <FontAwesomeIcon icon={faList} />
                    <Posts />
                </button>         
            </div>
             
        </div>

        
    );
}



export default Buffalo;