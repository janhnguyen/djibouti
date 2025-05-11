import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import basePic from "../assets/baseProfilePic.png"; 
import friendLogo from "../assets/friends.png";
import chatLogo from "../assets/chatLogo.png";
import FriendsList from "./homePageFriendList";
import "../styles/SideNavBar.css";

const SideNavBar = ({
  userID,
  socket,
  loadFriends,
  connections,
  isLoaded,
  error,
  chatList,
  chatUserProfiles,
  userEvents,
  myCreatedEvents,
  expandedEventId,
  setExpandedEventId,
  handleCancelEvent,
  closeEvent,
  language,
}) => {
  const [profilePics, setProfilePics] = useState({});

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfilePics = async () => {
      if (!chatList || chatList.length === 0) return;

      const newProfilePics = {};

      await Promise.all(
        chatList.map(async ([otherUserID, _chat]) => {
          try {
            const res = await fetch(`${process.env.REACT_APP_API_PATH}/users/${otherUserID}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const userData = await res.json();
            const imageID = userData.attributes?.ProfileImageID?.imageid;

            if (imageID) {
              const imageRes = await fetch(`${process.env.REACT_APP_API_PATH}/file-uploads/${imageID}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const imageData = await imageRes.json();
              if (imageData.path) {
                newProfilePics[otherUserID] = "https://webdev.cse.buffalo.edu" + imageData.path;
              } else {
                newProfilePics[otherUserID] = basePic;
              }
            } else {
              newProfilePics[otherUserID] = basePic;
            }
          } catch (err) {
            console.error("Error loading profile pic for user:", otherUserID, err);
            newProfilePics[otherUserID] = basePic;
          }
        })
      );

      setProfilePics(newProfilePics);
    };

    fetchProfilePics();
  }, [chatList, token]);

  return (
    <div className="sideNavContainer">

      {/* Friends Section */}
      <div className="sideSection">
        <div className="sideSectionHeader">
          <img src={friendLogo} alt="Friends" className="sideIcon" />
          <span>{language === "zh-tw" ? "好友" : "Friends"}</span>
        </div>
        <FriendsList
          socket={socket}
          userid={userID}
          loadFriends={loadFriends}
          connections={connections}
          setConnections={() => {}}
          isLoaded={isLoaded}
          error={error}
        />
      </div>

      <div className="sideSection">
        <div className="sideSectionHeader">
          <span>{language === "zh-tw" ? "即將到來的活動" : "Upcoming Events"}</span>
        </div>
        {userEvents.length > 0 ? (
          <div className="sideNavEventsList">
            {userEvents.map((event) => (
              <div key={event.id} className="sideEventItem">
                <div
                  className="eventTitle"
                  onClick={() =>
                    setExpandedEventId(expandedEventId === event.id ? null : event.id)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {event.title}
                </div>

                <div className="eventMeta">
                  <span className="eventCreator">
                    {language === "zh-tw" ? "建立者：" : "By: "}{" "}
                    <Link
                      to={`/profile/${event.creator}`}
                      state={{ who: event.creator }}
                      className="eventCreatorLink"
                    >
                      {event.creator || (language === "zh-tw" ? "未知用戶" : "Someone")}
                    </Link>
                  </span>
                  <button onClick={() => handleCancelEvent(event.id)}>
                    {language === "zh-tw" ? "取消活動" : "Cancel Event"}
                  </button>
                </div>

                {expandedEventId === event.id && (
                  <div className="eventContent">
                    {event.message || (language === "zh-tw" ? "未提供其他資訊。" : "No additional info provided.")}
                  </div>
                )}
              </div>
            ))}
            {myCreatedEvents.length > 0 && (
              <>
                <div className="sideSectionHeader" style={{ marginTop: "10px" }}>
                  <span>{language === "zh-tw" ? "您建立的活動" : "Your Created Events"}</span>
                </div>
                {myCreatedEvents.map((event) => (
                  <div key={event.id} className="sideEventItem">
                    <div className="eventTitle">{event.title}</div>
                    <div className="eventMeta">
                      <span className="eventStatus">
                        {language === "zh-tw" ? "狀態：" : "Status: "} {event.status}
                      </span>
                      <span className="eventCount">
                        {language === "zh-tw" ? "人數上限：" : "Head Count: "} {event.head_count}
                      </span>
                    </div>
                    {event.status !== "closed" && (
                      <button onClick={() => closeEvent(event.id)}>
                        {language === "zh-tw" ? "關閉活動" : "Close Event"}
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <Link to="/activities" className="sideNavEmptyText">
            {language === "zh-tw" ? "目前沒有即將到來的活動..." : "No Upcoming Events..."}
          </Link>
        )}
      </div>

    </div>
  );
};

export default SideNavBar;