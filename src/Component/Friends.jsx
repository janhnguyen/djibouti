import React, { useEffect, useState, useContext } from "react";
import FriendForm from "./FriendForm";
import FriendList from "./FriendList";
import { useNavigate } from "react-router-dom";
import "../styles/friends.css";
import friendIcon from "../assets/friends.png";
import friendslogo from "../assets/friendslogoicon.png";
import LanguageContext from "../context/LanguageContext";

const Friends = () => {
  const { language } = useContext(LanguageContext);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userToken = sessionStorage.getItem("token");
  const userID = sessionStorage.getItem("user");

  useEffect(() => {
    if (!userToken) {
      navigate("/");
    }
  }, [userToken, navigate]);

  const loadFriends = () => {
    fetch(
      process.env.REACT_APP_API_PATH + `/connections?anyUserID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (Array.isArray(result)) {
            setConnections(result);
          } else {
            console.error("Unexpected API response:", result);
            setConnections([]);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          console.error("❌ Error fetching connections:", error);
        }
      );
  };

  const loadPendingRequests = () => {
    fetch(
      process.env.REACT_APP_API_PATH + `/connections?toUserID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (Array.isArray(result)) {
            setPendingRequests(result.filter(conn => conn?.attributes?.status === "pending"));
          } else {
            console.error("Unexpected API response:", result);
            setPendingRequests([]);
          }
        },
        (error) => {
          console.error("❌ Error fetching pending requests:", error);
        }
      );
  };

  useEffect(() => {
    loadFriends();
    loadPendingRequests(); // initial fetch

    const interval = setInterval(() => {
      loadFriends();
      loadPendingRequests();
    }, 5000); // 👈 every 5 seconds

    return () => clearInterval(interval); // clear when component unmounts
  }, [userID]);

  return (
    <div className="boday">
      <h3 className="title"><img src={friendslogo} alt="friendslogo"></img>{language === "zh-tw" ? "好友" : "Friends"}</h3>
      <FriendList
        className="friendslistfriend"
        userid={userID}
        loadFriends={loadFriends}
        connections={connections}
        setConnections={setConnections}
        isLoaded={isLoaded}
        error={error}
      />
    </div>
  );
};

export default Friends;
