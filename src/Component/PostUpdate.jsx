import React, { useEffect, useState, useContext } from "react";
import "./PostForm.css";
import LanguageContext from "../context/LanguageContext";


const PostForm = ({ refresh, setRefresh, onPostAdded, uploadUrl }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [url, setUrl] = useState("");
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [hashtagWarning, setHashtagWarning] = useState("");

  const { language, setLanguage } = useContext(LanguageContext);
  const [friendsOnly, setFriendsOnly] = useState(false); // NEW STATE

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {

    if (!selectedImage) return null;

    const formData = new FormData();
    formData.append("uploaderID", sessionStorage.getItem("user"));
    formData.append("attributes", JSON.stringify({}));
    formData.append("file", selectedImage);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/file-uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.path || null;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const trimmedTitle = postTitle.trim();
    const trimmedText = postText.trim();

    if (!trimmedTitle && !trimmedText && !selectedImage && !url.trim()) {
      setPostMessage(language === "zh-tw" ? "不能提交空白貼文。" : "Cannot submit an empty post.");
      setTimeout(() => setPostMessage(""), 3000);
      return;
    }

    let imagePath = await uploadImage();

    const attributes = {
      title: trimmedTitle,
      hashtags: hashtags.split(",").map((tag) => tag.trim()).filter(Boolean),
      friendsOnly: friendsOnly,
    };
    if (imagePath) attributes.image = imagePath;
    if (url.trim()) attributes.url = url.trim();

    fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem("user"),
        content: trimmedText,
        attributes: attributes,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setPostTitle("");
        setPostText("");
        setHashtags("");
        setUrl("");
        setSelectedImage(null);
        setImagePreviewUrl(null);
        setPostMessage(language === "zh-tw" ? "貼文已新增！" : "Post Added!");
        setFriendsOnly(false);

        if (typeof onPostAdded === "function") {
          onPostAdded();
        }

        setTimeout(() => setPostMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Post failed:", error);
      });
  };

  return (
    <div className="post-form-container">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder={language === "zh-tw" ? "標題" : "Title"}
          className="title-input"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />

        <textarea
          className="post-input"
          placeholder={language === "zh-tw" ? "你在想什麼？" : "What's on your mind?"}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          rows={4}
        />

        {showHashtagInput && (
          <input
            type="text"
            className="hashtag-input"
            placeholder={language === "zh-tw" ? "輸入主題標籤，用逗號分隔" : "Enter hashtags, separated by commas"}
            value={hashtags}
            onChange={(e) => {
              const value = e.target.value;
              setHashtags(value);

              if (value.includes("#")) {
                setHashtagWarning(language === "zh-tw" ? "不需要在標籤開頭加上「#」— 系統會自動新增。" : "'#' is not needed to begin hashtags — it will be added automatically.");
              } else {
                setHashtagWarning("");
              }
            }}
          />
        )}
        {hashtagWarning && (
          <div style={{ color: "orange", fontSize: "0.85rem", marginTop: "4px" }}>
            {hashtagWarning}
          </div>
        )}

        {showUrlInput && (
          <input
            type="text"
            className="hashtag-input"
            placeholder={language === "zh-tw" ? "輸入網址" : "Enter a URL"}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        {imagePreviewUrl && (
          <div className="image-preview">
            <img
              src={imagePreviewUrl}
              alt="preview"
              style={{ maxWidth: "200px", borderRadius: "10px", marginTop: "10px" }}
            />
          </div>
        )}

        <input
          type="file"
          id="image-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <div className="post-actions">
          <div className="post-buttons">
            <button
              type="button"
              className="icon-button"
              title="Add Image"
              onClick={() => document.getElementById("image-upload").click()}
            >
              📷
            </button>
            <button
              type="button"
              className="icon-button"
              title="Add Link"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              🔗
            </button>
            <button
              type="button"
              className="icon-button"
              title="Add Hashtags"
              onClick={() => setShowHashtagInput(!showHashtagInput)}
            >
              #️⃣
            </button>

            <div className="friends-inline-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={friendsOnly}
                  onChange={(e) => setFriendsOnly(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">{language === "zh-tw" ? "僅限好友" : "Friends Only"}</span>
            </div>
          </div>

          <button type="submit" className="post-submit">
          {language === "zh-tw" ? "發布" : "Post"}
          </button>
        </div>


        {postMessage && (
          <div className="post-message" style={{ color: postMessage === "Cannot submit an empty post." ? "red" : "green" }}>
            {postMessage}
          </div>
        )}
      </form>
      <div style={{ marginBottom: "20px" }}></div>
    </div>
  );
};

export default PostForm;
