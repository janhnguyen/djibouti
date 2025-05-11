import React, {useState, useEffect, useRef, useContext} from "react";
import { getNotifications, clearNotifications } from "../utils/commentNotifs";
import { FaBell, FaBellSlash } from "react-icons/fa";
import LanguageContext from "../context/LanguageContext";

const NotificationBell = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const currentUserID = parseInt(sessionStorage.getItem("user"));
  const popupRef = useRef(null);
  const { language, setLanguage } = useContext(LanguageContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedNotifs = await getNotifications();
      const userNotifs = storedNotifs.filter(
        (n) => n.attributes?.recipientID === currentUserID && n.attributes?.message
      );
      setNotifications(userNotifs);
    };

    fetchNotifications();
  }, [currentUserID]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleClear = async () => {
    await clearNotifications();
    setNotifications([]);
    setShowPopup(false);
  };

  return (
      <div style={{ position: "relative", marginRight: "15px" }}>
        <div
            onClick={() => setShowPopup(!showPopup)}
            style={{ cursor: "pointer", fontSize: "30px", marginTop: "10px" }}
        >
          {notifications.length > 0 ? (
              <FaBell style={{ color: "red" }} />
          ) : (
              <FaBellSlash style={{ stroke: "black", strokeWidth: "30", fill: "none" }} />
          )}
        </div>

        {showPopup && (
            <div
                ref={popupRef}
                style={{
                  position: "absolute",
                  top: "40px",
                  right: 0,
                  backgroundColor: "#ffffff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "10px",
                  width: "250px",
                  zIndex: 1000,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  color: "#000000",
                }}
            >
              <h4 style={{ marginTop: 0 }}>
                {language === "zh-tw" ? "通知" : "Notifications"}
              </h4>
              {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                      <div
                          key={index}
                          style={{
                            marginBottom: "8px",
                            fontSize: "14px",
                            borderBottom: "1px solid #eee",
                            paddingBottom: "5px",
                          }}
                      >
                        {notif.attributes.message}
                      </div>
                  ))
              ) : (
                  <p style={{ fontSize: "14px", color: "#888" }}>
                    {language === "zh-tw" ? "沒有新通知" : "No new notifications"}
                  </p>
              )}

              {notifications.length > 0 && (
                  <button
                      onClick={handleClear}
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        cursor: "pointer",
                        backgroundColor: "#eee",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                  >
                    {language === "zh-tw" ? "清除所有" : "Clear All"}
                  </button>
              )}
            </div>
        )}
      </div>
  );
};

export default NotificationBell;
