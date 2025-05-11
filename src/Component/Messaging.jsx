import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "../styles/Messaging.css";
import basePic from "../assets/Sheff_G.png";
import sendMsgButton from "../assets/sendMsgButton.png";
import flag from "../assets/info_icon.png";
import LanguageContext from "../context/LanguageContext";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const Messaging = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const { roomID } = useParams();
  const [userID] = useState(sessionStorage.getItem("user"));
  const [profileName] = useState(sessionStorage.getItem("toUsername"));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  

  // Fetch initial messages
  const fetchChatHistory = async () => {
    const myID = Number(sessionStorage.getItem("user"));
    const otherID = Number(roomID);
  
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(from_user_id.eq.${myID},to_user_id.eq.${otherID}),and(from_user_id.eq.${otherID},to_user_id.eq.${myID})`
      )
      .order("created_at", { ascending: true });
  
    if (error) {
      console.error("❌ Error fetching chat history:", error);
      return;
    }
  
    setMessages(data);
  };
  

  useEffect(() => {
    fetchChatHistory();
    const interval = setInterval(fetchChatHistory, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [roomID]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      room_id: parseInt(roomID),
      from_user_id: parseInt(userID),
      to_user_id: parseInt(roomID),
      content: message,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("messages").insert([payload]);
    if (error) console.error("Send error:", error);

    setMessage("");
    fetchChatHistory(); // Manually refresh immediately after sending
  };

  return (
    <div className="chatContainer">
      <div className="leftColumn">
        <h3 style={{ textAlign: "left" }}>  {language === "zh-tw" ? "聊天紀錄" : "Chats"}</h3>
        <div className="sideChats">
          {/* Static placeholder (could add chat list later) */}
          <div className="sideNavEmptyText">  {language === "zh-tw" ? "尚未開始聊天..." : "No active chats yet..."}</div>
        </div>
      </div>

      <div className="rightColumn">
        <div className="chatDiv">
          <div className="chatMain">
            <div className="noDecLink">
              <div
                className="profileHeader"
                style={{ border: "solid white 1px", width: "35%", alignItems: "center", display: "flex" }}
              >
                <img src={basePic} style={{ borderRadius: "100%", height: "80%", marginLeft: "10%" }} />
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "5%", width: "100%", height: "100%", justifyContent: "center" }}>
                  <h2 style={{ color: "black", margin: 0, fontSize: "24px", textAlign: "left" }}>{profileName}</h2>
                </div>
              </div>
              <Link to={`/profile/${profileName}`} style={{ marginRight: "2%", alignContent: "center" }}>
                <img src={flag} style={{ height: "30px", width: "30px" }} />
              </Link>
            </div>

            <div className="messageContainer">
              {messages.map((msg) => {
                const isMe = Number(msg.from_user_id) === Number(userID);
                return (
                  <div className="message__chats" key={msg.id}>
                  <p className={isMe ? "sender__name" : "recipient__name"}>
                    {isMe ? (language === "zh-tw" ? "你" : "You") : profileName}
                  </p>
                    <p className={isMe ? "message__sender" : "message__recipient"}>{msg.content}</p>
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </div>

            <div className="chatFooter">
              <form className="form" onSubmit={handleSendMessage}>
                <input
                  style={{ border: "none", outline: "none" }}
                  type="text"
                  placeholder={language === "zh-tw" ? "開始新的訊息" : "Start a new message"}
                  className="messageHolder"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="sendBtn" type="submit">
                  <img src={sendMsgButton} alt="Send" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;