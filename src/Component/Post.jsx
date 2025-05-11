import React, {useState, useEffect, useContext} from "react";
import "../styles/post.css";
import { Link } from "react-router-dom";

import CommentForm from "./CommentForm.jsx";
import commentIcon from "../assets/comment.svg";
import likeIcon from "../assets/thumbsup.png";
import helpIcon from "../assets/delete.png";
import { FaUserCircle, FaEllipsisH, FaBookmark } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import locationIcon from "../assets/pin.png";
import defaultProfile from "../assets/DefaultProfile.png";
import lockIcon from "../assets/lock.png";
import LanguageContext from "../context/LanguageContext";
import { useRef } from "react";

// 🔥 Initialize Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);


const Post = ({ post, type, loadPosts }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [comments, setComments] = useState(post._count?.children ? parseInt(post._count.children) : 0);
  const [postComments, setPostComments] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const currentUserID = parseInt(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const [profileimage, setprofileimage] = useState("");
  const [hasprofileimage, sethasprofileimage] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(post.content);
  const [requestpopup, setrequestpopup] = useState(false)
  const [notinterestedpopup, setnotinterestedpopup] = useState(false)
  const [showButton, setShowButton] = useState(true);
  const postRef = useRef(null);

  const handleNotInterested = async () => {
    const userID = currentUserID.toString();
    const contentToHide = post.content;

    // 1. Check if user already exists in hidden
    const { data, error } = await supabase
      .from("hidden")
      .select("id, hide")
      .eq("user", userID)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking hidden table:", error.message);
      return;
    }

    if (data) {
      // 2. User exists, update the list if not already in it
      if (!data.hide.includes(contentToHide)) {
        const updatedList = [...data.hide, contentToHide];
        const { error: updateError } = await supabase
          .from("hidden")
          .update({ hide: updatedList })
          .eq("id", data.id);

        if (updateError) { console.error("Failed to update hidden list:", updateError.message); }
      }
    } else {
      // 3. User doesn't exist, insert new
      const { error: insertError } = await supabase
        .from("hidden")
        .insert([{ user: userID, hide: [contentToHide] }]);

      if (insertError) console.error("Failed to insert hidden row:", insertError.message);
    }

    loadPosts();
  };


  const handleSeeWhosGoing = async () => {
    const content = post?.content;

    const title = post?.attributes?.title;
    if (!title) return;
    // 1. Check if current user is creator of this event
    const { data: creatorCheck, error: creatorError } = await supabase
      .from("createEvent")
      .select("author_id")
      .match({ title, content })  // cleaner
      .single();

    if (creatorCheck?.author_id === currentUserID.toString()) {
      setIsCreator(true);
    } else {
      setIsCreator(false);
    }

    // 1. Get all user IDs for this event title
    const { data: eventUsers, error } = await supabase
      .from("event")
      .select("user")
      .eq("title", title);

    if (error) {
      console.error("Error fetching event attendees:", error.message);
      alert("Failed to fetch attendees.");
      return;
    }

    // 2. Fetch usernames for each user ID
    const usernames = [];
    for (const entry of eventUsers) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_PATH}/users/${entry.user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await res.json();
        console.log(userData);
        const username = userData.attributes?.Username.username || "Unknown";
        usernames.push({
          username,
          userId: entry.user, // add this to uniquely identify
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    setAttendees(usernames);
    setShowAttendeesModal(true);

  };

  const handleRemoveAttendee = async (a) => {
    console.log(a)
    const { error } = await supabase
      .from("event")
      .delete()
      .eq("user", a.userId)
      .eq("title", post?.attributes?.title); // <- add title to ensure scoped deletion

    if (error) {
      alert("Failed to remove attendee.");
      console.log(error);
      return;
    }

    // Now only remove that one attendee
    setAttendees((prev) => prev.filter((attendee) => attendee.userId !== a.userId));
  };




  useEffect(() => {
    const checkIfEvent = async () => {
      if (!post?.attributes?.title) return;

      const { data, error } = await supabase
        .from("createEvent")
        .select("id")
        .eq("title", post.attributes.title)
        .single();

      if (!error && data) {
        setIsEvent(true);
      } else {
        setIsEvent(false);
      }
    };

    checkIfEvent();
  }, [post]);



  useEffect(() => {
    const fetchImage = async () => {
      if (!post?.authorID) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_PATH}/file-uploads?uploaderID=${post.authorID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data[0]?.length > 0) {
          const uploadedFiles = data[0];
          const matchingImage = uploadedFiles.find(
            (file) => file.path === post.attributes?.image
          );

          if (matchingImage) {
            const fullImageUrl = post.attributes.image.startsWith("/hci/api/uploads")
              ? `https://webdev.cse.buffalo.edu${post.attributes.image}`
              : `${process.env.REACT_APP_API_PATH}/${post.attributes.image.replace(/^\/+/, "")}`;

            setImageUrl(fullImageUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    };

    fetchImage();
  }, [post]);

  useEffect(() => {
    const fetchuserimage = async () => {
      if (!post?.authorID) return;

      const response = await fetch(`${process.env.REACT_APP_API_PATH}/users/${post?.authorID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const userInfo = await response.json();
      if (!userInfo.attributes?.ProfileImageID?.imageid) {
        sethasprofileimage(false);
        return;
      }
      fetch(process.env.REACT_APP_API_PATH + "/file-uploads/" + userInfo.attributes?.ProfileImageID?.imageid, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result); // Debugging
          // console.log("https://webdev.cse.buffalo.edu" + result.path);
          setprofileimage("https://webdev.cse.buffalo.edu" + result.path);
          sethasprofileimage(true);
        })
        .catch((error) => console.error("Error updating image:", error));
    };

    fetchuserimage();
  }, []);

  const showHideComments = () => (showModal ? "comments show" : "comments hide");

  const loadComments = () => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=${post.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPostComments(result[0]);
        setComments(result[0].length);
      })
      .catch((err) => console.error("ERROR loading comments:", err));
  };

  useEffect(() => {
    if (showModal) loadComments();
  }, [showModal]);

  const deletePost = (postID) => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${postID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(loadPosts)
      .catch((err) => alert("Error deleting post: " + err));
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const editPost = (postID) => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${postID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editedContent }),
    })
      .then((res) => res.json())
      .then(() => {
        setIsEditing(false);
        loadPosts();
      })
      .catch((err) => alert("Error updating post: " + err));
  };

  const getUsername = (author) => author?.attributes?.Username?.username || "Unknown User";

  const commentDisplay = () => (
    <div className="comment-block">
      <div className={showHideComments()}>
        <CommentForm
          parent={post.id}
          loadPosts={loadPosts}
          loadComments={loadComments}
          postAuthorID={post.authorID}
        />
        <h4 className="comment-title">
          {language === "zh-tw" ? "評論：" : "Comments:"}
        </h4>
        <div className="comment-list">
          {postComments.length > 0 ? (
              postComments.map((comment) => (
              <Post
                key={comment.id}
                post={comment}
                type="commentlist"
                loadPosts={loadComments}
              />
            ))
          ) : (
              <p className="no-comments">
                {language === "zh-tw" ? "尚無評論。成為第一個評論的人！" : "No comments yet. Be the first to comment!"}
              </p>
          )}
        </div>
      </div>
    </div>
  );

  if (type === "commentlist") {

    const editComment = () => {
      fetch(`${process.env.REACT_APP_API_PATH}/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedComment }),
      })
          .then((res) => res.json())
          .then(() => {
            setIsCommentEditing(false);
            loadPosts(); // or loadComments();
          })
          .catch((err) => alert("Error updating comment: " + err));
    };

    const deleteComment = () => {
      fetch(`${process.env.REACT_APP_API_PATH}/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
          .then(loadPosts) // or loadComments()
          .catch((err) => alert("Error deleting comment: " + err));
    };

    return (
        <div className="comment-item">
          <p className="comment-author">
            <span><img
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "100%",
                marginRight: "10px",
                verticalAlign: "middle", // aligns with text better
                position: "relative",
                top: "2px" // nudges image down
              }}
              src={profileimage}
              className="comment-profile-pic"
            /></span>
            <strong>{getUsername(post.author)}</strong>
            <span className="comment-date"> - {new Date(post.created).toLocaleDateString()}</span>
          </p>

          {isCommentEditing ? (
              <>
          <textarea
              className="edit-textarea"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
          />
                <div>
                  <button onClick={editComment}>
                    {language === "zh-tw" ? "儲存" : "Save"}
                  </button>
                  <button onClick={() => setIsCommentEditing(false)}>
                    {language === "zh-tw" ? "取消" : "Cancel"}
                  </button>

                </div>
              </>
          ) : (
              <p className="comment-content">{post.content}</p>
          )}

          {/* Show edit/delete only if the current user is the author */}
          {post.authorID === currentUserID && (
              <div className="comment-options">
                <button onClick={() => setIsCommentEditing(true)}>
                  {language === "zh-tw" ? "編輯" : "Edit"}
                </button>
                <button onClick={deleteComment}>
                  {language === "zh-tw" ? "刪除" : "Delete"}
                </button>
              </div>
          )}
        </div>
    );
  }


  const handleRequestToAttend = async () => {
    const userID = sessionStorage.getItem("user"); // or user ID if stored
    const creator = post?.author?.attributes?.Username?.username;
    const title = post?.attributes?.title;
    const content = post?.content;

    const { data: eventData, error: checkError } = await supabase
      .from("createEvent")
      .select("status")
      .eq("title", title)
      .eq("content", content)
      .single(); // assume unique combination of title + content

    if (checkError) {
      console.error("Error checking event status:", checkError.message);
      alert("There was an error checking the event. Please try again.");
      return;
    }

    if (eventData?.status === "closed") {
      alert("Sorry, this event is closed. Attendance is full.");
      return;
    }

    const { data: existingEntry, error: checkExistingError } = await supabase
    .from("event")
    .select("id")
    .eq("user", userID)
    .eq("title", title)
    .eq("creator", creator)
    .eq("message", content)
    .maybeSingle();

    if (existingEntry) {
      alert(
          language === 'zh-tw'
              ? '你已經申請參加此活動了。'
              : 'You requested to attend this event already.'
      );
      return;
    }
    const { error } = await supabase
      .from("event")
      .insert([
        {
          user: userID,
          title,
          creator,
          message: content // or a real input field
        },
      ]);

    if (error) {
      console.error("Failed to request attendance:", error.message);
    } else {
      setrequestpopup(true)
      setTimeout(() => {
        setrequestpopup(false)
      }, 2500)
    }
  };


  return (
    <div className="post-container">
      

      <div className="post-header">
        <div className="profile-container">
          {hasprofileimage && (
            <>
              {/* {console.log("has a user image")} */}
              <img src={profileimage} className="profile-icon-custom" alt="profimg" />
            </>
          )}
          {!hasprofileimage && (
            <>
              {/* {console.log("does not have a user image")} */}
              <img src={defaultProfile} style={{width: '32px'}}></img>
            </>
          )}
          <div className="post-info">
            <Link className="authorName" 
              to={`/profile/${getUsername(post.author)}`}
              state={{ who: getUsername(post.author) }}
            >{getUsername(post.author)}</Link>
            <span className="post-date" style={{marginLeft:'10%'}}>{new Date(post.created).toLocaleDateString()}</span>
          </div>
        </div>
        {post.authorID === currentUserID && (
          <div className="options-container">
            <FaEllipsisH className="options-icon" onClick={() => setShowOptions(!showOptions)} />
            {showOptions && (
              <div className="options-menu">
              {!isEditing && (
                <button className="option-item" onClick={() => setIsEditing(true)}>
                  {language === "zh-tw" ? "編輯" : "Edit"}
                </button>
              )}
              <button className="option-item" onClick={() => deletePost(post.id)}>
                {language === "zh-tw" ? "刪除" : "Delete"}
              </button>
            </div>            
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ color: 'black', textAlign: 'left', margin: '0' }}>
            {post?.attributes?.title ? post?.attributes?.title : "No Title"}
          </h3>
          {post?.attributes?.friendsOnly && (
            <span style={{
              color: "white",
              backgroundColor: "#D7A582",
              padding: "4px 8px",
              borderRadius: "8px",
              marginLeft: "8px",
              fontSize: "14px",
            }}>
              <img src={lockIcon} alt="Location" style={{ width: "14px", marginRight: "4px" }} />
              {language === "zh-tw" ? "僅限好友" : "Friends Only"}
            </span>
          )}
      </div>

      {post.attributes?.tags?.length > 0 && (
        <div className="post-tags" style={{ display: 'flex', flexDirection: "row" }}>
          {post.attributes.tags.map((tag, index) => (
            <span key={index} className="tag" style={{
              color: 'gray',
              margin: '10px 5px 0px 0px',
              fontSize: '12px',
              border: 'solid gray 1px',
              padding: '1px 5px 1px 5px',
              borderRadius: '20px'
            }}>{tag}</span>
          ))}
        </div>
      )}


      <h3 style={{color: 'gray', textAlign: 'left', margin: '0', fontSize: '12px', marginTop: '4px'}}>
        {post?.attributes?.city ? post?.attributes?.city : ""}
      </h3>


      <div ref={postRef} className="postAndImage" style={{ height: '80px', overflow: 'hidden'}}>
        <p className="post-content">{post.content}</p>

        {imageUrl && (
            <div className="post-image" style={{textAlign: "left", marginTop: "10px"}}>
              <img
                  src={imageUrl}
                  alt="Post attachment"
                  style={{
                    maxWidth: "300px",
                    height: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}

      </div>



      {isEditing ? (
        <textarea style={{width: '90%', height: '100px', resize: 'none', borderRadius: '10px', padding: '10px'}}
          className="edit-textarea"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p className="post-content"></p>
      )}

      {isEditing && (
        <div className="edit-buttons">
          <button className="btn btn-primary" onClick={() => editPost(post.id)} style={{marginRight:'10px'}}>
            {language === "zh-tw" ? "儲存" : "Save"}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{marginLeft:'10px'}}>
            {language === "zh-tw" ? "取消" : "Cancel"}
          </button>
        </div>
      )}

      {showButton && (
        <button
          className="showAllButton"
          style={{
            
          }}
          onClick={() => {
            if (postRef.current) {
              postRef.current.style.height = 'fit-content';
            }
            setShowButton(false); // 👈 this hides the button
          }}
        >
          {language === "zh-tw" ? "展開全部" : "Expand All"}
        </button>
      )}



      {post.attributes?.hashtags?.length > 0 && (
        <div className="post-hashtags">
          {post.attributes.hashtags.map((tag, index) => (
            <span key={index} className="hashtag">#{tag}</span>
          ))}
        </div>
      )}

      {post.attributes?.url && (
        <div className="post-url">
          <a href={post.attributes.url} target="_blank" rel="noopener noreferrer">
            {post.attributes.url}
          </a>
        </div>
      )}

      {requestpopup && (
          <div className="requestpopup">
            {language === 'zh-tw' ? '請求參加已發送！' : 'Request to Attend Sent!'}
          </div>
      )}

      {notinterestedpopup && (
          <div className="notinterestedpopup">
            {language === 'zh-tw' ? '帖子標記為不感興趣！' : 'Post Marked As Not Interested!'}
          </div>
      )}

      {isEvent && (
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSeeWhosGoing}>
              {language === "zh-tw" ? "查看誰會參加" : "See Who’s Going"}
            </button>
            <button className="btn btn-primary" onClick={handleRequestToAttend}>
              {language === "zh-tw" ? "請求參加" : "Request to Attend"}
            </button>
            <button className="btn btn-danger" onClick={() => {
              setnotinterestedpopup(true)
              setTimeout(() => {
                setnotinterestedpopup(false)
                handleNotInterested()
              }, 2500)
            }}>
              {language === "zh-tw" ? "不感興趣" : "Not Interested"}
            </button>
          </div>

      )
      }


      <div className="post-footer">
        <div className="comment-section">

          <img src={commentIcon} className="comment-icon" style={{marginRight: '10px'}}
               onClick={() => setShowModal((prev) => !prev)} alt="View Comments"/>
          <span style={{fontSize: '20px'}}>
            {language === 'zh-tw' ? `${comments} 留言` : `${comments} Comments`}
          </span>

        </div>
      </div>

      {showModal && commentDisplay()}


      {
          showAttendeesModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>
                    {language === 'zh-tw' ? '參與者' : 'Attendees'}
                  </h3>
                  <ul>
                    {attendees.map((a) => (
                        <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
                    {a.username}
                    {isCreator && (
                        <button
                            onClick={() => handleRemoveAttendee(a)}
                            className="btn btn-sm btn-danger"
                        >
                          {language === 'zh-tw' ? '移除' : 'Remove'}
                        </button>
                    )}
                        </li>
                    ))}
                  </ul>
                  <button
                      className="btn btn-secondary"
                      onClick={() => setShowAttendeesModal(false)}
                  >
                    {language === 'zh-tw' ? '關閉' : 'Close'}
                  </button>
                </div>
              </div>
          )
      }

    </div>
  );
};

export default Post;