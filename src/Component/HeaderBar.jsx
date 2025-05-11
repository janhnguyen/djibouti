import "../styles/header.css";
import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import settingsIcon from '../assets/settings.png';
import bookmark from '../assets/people.png';
import friends from '../assets/user.png';
import location from '../assets/pin.png';
import NotificationBell from "./NotificationBell";
import { FaGlobe } from 'react-icons/fa'; 
import LanguageContext from "../context/LanguageContext";

const HeaderBar = () => {
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
  const navigate = useNavigate();
  const [showSelectCity, setShowSelectCity] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [currCity, setCurrCity] = useState(null);
  const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("name") || "Name");
  const dropdownRef = useRef(null);

  const handleLanguageToggle = () => {
    setShowLanguagePopup(!showLanguagePopup);
  };

  function cleanName(name) {
    if (!name) return null;
    return name.replace(/^(Town|Village|City) of\s+/i, '').trim();
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await response.json();
          const rawCity = cleanName(data.address.city);
          const rawTown = cleanName(data.address.town);
          const rawVillage = cleanName(data.address.village);

          let city = "Unknown Location";
          if (rawTown && rawCity && rawTown !== rawCity) {
            city = `${rawTown}, ${rawCity}`;
          } else {
            city = rawCity || rawTown || rawVillage || "Unknown Location";
          }
          setCurrCity(city);
        } catch (error) {
          console.error("Error getting location", error);
          setCurrCity("Select City");
        }
      }, (error) => {
        console.error("Error getting location", error);
        setCurrCity("Select City");
      });
    } else {
      console.log("Geolocation not supported");
      setCurrCity("Select City");
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleCreateEventClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            sessionStorage.setItem(
              "selectedCity",
              data.address.city || data.address.town || data.address.state || "Unknown"
            );
            navigate("/activities");
          } catch (err) {
            console.error("Error during reverse geocoding:", err);
            alert("Failed to retrieve city information.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Please allow location access in your browser to create an event and then refresh.");
        }
      );
    } else {
      console.log("Geolocation not supported");
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguagePopup(false);
      }
    };
    if (showLanguagePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLanguagePopup]);

  return (
    <div className="header">
      {language === "zh-tw" ? (
        <div className="djibouti-btn">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>吉布地</span>
            <span style={{ fontSize: '12px', fontWeight: 'normal' }}>探索</span>
          </Link>
        </div>
      ) : (
        <div className="djibouti-btn">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Djibouti</span>
            <span style={{ fontSize: '10px', textDecoration: 'none' }}>Explore</span>
          </Link>
        </div>
      )}

      <div className="header-icons">
        <div className="city-search">
          <img src={location} className="city-pin-icon" alt="location" />
          <div className="city-search-text">
            <button
              onClick={() => {
                if (currCity === "Select City") {
                  alert("Please allow location access in your browser to detect your city and then refresh the page");
                } else {
                  setShowSelectCity(!showSelectCity);
                }
              }}
              style={{ background: "none", border: "none" }}
            >
              <p className="city-clickable">
                {currCity 
                  ? (language === "zh-tw" ? (cityTranslations[currCity] || currCity) : currCity)
                  : "Select City"}
              </p>
            </button>
          </div>

          {/* Language Selector */}
          <div className="globe-container" ref={dropdownRef}>
            <button onClick={handleLanguageToggle} className="language-globe-button">
              <FaGlobe className="w-5 h-5" />
            </button>

            {showLanguagePopup && (
              <div className="language-dropdown">
                <p className="language-title">Choose Language</p>
                <button onClick={() => { setLanguage("en"); setShowLanguagePopup(false); }} className="language-button">
                  English
                </button>
                <button onClick={() => { setLanguage("zh-tw"); setShowLanguagePopup(false); }} className="language-button">
                  繁體中文
                </button>
              </div>
            )}
          </div>
        </div>

        <button onClick={handleCreateEventClick} style={{ background: "#d9d9d9" }}>
          {language === "zh-tw" ? "建立活動" : "Create Event"}
        </button>

        <Link to="/friends">
          <input type="image" src={friends} className="header-friends-icon" alt="friends" />
        </Link>
        <Link to={`/profile/${username}`}>
          <input type="image" src={bookmark} className="header-bookmarked-icon" alt="bookmarked" />
        </Link>
        <Link to="/settings" className="settingsiconheader">
          <input type="image" src={settingsIcon} className="header-bookmarked-icon" alt="settings" />
        </Link>
      </div>

        <div className="right">
          <div className="loginContain" style={{ width: '75%' }}>
            {loggedIn ? (
              <button
                className="loginBtn"
                onClick={() => {
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("user");
                  localStorage.removeItem("name"); // if you store username there
                  setLoggedIn(false);
                  navigate("/login");
                }}
              >
                {language === "zh-tw" ? "登出" : "Log Out"}
              </button>
            ) : (
              <Link to="/login" className="loginBtn" style={{ justifyContent: 'center', display: 'flex' }}>
                <button className="loginBtn">
                  {language === "zh-tw" ? "登入" : "Login"}
                </button>
              </Link>
            )}
          </div>
          <div className="notificationsContain" style={{ width: '25%' }}>
            <NotificationBell />
          </div>
        </div>
      </div>
    
  );
};

export default HeaderBar;
