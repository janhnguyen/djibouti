import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Posts from "./Posts";
import Post from "./Post";
import PostForm from "./PostForm";
import '../styles/activitiesPage.css'
import Activities from "./Activities";
import ActivitiesPostForm from "./ActivitiesPostForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaEllipsisH, FaUserCircle, FaHome, FaCommentDots, FaCog, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import friendLogo from "../assets/friends.png";
import chatLogo from "../assets/chatLogo.png";
import basePic from "../assets/baseProfilePic.png";
import CitySelect from "./CitySelect";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LanguageContext from "../context/LanguageContext";


const ActivitiesPage = () => {

  const cityTranslations = {
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
  
  const { language, setLanguage } = useContext(LanguageContext);
  const location = useLocation();
  const [userToken, setUserToken] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect mobile view
  const [username, setUsername] = useState("")
  const [userCity, setUserCity] = useState(
    location.state?.selectedCity || sessionStorage.getItem("selectedCity") || null
  );
  useEffect(() => {
    const selected = sessionStorage.getItem("selectedCity");
    if (selected) {
      setUserCity(selected);
    }
  }, []);

  console.log(userCity)
  const [name, setName] = useState(localStorage.getItem("name") || "Name");
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState(['All']);
  const [search, setSearch] = useState("");
  const [cityUsers, setCityUsers] = useState([]);
  const [currCity, setCurrCity] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [pinPosition, setPinPosition] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const userLocationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', // or your own URL
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // User-selected pin (e.g., red)
  const selectedPinIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
        setPinPosition([latitude, longitude]); // Set default to user's location
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        console.log("MICHAEL: ", data)
        // setUserCity(data.address.city ||
        //   data.address.amenity || "U in da bumfucks");
      });
    } else {
      console.log("Geolocation not supported");
    }
  }, []);


    const LocationMap = ({ coords, label }) => {
        const mapRef = useRef(); // 👈 track the map instance
        const [mapSize, setMapSize] = useState({ width: 500, height: 400 }); // Default height and dynamic width

        // Handle resizing the map on window resize
        useEffect(() => {
            const handleResize = () => {
                setMapSize({ width: window.innerWidth, height: window.innerHeight * 0.9 }); // Example: Map height is 40% of screen height
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, []);

        const LocationPinSetter = () => {
            useMapEvents({
                async click(e) {
                    const newPos = [e.latlng.lat, e.latlng.lng];
                    setPinPosition(newPos);

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
                        );
                        const data = await response.json();
                        setUserCity(data.address.city || (language === "zh-tw" ? "不是城市" : "Not a city"));
                    } catch (err) {
                        console.error("Geocoding error:", err);
                    }
                },
            });
            return null;
        };

        if (!coords) return <p>{language === "zh-tw" ? "地圖載入中..." : "Loading map..."}</p>;

        return (
            <MapContainer
                center={pinPosition}
                zoom={9.8}
                style={{ height: mapSize.height, width: mapSize.width }}
                ref={mapRef} // Optional: reference if needed to control the map
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPinSetter />

                {/* Default location pin */}
                {coords && (
                    <Marker position={coords} icon={userLocationIcon}>
                        <Popup>{language === "zh-tw" ? "您的位置" : "Your Location"}</Popup>
                    </Marker>
                )}

                {/* Clicked pin position */}
                {pinPosition && pinPosition !== coords && (
                    <Marker position={pinPosition} icon={selectedPinIcon}>
                        <Popup>{language === "zh-tw" ? "選擇的位置" : "Selected Location"}</Popup>
                    </Marker>
                )}
            </MapContainer>
        );
    };

    useEffect(()=>{
    const fetchUsername = async () => {
        let id = sessionStorage.getItem("user");
        const response = await fetch(`${process.env.REACT_APP_API_PATH}/users/${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        });
        const userInfo = await response.json();
        let username = userInfo.attributes?.Username?.username
        setUsername(username);
        console.log("Username: " + username);
    }

    fetchUsername();
  }, []);

  useEffect(() => {
    setUserToken(sessionStorage.getItem("token"));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [userCity]);

  const loadPosts = () => {
    fetch(process.env.REACT_APP_API_PATH + "/posts?parentID=", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(userCity)
            const filteredPosts = result[0].filter(post => post.attributes?.city === userCity);
            console.log(filteredPosts);
            if (filters.includes("All")) {
                if (search != "") {
                    let postsList = [];
                    for (let post of filteredPosts) {
                        if (post?.content?.toLowerCase().includes(search.toLowerCase()) || post?.attributes?.title?.toLowerCase().includes(search.toLowerCase())) {
                            postsList.push(post);
                        }
                    }
                    setPosts(postsList);
                } else {
                    setPosts(filteredPosts);
                }
            } else {
                let postsList = [];
                for (let post of filteredPosts) {
                    if (filters.some(filter => post?.attributes?.tags?.includes(filter))) {
                        if (search != "") {
                            if (post?.content?.toLowerCase().includes(search.toLowerCase()) || post?.attributes?.title?.toLowerCase().includes(search.toLowerCase())) {
                                postsList.push(post);
                            }
                        } else {
                            postsList.push(post);
                        }
                    }
                }
                setPosts(postsList);
            }
        })
  }

  //filter posts

  const loadPostbyFilter = (filter) => {
    setFilters((prevFilters) => {
      if (filter === "All") {
        return ["All"];
      } else {
        if (prevFilters.includes("All")) {
          return [filter];
        }
        if (prevFilters.includes(filter)) {
          return prevFilters.filter((item) => item !== filter);
        } else {
          return [...prevFilters, filter];
        }
      }
    });
  };




  useEffect(() => {
    loadPosts();
  }, [search]);

  useEffect(() => {
    loadPosts();
  }, [filters]);

    return (
        <div>
            <button className="hamburger-menu" onClick={() => setMenuVisible(!menuVisible)}>
                &#9776;
            </button>

            {menuVisible && (
                <div className="sideNavMenu">
                    <div className="sideNavItem">
                        <img src={friendLogo} alt="Friends" />
                        <span>Friends</span>
                    </div>
                    <div className="sideNavItem">
                        <img src={chatLogo} alt="Chats" />
                        <span>Chats</span>
                    </div>
                    <div className="sideNavItem">
                        <img src={basePic} alt="Profile" />
                        <span>Profile</span>
                    </div>
                    <div className="sideNavItem">
                        <img src={friendLogo} alt="Events" />
                        <span>Events</span>
                    </div>
                </div>
            )}

            <div className="homepage">
                <div className="home--feed">
                    <div className="mid">
                        <div className="act">
                            <ActivitiesPostForm loadPosts={() => loadPosts()} city={userCity}/>
                        </div>
                        <div className="location-map-container">
                            <LocationMap coords={userCoords} label={`You are in ${currCity}`}/>
                        </div>
                    </div>
                    <h3>
                      {language === "zh-tw" ? `歡迎來到 ${cityTranslations[userCity] || userCity}` : `Welcome to ${userCity}`}
                    </h3>
                    <div className="filtersSelect">
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: 'normal',
                            textAlign: 'left',
                            margin: '5px'
                        }}>{language === "zh-tw" ? "篩選：" : "Filters:"}</h3>

                        <button
                            type="button"
                            className={`tagBtn ${filters.includes("All") ? 'btn-selected' : ''}`}
                            onClick={() => loadPostbyFilter("All")}
                        >
                            {language === "zh-tw" ? "全部" : "All"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${filters.includes("Sport") ? 'btn-selected' : ''}`}
                            onClick={() => loadPostbyFilter("Sport")}
                        >
                            {language === "zh-tw" ? "運動" : "Sport"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${filters.includes("Social") ? 'btn-selected' : ''}`}
                            onClick={() => loadPostbyFilter("Social")}
                        >
                            {language === "zh-tw" ? "社交" : "Social"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${filters.includes("Travel") ? 'btn-selected' : ''}`}
                            onClick={() => loadPostbyFilter("Travel")}
                        >
                            {language === "zh-tw" ? "旅遊" : "Travel"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${filters.includes("Study") ? 'btn-selected' : ''}`}
                            onClick={() => loadPostbyFilter("Study")}
                        >
                            {language === "zh-tw" ? "學習" : "Study"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${filters.includes("Entertainment") ? 'btn-selected' : ''}`}
                            onClick={() => loadPostbyFilter("Entertainment")}
                        >
                            {language === "zh-tw" ? "娛樂" : "Entertainment"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${filters.includes("Other") ? 'btn-selected' : ''}`}
                            onClick={() => loadPostbyFilter("Other")}
                        >
                            {language === "zh-tw" ? "其他" : "Other"}
                        </button>
                    </div>

                    <div className="search-bar-container">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}  // Update search term
                            placeholder={language === "zh-tw" ? "搜尋貼文..." : "Search posts..."}
                            className="search-bar"
                        />
                    </div>

                    <div className="posts">
                        {posts.map((post) => (
                            <Post key={post.id} post={post} type="all-posts" loadPosts={() => loadPosts()}/>
                        ))}
                    </div>

                </div>
                <div className="webSideBarActivitiesPage">
                    <div className="webSideBarActivitiesPageHeader"
                         style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px'}}>
                        <img src={friendLogo} className='sideNavHeaderImg'/>
                        <div
                            className='sideNavHeaderTitle'>{language === "zh-tw" ? `來自 ${userCity} 的用戶` : `Members in ${userCity}`}</div>
                    </div>

                    <div className="webSideBarActivitiesPageContent">
                        {cityUsers.length > 0 ? (
                            cityUsers.map(user => (
                                <Link to={`/profile/` + user.attributes?.Username?.username}>
                                    <div key={user.id} className="sideNavItem" style={{color: 'black'}}>
                                        <img
                                            src={basePic}
                                            alt="Profile"
                                            className="sideNavImg"
                                            style={{borderRadius: '50%'}}
                                        />
                                        <div>
                                            <div className="homeFriendName">
                                                {user.attributes?.Username?.username || "username"}
                                            </div>

                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="sideNavEmptyText">
                                {language === "zh-tw"
                                    ? userCity
                                        ? `在 ${userCity} 找不到用戶`
                                        : "請選擇城市以查看用戶"
                                    : userCity
                                        ? `No members found in ${userCity}`
                                        : "Select a city to see members"}
                            </div>
                        )}
                    </div>
                </div>
                {/*side bar stuff */}
                {/*<div className='webSideBar'>

            <input className='sideSearch' type='text' placeholder='Search for people or chats...' />

            <div className='sideFriends'>
              <div className='sideNavHeader'>
                <img src={friendLogo} className='sideNavHeaderImg' alt="Friends" />
                <div className='sideNavHeaderTitle'>Friends</div>
              </div>
              {[...Array(6)].map((_, i) => (
                <Link to="/friend" className="noDecLink" key={i}>
                  <div className="sideNavItem" style={i === 5 ? { borderBottom: '1px solid #969696' } : {}}>
                    <img src={friendLogo} className="sideNavImg" alt="Friend" />
                    <div>
                      <div className="homeFriendName">Friend's Name</div>
                      <div className="homeFriendUser">@username</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className='sideChats'>
              <div className='sideNavHeader'>
                <img src={chatLogo} className='sideNavHeaderImg' alt="Chats" />
                <div className='sideNavHeaderTitle'>Chats</div>
              </div>
              {[...Array(3)].map((_, i) => (
                <Link to="/chats" className="noDecLink" key={i}>
                  <div className="sideNavItem" style={i === 2 ? { borderBottom: '1px solid #969696' } : {}}>
                    <img src={basePic} className="sideNavImg" alt="Chat" />
                    <div>
                      <div className="homeFriendName">Chat Group</div>
                      <div className="homeFriendUser">6 Members</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className='sideEvents'>
              <div className='sideNavHeader'>
                <div className='sideNavHeaderTitle'>Upcoming Events</div>
              </div>
              <Link to="/events" className="noDecLink">
                <div className="sideNavEmptyText">No Upcoming Events...</div>
              </Link>
            </div>

            <div className='sideNotifications'>
              <div className='sideNavHeader'>
                <div className='sideNavHeaderTitle'>Notifications</div>
              </div>
              <Link to="/notifications" className="noDecLink">
                <div className="sideNavEmptyText">No Notifications...</div>
              </Link>
            </div>
          </div>*/}

            </div>


        </div>
    );
};

export default ActivitiesPage;
