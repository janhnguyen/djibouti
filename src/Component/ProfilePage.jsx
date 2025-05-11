import { useNavigate } from "react-router-dom";
import Post from "./Post";
import '../styles/profilepage.css';
import { Link, useParams, useLocation } from "react-router-dom";
import friendLogo from "../assets/friends.png";
import chatLogo from "../assets/chatLogo.png";
import basePic from "../assets/baseProfilePic.png";
import addfriendicon from "../assets/addfriend.png";
import blankphoto from "../assets/emptyphoto.jpg";
import unfriend from "../assets/unfriend.webp";
import message from "../assets/chatLogo.png";
import FriendsList from "./homePageFriendList";
import { socket } from "../App";
import "../styles/Messaging.css";
import {useContext, useEffect, useState} from "react";
import LanguageContext from "../context/LanguageContext";

const ProfilePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect mobile view
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState(localStorage.getItem("name") || "Name");
  const { username: paramUsername } = useParams();
  const location = useLocation();
  const stateUsername = location.state?.who;
  const profileusername = stateUsername || paramUsername;
  const [friendid, setFriendid] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [isfriend, setFriend] = useState(false);
  const token = sessionStorage.getItem("token");
  const userID = sessionStorage.getItem("user");
  const [friendshipid, setfriendshipid] = useState("");
  const [age, setage] = useState("")
  const [roomid, setRoomid] = useState(null);
  const navigate = useNavigate();
  const [showFriendRequestSent, setShowFriendRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [connections, setConnections] = useState([]); // Ensure it's always an array
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false)
  const { language } = useContext(LanguageContext);
  const [friendpopup, setfriendpopup] = useState(false)
  const [unfriendpopup, setunfriendpopup] = useState(false)

  const [confirmedFriends, setconfirmedFriends] = useState([]);

  useEffect(() => {
    const fetchedRoomId = friendid;
    setRoomid(fetchedRoomId);
  }, []);

  const loadFriends = () => {
    fetch(
      process.env.REACT_APP_API_PATH + `/connections?anyUserID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (Array.isArray(result)) {
            setConnections(result); // Ensure it's an array before setting state
            console.log("🔍 Full Connections Data:", result);
            setconfirmedFriends(result.filter(
              (conn) => conn.attributes?.status == "active"
            ))
          } else {
            console.error("Unexpected API response:", result);
            setConnections([]); // Fallback to empty array if response is invalid
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          console.error("❌ Error fetching connections:", error);
        }
      );
  };

  const loadConnections = async () => {
    const [fromRes, toRes] = await Promise.all([
      fetch(`${process.env.REACT_APP_API_PATH}/connections?fromUserID=${userID}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }),
      fetch(`${process.env.REACT_APP_API_PATH}/connections?toUserID=${userID}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }),
    ]);

    const fromData = await fromRes.json();
    const toData = await toRes.json();

    const normalize = (data) => Array.isArray(data[0]) ? data[0] : data;
    const combined = [...normalize(fromData), ...normalize(toData)];
    const activeConnections = combined.filter((conn) => conn?.attributes?.status === "active");
    setConnections(activeConnections);
    return activeConnections;
  };

  const [profileimage, setprofileimage] = useState("");
  const [hasprofileimage, sethasprofileimage] = useState(false);


  const finduserID = async (givenname) => {
    const res = await fetch(`${process.env.REACT_APP_API_PATH}/users/`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (result?.[0]) {
      const match = result[0].find(user => user.attributes?.Username?.username?.trim() === givenname.trim());
      if (match) {
        setFriendid(match.id);
        setage(match.attributes?.Age?.age);
        return match.id;
      }
    }
    return null;
  };

  const fetchuserimage = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_PATH}/users/${friendid}`, {
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
        setprofileimage("https://webdev.cse.buffalo.edu" + result.path);
        sethasprofileimage(true);
      })
      .catch((error) => console.error("Error updating image:", error));
  };

  const isFriend = () => {
    if (!userID || !friendid) {
      console.error("invalid call usser id is: " + userID + " friend id is: " + friendid)
      return
    }
    fetch(
      process.env.REACT_APP_API_PATH + `/connections?fromUserID=${userID}&toUserID=${friendid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (Array.isArray(result) && result.length > 0) {
            if (result[1] != 0) {
              console.log("They are friends");
              setFriend(true);
              return true;
            }
            else {
              console.log("They are not friends");
              setFriend(false);
              return false;
            }
          } else {
            console.log("They are not friends");
            setFriend(false);
            return false;
          }
        },
        (error) => {
          console.log("Cannot test friendship ", error);
        })
      .catch((error) => {
        console.log("Cannot test friendship ", error);
      });;
  };

  const loadPosts = async (friendIdParam, friendConnections) => {
    const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    const allPosts = result[0] || [];

    const filteredForProfile = allPosts.filter((post) => {
      const isPrivate = post.attributes?.friendsOnly;
      const authorID = Number(post.authorID);
      if (authorID !== Number(friendIdParam)) return false;

      const isFriend = friendConnections.some((conn) => {
        const from = Number(conn.fromUserID);
        const to = Number(conn.toUserID);
        return (from === userID && to === authorID) || (to === userID && from === authorID);
      });

      return !isPrivate || isFriend || authorID === userID;
    });

    setPosts(filteredForProfile);
  };

  const findfriendship = () => {
    fetch(process.env.REACT_APP_API_PATH + '/connections?fromUserID=' + userID + '&toUserID=' + friendid, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    }).then((res) => res.json())
      .then(
        (result) => {
          if (!result || !result[0][0]) {
            console.error("invalid friendship");
            return
          }
          if (result[0][0].attributes?.status == "blocked") {
            setIsBlocked(true);
          }
          setFriend(true)
          setfriendshipid(result[0][0].id);
        },
        (error) => {
          setFriend(false)
        }
      );
  }


  const addfriend = () => {
    if (isLoaded && !requestSent && !isfriend) {
      fetch(process.env.REACT_APP_API_PATH + "/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          toUserID: friendid,
          fromUserID: userID,
          attributes: { status: "pending", type: "friend" },
        }),
      })
        .then((res) => res.json())
        .then(() => {
          setRequestSent(true)
          setShowFriendRequestSent(true);
          setTimeout(() => setShowFriendRequestSent(false), 3000);
          setTimeout(() =>window.location.reload(), 3200)
        });
    }
  };

  const removefriend = (friendshipid) => {
    if (isLoaded && !requestSent && isfriend) {
      fetch(`${process.env.REACT_APP_API_PATH}/connections/${friendshipid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 204) {
          setRequestSent(true)
          setFriend(false);
          window.location.reload();
        }
      }).catch(console.error);
    }
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      const id = await finduserID(profileusername);
      if (id) {
        const activeConnections = await loadConnections();
        await loadPosts(id, activeConnections);
      }
      setIsLoading(false);
    };
    run();
  }, [profileusername]);


  const handleChatNavigation = () => {
    sessionStorage.setItem("toUsername", profileusername);
    navigate(`/messages/${friendid}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const useridfunc = await finduserID(profileusername);

      if (friendid) {
        const fetchuserimgfunc = await fetchuserimage(friendid);

        const isfriendfunc = await isFriend(userID, friendid)
        const findfriendfunc = await findfriendship();
      }
    }
    fetchData();
  }, [profileusername, userID, friendid])


  if (isBlocked) {
    return null; // Hide entire page if blocked
  }

  return (
      <div style={{ paddingTop: "50px", display: "flex"}} className="profilePage">
        <div className="home-feed" style={{ width: "78%" }}>
          {showFriendRequestSent && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {language === "zh-tw" ? "已發送朋友邀請！" : "Friend Request Sent!"}
              </p>
          )}
          <div className="userInfo" style={{marginBottom: '50px'}}>
            <div className="infosection">
              <img src={profileimage ? profileimage : blankphoto} className="profileimg" alt="profimg" />
              <h1>{profileusername}</h1>
              {(userID == friendid) && (
                  <div className="frienddis">
                    <b>{language === "zh-tw" ? `朋友數: ${connections.filter(conn => conn.attributes?.status === "active").length}` : `friends: ${connections.filter(conn => conn.attributes?.status === "active").length}`}</b>
                  </div>
              )}
              {!(userID == friendid) && (
                  <b>{language === "zh-tw" ? `年齡: ${age}` : `age: ${age}`}</b>
              )}
            </div>
            {!(userID == Number(friendid)) && (
                <div className="rightside">
                  {!isfriend && (
                      <img
                          src={addfriendicon}
                          className="addfriend"
                          alt="addFriend"
                          onClick={addfriend}
                      />
                  )}
                  {isfriend && (
                      <img
                          src={unfriend}
                          className="addfriend"
                          alt="removeFriend"
                          onClick={() => removefriend(friendshipid)}
                      />
                  )}
                  <img
                      src={message}
                      className="messageicon"
                      alt="message"
                      onClick={handleChatNavigation}
                      style={{ cursor: "pointer" }}
                  />
                </div>
            )}
          </div>

          <div className="posts">
            {isLoading ? (
                <div className="loading-spinner">
                  {language === "zh-tw" ? "加載帖子..." : "Loading posts..."}
                </div>
            ) : (
                posts.map((post) => (
                    <Post key={post.id} post={post} type="all-posts" loadPosts={() => loadPosts(friendid, connections)} />
                ))
            )}
          </div>

        </div>

        {/* Side bar stuff */}
        <div className='webSideBar'>
          <div className='sideFriends'>
            <div className='sideNavHeader'>
              <img src={friendLogo} className='sideNavHeaderImg' alt="Friends" />
              <div className='sideNavHeaderTitle'>{language === "zh-tw" ? "朋友" : "Friends"}</div>
            </div>
            <FriendsList
                socket={socket}
                userid={userID}
                loadFriends={loadFriends}
                connections={connections}
                setConnections={setConnections}
                isLoaded={isLoaded}
                error={error}
            />
          </div>


          <div className='sideEvents'>
            <div className='sideNavHeader'>
              <div className='sideNavHeaderTitle'>{language === "zh-tw" ? "即將來臨的事件" : "Upcoming Events"}</div>
            </div>
            <div className="sideNavEmptyText">
              {language === "zh-tw" ? "沒有即將到來的事件..." : "No Upcoming Events..."}
            </div>
          </div>

        </div>
      </div>
  );
};

export default ProfilePage;