import React, {useContext, useState} from "react";
import { createNotification } from "../utils/commentNotifs";
import "../styles/post.css";
import LanguageContext from "../context/LanguageContext";

const CommentForm = ({ parent, loadPosts, loadComments }) => {
  const [postText, setPostText] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const { language, setLanguage } = useContext(LanguageContext);

  const submitHandler = async (event) => {
    event.preventDefault();

    const trimmedText = postText.trim();
    if (!trimmedText) {
      setPostMessage("Comment cannot be empty.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const commenterID = parseInt(sessionStorage.getItem("user"));

      const postRes = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${parent}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postData = await postRes.json();
      const postAuthorID = postData.authorID;
      const postTitle = postData.attributes?.title || "your post";

      const userRes = await fetch(`${process.env.REACT_APP_API_PATH}/users/${commenterID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      const commenterUsername = userData.attributes?.Username?.username || "a user";

      const commentRes = await fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          authorID: commenterID,
          content: postText,
          parentID: parent,
          attributes: {},
          type: "comment",
        }),
      });

      const commentResult = await commentRes.json();
      setPostMessage(commentResult.Status);
      loadPosts();
      loadComments();
      setPostText("");

      // Create backend notification
      if (postAuthorID && postAuthorID !== commenterID) {
        //await createNotification({
        //  recipientID: postAuthorID,
        //  senderID: commenterID,
        //  postID: parent,
        //  message: `You received a new comment from ${commenterUsername} on "${postTitle}"`,
        //});
      }
    } catch (error) {
      console.error("Comment or notification error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <textarea
            style={{width: "100%", padding: '10px', borderRadius: '20px'}}
            placeholder={language === "zh-tw" ? "評論" : "Comment"}
            rows="2"
            cols="70"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
        />

        <input
            className="commentSubmitButton"
            type="submit"
            value={language === "zh-tw" ? "發佈" : "Post"}
        />
        <br/>

        {postMessage}
      </form>
    </div>
  );
};

export default CommentForm;