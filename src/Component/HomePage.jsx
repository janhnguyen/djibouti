import React, { useEffect, useState, useContext } from "react";
import Posts from "./Posts";
import PostForm from "./PostUpdate";
import { FaSearch, FaEllipsisH, FaUserCircle, FaHome, FaCommentDots, FaCog, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import './HomePage.css';
import '../styles/homepage.css';
import friendLogo from "../assets/friends.png";
import chatLogo from "../assets/chatLogo.png";
import basePic from "../assets/baseProfilePic.png";
import FriendsList from "./homePageFriendList";
import { socket } from "../App"; 
import { createClient } from "@supabase/supabase-js";
import airplaneLogo from "../assets/airplane.png";
import DjiboutiLogo from "../assets/DjiboutiLogoHome.png";
import DownArrow from "../assets/Vector.png";
import SideNavBar from "./SideNavBar";
import LanguageContext from "../context/LanguageContext";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const HomePage = ({ appRefresh }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPostForm, setShowPostForm] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name") || "Name");
  const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [refresh, setRefresh] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);


  const userID = sessionStorage.getItem("user");
  const userToken = sessionStorage.getItem("token");
  const [isLoaded, setIsLoaded] = useState(false);
  const [connections, setConnections] = useState([]); // Ensure it's always an array
  const [error, setError] = useState(null);

  const loadFriends = () => {
    fetch(
      process.env.REACT_APP_API_PATH + `/connections?anyUserID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
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
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from("event")
          .select("*")
          .eq("user", userID.toString());
  
        if (eventError) throw eventError;
        setUserEvents(eventData || []);
  
        const { data: createdData, error: createdError } = await supabase
          .from("createEvent")
          .select("*")
          .eq("author_id", userID.toString());
  
        if (createdError) throw createdError;
  
        const updatedCreatedEvents = await Promise.all(
          createdData.map(async (event) => {
            const { count, error: countError } = await supabase
              .from("event")
              .select("*", { count: "exact" })
              .eq("title", event.title)
              .eq("message", event.content);
  
            if (countError) throw countError;
  
            return { ...event, head_count: count };
          })
        );
  
        setMyCreatedEvents(updatedCreatedEvents);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
  
    if (userID) {
      fetchUserEvents();
      const interval = setInterval(fetchUserEvents, 10000); // 🔁 every 10s
  
      return () => clearInterval(interval); // cleanup on unmount
    }
  }, [userID]);
  

  const [chatList, setChatList] = useState([]);
const [chatUserProfiles, setChatUserProfiles] = useState({});

useEffect(() => {
  const fetchUserChatsAndProfiles = async () => {
    const { data: messagesData, error: msgError } = await supabase
      .from("messages")
      .select("*")
      .or(`from_user_id.eq.${userID},to_user_id.eq.${userID}`)
      .order("created_at", { ascending: false });

    if (msgError) {
      console.error("❌ Error fetching messages:", msgError);
      return;
    }

    const uniqueUsers = new Map();
    const userIDNum = Number(userID);
    const seenUserIDs = new Set();

    for (const msg of messagesData) {
      const otherUserID =
        msg.from_user_id === userIDNum ? msg.to_user_id : msg.from_user_id;

      if (!seenUserIDs.has(otherUserID)) {
        uniqueUsers.set(otherUserID, msg); // Keep only the latest message per user
        seenUserIDs.add(otherUserID);
      }
    }

    const profilePromises = Array.from(uniqueUsers.keys()).map(async (id) => {
      const res = await fetch(`${process.env.REACT_APP_API_PATH}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await res.json();
      return { id, user: data };
    });

    const profileResults = await Promise.all(profilePromises);
    const profileMap = {};
    profileResults.forEach(({ id, user }) => {
      profileMap[id] = user;
    });

    setChatList(Array.from(uniqueUsers.entries()));
    setChatUserProfiles(profileMap);
  };

  if (userID) fetchUserChatsAndProfiles();
}, [userID]);

  const closeEvent = async (eventID) => {
    const { error } = await supabase
      .from("createEvent")
      .update({ status: "closed" })
      .eq("id", eventID);
  
    if (error) {
      console.error("Error closing event:", error.message);
    } else {
      // Refresh events
      setMyCreatedEvents((prev) =>
        prev.map((e) =>
          e.id === eventID ? { ...e, status: "closed" } : e
        )
      );
    }
  };
  
  const [expandedEventId, setExpandedEventId] = useState(null);



  const handleSelectCityAndRedir = (selectedCity) => {
    if (selectedCity) {
        document.getElementById("viewActivitiesIn").innerHTML = "...Travelling to";
        document.getElementById("travelWarnings").innerHTML = "You are being redirected!";
        document.getElementById("travelWarnings").style.color = "#d7a583";
        let id = sessionStorage.getItem("user");
        fetch(`${process.env.REACT_APP_API_PATH}/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((result) => {
                let currUserAttributes = result?.attributes || {};
                currUserAttributes.City = { "city": selectedCity };
                return fetch(`${process.env.REACT_APP_API_PATH}/users/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ attributes: currUserAttributes }),
                });
            })
            .then((res) => res.json())
            .then((result) => {
                console.log("User attributes updated successfully:", result);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            })
            .then(() => {
              sessionStorage.setItem("selectedCity", selectedCity);
              console.log("selectedCity", selectedCity)
              navigate('/activities');
            })
            .then(() => {
                window.location.reload();
            });

    } else {
        document.getElementById("travelWarnings").innerHTML = "*Please select a city.";
        document.getElementById("travelWarnings").style.color = "red";
    }
};
  const cityTranslations = {
  // USA
  "New York": "紐約",
  "Los Angeles": "洛杉磯",
  "Chicago": "芝加哥",
  "Houston": "休士頓",
  "Phoenix": "鳳凰城",
  "Philadelphia": "費城",
  "San Antonio": "聖安東尼奧",
  "San Diego": "聖地牙哥",
  "Dallas": "達拉斯",
  "San Jose": "聖荷西",
  "Austin": "奧斯汀",
  "Jacksonville": "傑克遜維爾",
  "Fort Worth": "沃斯堡",
  "Columbus": "哥倫布",
  "Charlotte": "夏洛特",
  "San Francisco": "舊金山",
  "Indianapolis": "印第安納波利斯",
  "Seattle": "西雅圖",
  "Denver": "丹佛",
  "Washington": "華盛頓",
  "Boston": "波士頓",
  "El Paso": "艾爾帕索",
  "Detroit": "底特律",
  "Nashville": "納什維爾",
  "Portland": "波特蘭",
  "Memphis": "孟菲斯",
  "Oklahoma City": "奧克拉荷馬市",
  "Las Vegas": "拉斯維加斯",
  "Louisville": "路易斯維爾",
  "Baltimore": "巴爾的摩",
  "Milwaukee": "密爾瓦基",
  "Albuquerque": "阿布奎基",
  "Tucson": "圖森",
  "Fresno": "弗雷斯諾",
  "Mesa": "梅薩",
  "Sacramento": "沙加緬度",
  "Atlanta": "亞特蘭大",
  "Kansas City": "堪薩斯市",
  "Colorado Springs": "科羅拉多泉",
  "Miami": "邁阿密",
  "Raleigh": "羅利",
  "Omaha": "奧馬哈",
  "Long Beach": "長堤市",
  "Virginia Beach": "維吉尼亞海灘",
  "Oakland": "奧克蘭",
  "Minneapolis": "明尼阿波利斯",
  "Tulsa": "塔爾薩",
  "Arlington": "阿靈頓",
  "New Orleans": "新奧爾良",
  "Wichita": "威奇托",
  "Cleveland": "克里夫蘭",
  "Tampa": "坦帕",
  "Bakersfield": "貝克斯菲爾德",
  "Aurora": "奧羅拉",
  "Anaheim": "阿納海姆",
  "Honolulu": "火奴魯魯",
  "Santa Ana": "聖塔安娜",
  "Riverside": "河濱市",
  "Corpus Christi": "科珀斯克里斯蒂",
  "Lexington": "列克星敦",
  "Stockton": "史塔克頓",
  "St. Louis": "聖路易斯",
  "Pittsburgh": "匹茲堡",
  "Saint Paul": "聖保羅",
  "Cincinnati": "辛辛那提",
  "Anchorage": "安克拉治",
  "Henderson": "亨德森",
  "Greensboro": "格林斯伯勒",
  "Plano": "普萊諾",
  "Newark": "紐瓦克",
  "Toledo": "托萊多",
  "Orlando": "奧蘭多",
  "Buffalo": "水牛城",
  "St. Petersburg": "聖彼得堡",
  "Lincoln": "林肯",
  "Chula Vista": "丘拉維斯塔",
  "Jersey City": "澤西市",
  "Chandler": "錢德勒",
  "Fort Wayne": "韋恩堡",
  "Durham": "達勒姆",
  "St. Paul": "聖保羅",
  
  // Canada
  "Toronto": "多倫多",
  "Montreal": "蒙特婁",
  "Vancouver": "溫哥華",
  "Calgary": "卡加利",
  "Edmonton": "愛德蒙頓",
  "Ottawa": "渥太華",
  "Winnipeg": "溫尼伯",
  "Quebec City": "魁北克市",
  "Hamilton": "哈密爾頓",
  "Kitchener": "基奇納",
  "London": "倫敦 (加拿大)",
  "Victoria": "維多利亞",
  "Halifax": "哈利法克斯",
  "Windsor": "溫莎",
  "Saskatoon": "薩斯卡通",
  "Regina": "里賈納",
  "St. John's": "聖約翰斯",
  
  // Mexico
  "Mexico City": "墨西哥城",
  "Guadalajara": "瓜達拉哈拉",
  "Monterrey": "蒙特雷",
  "Puebla": "普埃布拉",
  "Tijuana": "蒂華納",
  "Cancun": "坎昆",
  "Mérida": "梅里達",
  "León": "萊昂",
  "Ciudad Juárez": "華雷斯城",
  "Querétaro": "克雷塔羅",
  "Acapulco": "阿卡普爾科",
  "Chihuahua": "奇瓦瓦",
};

  const [cities, setCities] = useState([
    "Buffalo", "Charlotte", "Chicago", "Houston", "Miami",
    "New York", "Philadelphia", "Phoenix", "Seattle", "San Diego"
  ]);

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('createEvent')           // your table name
        .select('city');          // or whatever field holds the city name
  
      if (error) {
        console.error('Error fetching cities:', error);
        return;
      }
  
      if (data) {
        console.log(data)
        const newCities = data.map(item => item.city)
        .filter(city => city && city.trim() !== "");
        // Avoid duplicates if Supabase has any of the default ones
        const uniqueCities = [...new Set([...cities, ...newCities])];
        setCities(uniqueCities);
      }
    };
  
    fetchCities();
  }, []);
  
  const handleCancelEvent = async (eventId) => {
    const { error } = await supabase
      .from('event')
      .delete()
      .eq('id', eventId);
  
    if (error) {
      console.error("Failed to delete event:", error);
    } else {
      console.log("Event deleted:", eventId);
      // Optional: refresh local state to remove the deleted event
      setUserEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    }
  }

  return (
    <div className='mainContainer'>
      {isMobile ? (
        <div className="mobile-homepage">    
              {loggedIn ?  (
                <>
                  <PostForm refresh={refresh} setRefresh={setRefresh} />

                  <div className="feed">
                    <Posts doRefreshPosts={refresh} appRefresh={appRefresh} showPostForm={showPostForm} />
                  </div>
                </>
              ) : (
                <div style={{height:'100vh'}}>

                <h3 className="loginToViewCities">
                        {language === "zh-tw" ? (
                          <>
                            <span><Link to="/login" style={{color: '#d7835a', textDecoration:'none'}}>登入</Link></span> 查看城市
                          </>
                        ) : (
                          <>
                            <span><Link to="/login" style={{color: '#d7835a', textDecoration:'none'}}>Log In</Link></span> to View Cities
                          </>
                        )}
                  </h3>

                  <h3 className="homeQuote">
                    {language === "zh-tw" ? (
                      <>
                        <span style={{color: '#d7835a'}}>在地</span> 人情<br />
                        真實 <span style={{color: '#d7835a'}}>連結</span>
                      </>
                    ) : (
                      <>
                        <span style={{color: '#d7835a'}}>Local</span> People, <br/>
                        Real <span style={{color: '#d7835a'}}>Connections</span>
                      </>
                    )}
                  </h3>

                  <img src={DjiboutiLogo} style={{bottom:'60%', width:'250px', height:'250px'}} className="skyline" />
                  
                  </div>
              )}

          

        </div>
      ) : (
        
        <>

        <div style={{height:'100vh'}}>


        {loggedIn ? (
            <div className="selectCityToActivities" style={{backgroundColor: 'transparent'}}>
              <span style={{fontSize: '18px', color: 'gray', marginBottom: '10px'}} id="travelThings">
                {language === "zh-tw" ? "尋找您所在城市的活動？" : "Looking for things to do in your city?"}
              </span>
              <span style={{fontSize: '18px', color: '#000', fontWeight: 'bold'}} id="viewCitiesIn">
                {language === "zh-tw" ? "查看以下城市：" : "View Activities in:"}
              </span>
              <p id="viewActivitiesIn"></p>
              <p id="travelWarnings"></p>


              <div className='citiesListButtons'>
                
              {cities.map((city, index) => (
                <button key={index} className="cityButton" onClick={() => handleSelectCityAndRedir(city)}>
                  {language === "zh-tw" ? (cityTranslations[city] || city) : city}
                </button>
              ))}

                
              </div>

            </div>) : <h3 className="loginToViewCities">
                        {language === "zh-tw" ? (
                          <>
                            <span><Link to="/login" style={{color: '#d7835a', textDecoration:'none'}}>登入</Link></span> 查看城市
                          </>
                        ) : (
                          <>
                            <span><Link to="/login" style={{color: '#d7835a', textDecoration:'none'}}>Log In</Link></span> to View Cities
                          </>
                        )}
                      </h3>
                      }
          <img src={DjiboutiLogo} className="skyline" />

          <h3 className="homeQuote">
            {language === "zh-tw" ? (
              <>
                <span style={{color: '#d7835a'}}>在地</span> 人情<br />
                真實 <span style={{color: '#d7835a'}}>連結</span>
              </>
            ) : (
              <>
                <span style={{color: '#d7835a'}}>Local</span> People, <br/>
                Real <span style={{color: '#d7835a'}}>Connections</span>
              </>
            )}
          </h3>
          <a className="downArrow" href="#homePage" style={ {width: '40px', marginTop: '10px'}}>
            {language === "zh-tw" ? (
              <span style={{ marginRight: "8px" }}>首頁</span>
            ) : (
              <span style={{ marginRight: "8px" }}>Home</span>
            )}
            <img src={DownArrow} style={{width: '40px', marginTop: '10px'}}/>
          </a>
        </div>
        <div className="webHomePage" id="homePage">

          
          <div className='webFeed'>

            

            <div className="createPost">
              {loggedIn ? (
                <PostForm refresh={refresh} setRefresh={setRefresh} />
              ) : (
              <button className="loginButton" onClick={() => navigate("/login")}>
                {language === "zh-tw" ? "點此登入" : "Click Here To Log In"}
              </button>
              )}
            </div>


            <div className="feed">
              <Posts doRefreshPosts={refresh} appRefresh={appRefresh} showPostForm={showPostForm} />
            </div>
          </div>
          <div className="webSideBar">
            <SideNavBar
              userID={userID}
              socket={socket}
              loadFriends={loadFriends}
              connections={connections}
              isLoaded={isLoaded}
              error={error}
              chatList={chatList}
              chatUserProfiles={chatUserProfiles}
              userEvents={userEvents}
              myCreatedEvents={myCreatedEvents}
              expandedEventId={expandedEventId}
              setExpandedEventId={setExpandedEventId}
              handleCancelEvent={handleCancelEvent}
              closeEvent={closeEvent}
              language={language} 
            />
          </div>

        </div>
        </>
      )}
    </div>
    
  );
};

export default HomePage;