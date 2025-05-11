import React, { useState, useEffect } from "react";
import { getNotifications, clearNotifications } from "../utils/commentNotifs";

const CommentNotif = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUserID = parseInt(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchNotifs = async () => {
      const validNotifs = await getNotifications();
      const filtered = validNotifs.filter(
        (n) =>
          n.attributes?.recipientID === currentUserID &&
          n.attributes?.message
      );
      setNotifications(filtered);
    };

    fetchNotifs();
  }, [currentUserID]);

  const handleClear = async () => {
    await clearNotifications();
    setNotifications([]);
  };

  return (
    <div style={{
      background: "#ffffff",
      color: "#000000", 
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      marginBottom: "20px"
    }}>
      <h4 style={{ marginTop: 0 }}>New Notifications</h4>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div
            key={index}
            style={{
              padding: "5px 0",
              borderBottom: "1px solid #eee"
            }}
          >
            {notif.attributes.message}
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}

      {notifications.length > 0 && (
        <button
          onClick={handleClear}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            background: "#f0f0f0",
            color: "#000",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default CommentNotif;