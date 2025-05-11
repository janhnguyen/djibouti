import React, { useEffect, useState, useContext } from "react";
import blockIcon from "../assets/block_white_216x216.png";
import unblockIcon from "../assets/thumbsup.png";
import messageIcon from "../assets/comment.svg";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import '../styles/homePageFriendList.css'
import defaultProfileIcon from "../assets/baseProfilePic.png";
import LanguageContext from "../context/LanguageContext";

const socket = io("https://socket-370-75ab13545ed2.herokuapp.com/", {
  transports: ["websocket"], // 🚀 Force WebSocket connection (not polling)
  path: "/socket.io/", // ✅ Ensure the correct WebSocket path
  reconnectionAttempts: 5, // 🔄 Retry connection up to 5 times
  reconnectionDelay: 2000, // ⏳ Wait 2 sec between retries
  cors: {
    origin: "http://localhost:3000", // ✅ Allow localhost during development
    methods: ["GET", "POST"]
  }
});

const FriendList = (props) => {
  const { language, setLanguage } = useContext(LanguageContext);

  const [onlineUsers, setOnlineUsers] = useState({}); // Store online status
  const [openMenuId, setOpenMenuId] = useState(null);
  const [profileImages, setProfileImages] = useState({});

  const navigate = useNavigate();
  const userID = sessionStorage.getItem("user");

  useEffect(() => {
    props.loadFriends();
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

  useEffect(() => {
    if (!socket) return;
    // Emit user_online event when component mounts
    socket.emit("user_online", { type: "onlineStatus", id: userID });

    // Listen for online status updates (add users)
    socket.on("onlineStatus", (updatedUsers) => {
        console.log("📡 Online users received (before filtering):", updatedUsers);

        // 🛠️ Remove `null` keys from the object
        const filteredUsers = Object.fromEntries(
            Object.entries(updatedUsers).filter(([key]) => key !== "null")
        );

        console.log("✅ Filtered online users (after removing null):", filteredUsers);
        setOnlineUsers(filteredUsers);
    });

    // Listen for offline status updates (remove users)
    socket.on("user_offline", (offlineUser) => {
        setOnlineUsers((prevUsers) => {
            const updatedUsers = { ...prevUsers };
            delete updatedUsers[offlineUser.id]; // Remove user from list
            console.log("after darkba11s leaves:", updatedUsers);
            return updatedUsers;
        });

    });

    // Listen for all WebSocket events (for debugging)
    socket.onAny((event, ...args) => {
        console.log("Received WebSocket event:", event, args);
    });

    return () => {
        // Emit offline event when component unmounts
        socket.emit("user_offline", { type: "offlineStatus", id: userID });
        socket.off("onlineStatus");
        socket.off("offlineStatus");
        socket.offAny();
    };
}, [userID]);

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
    
    const isBlocked = status === "blocked";
  
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
    return <div> Loading... </div>;
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
          alert("Connection not found.");
        } else if (res.status === 401) {
          console.error("Unauthenticated request.");
          alert("You need to be logged in to perform this action.");
        } else {
          console.error("Failed to delete connection:", res.status);
          alert("Failed to delete connection.");
        }
      })
      .catch((error) => {
        console.error("Error deleting connection:", error);
      });
  };

  return (
    <div>
      <div className="fw">
        <div>
          {props.connections
          .flat()
          .reverse()
          .filter(conn => typeof conn === "object" && conn !== null)
          .filter(connection => {
            return connection?.attributes?.status?.toLowerCase() !== "pending";
          })
          .filter(connection => {
            return connection?.attributes?.status?.toLowerCase() !==  "blocked";
          })
          .filter(connection => {
            console.log("Attr:", connection?.fromUser?.attributes!==null); // Debugging

            return connection?.fromUser?.attributes!==null;
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
                    {Number(connection.fromUserID) === Number(userID)
                    ? connection.toUser?.attributes?.Username?.username
                    : connection.fromUser?.attributes?.Username?.username || "Unknown User"}
                </p>

                {(() => {
                    const userIdToCheck = Number(connection.fromUserID) === Number(userID)
                    ? connection.toUser?.id?.toString()
                    : connection.fromUser?.id?.toString();

                    return userIdToCheck && Object.keys(onlineUsers).includes(userIdToCheck)
                    ? <p className="os">
                        🟢 {language === "zh-tw" ? "上線中" : "Online"}
                      </p>
                    : <p className="os">
                        🔴 {language === "zh-tw" ? "離線中" : "Offline"}
                      </p>;
                })()}
                </div>



                </div>
                

                  <div className="deletePost">
                  <div className="ellipsis-menu" onClick={() => setOpenMenuId(openMenuId === connection.id ? null : connection.id)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="dots">
                      <circle cx="12" cy="5" r="2"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                      <circle cx="12" cy="19" r="2"></circle>
                    </svg>
                  </div>
                    {openMenuId === connection.id && (
                      <div className="dropdowner">
                      <button
                        src={messageIcon}
                        alt={language === "zh-tw" ? "發送訊息" : "Message User"}
                        title={language === "zh-tw" ? "發送訊息" : "Message User"}
                        onClick={() =>
                          handleMessageClick(
                            Number(connection.toUserID) === Number(userID)
                              ? connection.fromUser
                              : connection.toUser
                          )
                        }
                      >
                        {language === "zh-tw" ? "訊息" : "Message"}
                      </button>

                        <div>
                        {conditionalAction(
                          connection?.attributes?.status,
                          connection?.id,
                          connection?.fromUserID,
                          connection?.toUserID
                        )}
                        </div>
                        <div>
                        <button onClick={() => handleDelete(connection?.id)}>
                          {language === "zh-tw" ? "移除好友" : "Unadd"}
                        </button>

                        </div>
                      </div>
                    )}
                  </div>
                </div>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
