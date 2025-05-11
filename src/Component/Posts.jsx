import React, { useEffect, useState, useContext } from "react";
import PostingList from "./PostingList";
import PostForm from "./PostForm";
import "./posts.css";
import { createClient } from "@supabase/supabase-js";
import LanguageContext from "../context/LanguageContext";


const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const Posts = ({ doRefreshPosts, appRefresh, showPostForm }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterTag, setFilterTag] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [hashtagFilterWarning, setHashtagFilterWarning] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [connections, setConnections] = useState([]);
  const userID = Number(sessionStorage.getItem("user"));

  const loadConnections = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const [fromRes, toRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_PATH}/connections?fromUserID=${userID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.REACT_APP_API_PATH}/connections?toUserID=${userID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const fromData = await fromRes.json();
      const toData = await toRes.json();

      const normalize = (data) => Array.isArray(data[0]) ? data[0] : data;
      const combined = [...normalize(fromData), ...normalize(toData)];
      console.log("🔍 Sample connection object:", combined[0]);

      const activeConnections = combined.filter((conn) => {
        const isActive = conn?.attributes?.status === "active";
        const fromID = conn.fromUserID;
        const toID = conn.toUserID;
        console.log(`👉 Connection ${conn.id}: status=${conn.attributes?.status}, from=${fromID}, to=${toID}`);
        return isActive;
      });
      setConnections(activeConnections);
    } catch (err) {
      console.error("❌ Error fetching connections from backend:", err);
    }
  };

  const loadPosts = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const result = await res.json();
      let allPosts = result[0];

      if (filterTag.trim() !== "") {
        allPosts = allPosts.filter((post) =>
          post.attributes?.hashtags?.includes(filterTag.trim())
        );
      }

      const visiblePosts = allPosts.filter((post) => true);

      const filteredForPrivacy = visiblePosts.filter((post) => {
        const isPrivate = post.attributes?.friendsOnly;
        const authorID = Number(post.authorID);

        const isFriend = connections.some((conn) => {
          const from = Number(conn.fromUserID);
          const to = Number(conn.toUserID);
          const match = (from === userID && to === authorID) || (to === userID && from === authorID);
          if (match) {
            console.log(`Friend match found: from=${from}, to=${to}, userID=${userID}, authorID=${authorID}`);
          }
          return match;
        });

        if (isPrivate) {
          console.log("Post is private");
          console.log("Post author:", authorID);
          console.log("Is current user a friend?", isFriend);
        }

        return !isPrivate || isFriend || authorID === userID;
      });

      setIsLoaded(true);
      setPosts(filteredForPrivacy);
    } catch (err) {
      setIsLoaded(true);
      setError(err);
      console.error("ERROR loading posts:", err);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [connections, filterTag, refreshFlag]);

  const handlePostAdded = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterInput(value);

    if (value.includes("#")) {
      setHashtagFilterWarning("'#' is not needed — just type the tag word.");
    } else {
      setHashtagFilterWarning("");
    }
  };

  const clearFilters = () => {
    setFilterInput("");
    setFilterTag("");
    setHashtagFilterWarning("");
  };

  return (
    <div
      className="posts-container"
      style={{ paddingBottom: "30px", marginTop: "30px", overflow: "auto", clear: "both" }}
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>
          {language === "zh-tw" ? "探索貼文" : "Explore Posts"}
        </h2>
          <div>
            <input
              type="text"
              placeholder={language === "zh-tw" ? "以標籤篩選..." : "Filter by hashtag..."}
              value={filterInput}
              onChange={handleFilterChange}
              style={{
                padding: "8px",
                marginRight: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={() => setFilterTag(filterInput.trim())}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#D7A582",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                marginRight: "8px",
              }}
            >
            {language === "zh-tw" ? "篩選" : "Filter"}
              
            </button>
            <button
              onClick={clearFilters}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#aaa",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
            {language === "zh-tw" ? "清除篩選" : "Clear Filters"}
            </button>
          </div>
        </div>

        {hashtagFilterWarning && (
          <div style={{ color: "orange", fontSize: "0.85rem", marginTop: "6px" }}>
            {hashtagFilterWarning}
          </div>
        )}
      </div>

      {showPostForm && (
        <PostForm
          onPostAdded={handlePostAdded}
          uploadUrl="/file-uploads"
        />
      )}

      <PostingList
        refresh={appRefresh}
        posts={posts}
        error={error}
        isLoaded={isLoaded}
        type="postlist"
        loadPosts={loadPosts}
      />
    </div>
  );
};

export default Posts;
