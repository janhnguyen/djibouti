import React, { useState, useEffect, useContext } from "react";

import FriendForm from "./FriendForm";
import blockIcon from "../assets/block_white_216x216.png";
import unblockIcon from "../assets/thumbsup.png";
import messageIcon from "../assets/comment.svg";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";
import '../styles/friendspage.css'
import defaultProfileIcon from "../assets/baseProfilePic.png";
import chat from "../assets/messageicon.png"
import { TbBackground } from "react-icons/tb";
import LanguageContext from "../context/LanguageContext";



const FriendList = (props) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const navigate = useNavigate();
  const userID = sessionStorage.getItem("user");
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    setConnections(props.loadFriends());
  }, []);



  useEffect(() => {
    const fetchAllProfileImages = async () => {
      const newProfileImages = {};

      for (const connection of props.connections.flat()) {
        const imageId = connection?.toUser?.attributes?.ProfileImageID?.imageid;
        if (imageId && !newProfileImages[imageId]) {
          try {
            const res = await fetch(`${process.env.REACT_APP_API_PATH}/file-uploads/${imageId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            });
            const result = await res.json();
            if (result?.path) {
              newProfileImages[imageId] = "https://webdev.cse.buffalo.edu" + result.path;
            }
          } catch (error) {
            console.error("Error fetching image for ID", imageId, error);
          }
        }
      }

      setProfileImages(newProfileImages);
    };

    fetchAllProfileImages();
  }, [props.connections]);


  const updateConnection = (id, status) => {
    console.log(`Attempting to update connection ${id} to status ${status}`);

    fetch(process.env.REACT_APP_API_PATH + "/connections/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        attributes: { status: status, type: userID },
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          props.setConnections([]);
          props.loadFriends();
        },
        (error) => {
          alert("error!");
        }
      );
  };

  const conditionalAction = (status, id, fromUserID, toUserID) => {

    const isBlocked = status === "blocked" && Number(toUserID) === Number(userID);

    return (
      <div className="action-container">
            {status === "active" ? (
              <button
                className="sidenav-icon deleteIcon"
                title="Block User"
                onClick={() => updateConnection(id, "blocked")}
              >
                {language === "zh-tw" ? "封鎖" : "Block User"}
              </button>
            ) : (
              <></>
            )}

      </div>
    );
  };


  const request = (status, id, input) => {
    if (!id) return console.error("No connection ID provided.");

    if (input === "deny") {
      handleDelete(id); // Call delete function to remove the request
    } else if (status === "pending") {
      updateConnection(id, "active"); // Change status to 'active'
    }
  };

  useEffect(() => {
    const handleCreateRoom = (data) => {
      if (data && data.roomID) {
        navigate(`/messages/${data.roomID}`);
        sessionStorage.setItem("toUserID", props.userId);
      }
    };
    socket.on("/room-created", handleCreateRoom);
    return () => {
      socket.off("/room-created", handleCreateRoom);
    };
  }, [navigate, props.userId]);

  const handleMessageClick = (connectionUser) => {
    socket.emit("/chat/join-room", {
      fromUserID: sessionStorage.getItem("user"),
      toUserID: connectionUser.id,
    });
    sessionStorage.setItem("toUsername", connectionUser.attributes?.Username?.username);
    navigate(`/messages/${connectionUser.id}`);
  };


  if (!props.isLoaded || !props.connections) {
    return <div>{language === "zh-tw" ? "載入中..." : "Loading..."}</div>;
  } 

  const handleDelete = (connectionId) => {
    console.log("processing delete")
    if (!connectionId) {
      console.error("No connection ID provided for deletion.");
      return;
    }

    console.log(`Attempting to delete connection ${connectionId}`);

    fetch(`${process.env.REACT_APP_API_PATH}/connections/${connectionId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
    })
      .then((res) => {
        if (res.status === 204) {
          console.log("Connection successfully deleted.");
          props.setConnections(prevConnections =>
            prevConnections.filter(conn => conn.id !== connectionId)
          );
          window.location.reload();
        } else if (res.status === 404) {
          console.error("Connection not found.");
          alert(language === "zh-tw" ? "未找到連線。" : "Connection not found.");          
        } else if (res.status === 401) {
          console.error("Unauthenticated request.");
          alert(language === "zh-tw" ? "您需要登入才能執行此操作。" : "You need to be logged in to perform this action.");
        } else {
          console.error("Failed to delete connection:", res.status);
          alert(language === "zh-tw" ? "刪除連線失敗。" : "Failed to delete connection.");
        }
      })
      .catch((error) => {
        console.error("Error deleting connection:", error);
      });
  };




  return (
    <div className="friendslist">

      <div className="friendsWidget">
        <ul>
          {props.connections
            .flat()
            .reverse()
            .filter(conn => typeof conn === "object" && conn !== null)
            .filter(connection => {
              return connection?.attributes?.status?.toLowerCase() !== "pending";
            })
            .filter(connection => {
              return connection?.attributes?.status?.toLowerCase() !== "blocked";
            })
            .filter(connection => {
              console.log("Attr:", connection?.fromUser?.attributes !== null); // Debugging

              return connection?.fromUser?.attributes !== null;
            })
            .map((connection) => (
              connection ? (
                <div key={connection.id} className="friendcontain">
                  <div className="leftcontain">
                    <img
                      src={
                        Number(connection.fromUserID) === Number(userID)
                          ? profileImages[connection?.toUser?.attributes?.ProfileImageID?.imageid] || defaultProfileIcon
                          : profileImages[connection?.fromUser?.attributes?.ProfileImageID?.imageid] || defaultProfileIcon
                      }
                      alt="User Profile"
                      className="profile-pf"
                      onClick={() => {
                        navigate(`/profile/${connection.toUser?.attributes?.Username?.username}`)
                      }}
                    />
                    <div className="na">
                    <p className="name-f" onClick={() => {
                      navigate(`/profile/${connection.toUser?.attributes?.Username?.username}`);
                    }}>
                      {Number(connection.fromUserID) === Number(userID)
                        ? (connection.toUser?.attributes?.Username?.username || (language === "zh-tw" ? "未知用戶" : "Unknown User"))
                        : (connection.fromUser?.attributes?.Username?.username || (language === "zh-tw" ? "未知用戶" : "Unknown User"))}
                    </p>
                    </div>
                  </div>


                  <div className="deletePost">
                    <img src={chat} alt="chat" onClick={() =>
                      handleMessageClick(
                        Number(connection.toUserID) === Number(userID)
                          ? connection.fromUser // If `toUser` is myself, use `fromUser`
                          : connection.toUser // Otherwise, use `toUser`
                      )
                    }></img>
                    <div className="ellipsis-menu" onClick={() => setOpenMenuId(openMenuId === connection.id ? null : connection.id)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="dots">
                        <circle cx="12" cy="5" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="12" cy="19" r="2"></circle>
                      </svg>
                    </div>
                    {openMenuId === connection.id && (
                      <div className="dropdowner">
                        <div>
                          <button
                            onClick={() => handleDelete(connection?.id)}
                          >{language === "zh-tw" ? "取消好友" : "Unadd"}
                          </button>
                        </div>
                        <div>
                          {conditionalAction(
                            connection?.attributes?.status,
                            connection?.id,
                            connection?.fromUserID,
                            connection?.toUserID
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null
            ))}
        </ul>
      </div>
      <div className="pendingWidget" style={{ backgroundColor: "#d9d9d9" }}>
      <h5>{language === "zh-tw" ? "待處理的請求" : "Pending requests"}</h5>
        <FriendForm className = "searchfunction" userid={userID} loadFriends={connections} />
        <ul>
          {props.connections
          .flat()
          .reverse()
          .filter(conn => typeof conn === "object" && conn !== null)
          .filter(connection => {
            console.log("Status:", connection?.attributes?.status); // Debugging
            return connection?.attributes?.status?.toLowerCase() === "pending";
          })
          .map((connection) => (
            connection ? (
              <div key={connection.id} className="userlist">
                <div className="ri">
                
                  <img
                    src={
                      Number(connection.fromUserID) === Number(userID)
                        ? profileImages[connection?.toUser?.attributes?.ProfileImageID?.imageid] || defaultProfileIcon
                        : profileImages[connection?.fromUser?.attributes?.ProfileImageID?.imageid] || defaultProfileIcon
                    }
                    
                    alt="User Profile"
                    className="profile-p"
                  />
                  <div className="na">
                    <p className="name">
                    <p className="name">
                    {Number(connection.fromUserID) === Number(userID)
                      ? (connection.toUser?.attributes?.Username?.username || (language === "zh-tw" ? "未知用戶" : "Unknown User"))
                      : (connection.fromUser?.attributes?.Username?.username || (language === "zh-tw" ? "未知用戶" : "Unknown User"))}
                  </p>
                    </p>
                    <div className="pendingStatus" style={{color: "black"}}> 
                    <p>
                    {connection?.attributes?.status === "pending"
                      ? (language === "zh-tw" ? "待處理中" : "Pending")
                      : connection?.attributes?.status
                        ? connection.attributes.status
                        : (language === "zh-tw" ? "未知狀態" : "Unknown Status")}
                  </p>

                    </div>
                  </div>
                </div>
                {Number(connection.fromUserID) !== Number(userID) && (
                  <div className="pendingOptions">
                  <button onClick={() => {
                    request(connection?.attributes?.status, connection?.id, "accept");

                  }}>
                    {language === "zh-tw" ? "接受" : "Accept"}
                  </button>
                  <button onClick={() => {
                      request(connection?.attributes?.status, connection?.id, "deny");
                    }}>
                    {language === "zh-tw" ? "拒絕" : "Decline"}
                  </button>
                  </div>
                )}

                </div>
              ) : null
            ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;