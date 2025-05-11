import React, {useState, useEffect, useRef, useContext} from "react";
import Post from "./Post.jsx";
import { Link, useNavigate } from "react-router-dom";
import LanguageContext from "../context/LanguageContext";

/*
  The PostingList is going to load all the posts in the system. This model won't work well if you have a lot of 
  posts - you would want to find a way to limit the posts shown.
*/
const PostingList = ({ refresh, posts, error, isLoaded, type, loadPosts }) => {
  const { language } = useContext(LanguageContext);

  if (!sessionStorage.getItem("token")) {
    return <div>
      <Link to="/login">
        <button className="login-button">
          {language === "zh-tw" ? "請先登入..." : "Please Log In..."}
        </button>
      </Link></div>;
  } else if (error) {
    return <div>{language === "zh-tw" ? `錯誤：${error.message}` : `Error: ${error.message}`}</div>;
  } else if (!isLoaded) {
    return <div>{language === "zh-tw" ? "載入中..." : "Loading..."}</div>;
  } else if (posts.length > 0) {
    return (
      <div className="posts">
        {posts.map((post) => (
          <Post key={post.id} post={post} type={type} loadPosts={loadPosts} />
        ))}
      </div>
    );
  } else {
    return <div>{language === "zh-tw" ? "找不到貼文" : "No Posts Found"}</div>;
  }
};

export default PostingList;
