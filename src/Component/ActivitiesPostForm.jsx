import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Posts from "./Posts";
import Post from "./Post";
import PostForm from "./PostForm";
import '../styles/activitiesPage.css'
import Activities from "./Activities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaEllipsisH, FaUserCircle, FaHome, FaCommentDots, FaCog, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import friendLogo from "../assets/friends.png";
import chatLogo from "../assets/chatLogo.png";
import basePic from "../assets/baseProfilePic.png";
import { createClient } from "@supabase/supabase-js";
import showMoreIcon from "../assets/show-more.png";
import LanguageContext from "../context/LanguageContext";


const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);



const ActivitiesPostForm = ({loadPosts, city}) => {
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
    const { language, setLanguage } = useContext(LanguageContext);


    const [selectedTags, setSelectedTags] = useState([]);
    const [tagsButtonSelected, setTagsButtonSelected] = useState(false);


    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) => {
          if (prevTags.includes(tag)) {
            console.log(selectedTags)
            return prevTags.filter((t) => t !== tag);  // Remove tag
          } else {
            console.log(selectedTags)
            return [...prevTags, tag];  // Add tag
          }
        });
      };


      const createPost = async (title, content, tags, /*,hastags*/) => {
        if (!title || !content) {
          document.getElementById("postWarnings").innerHTML = "Please fill in all fields.";
          return;
        }
        if (title.length > 50) {
          document.getElementById("postWarnings").innerHTML = "Title is too long.";
          return;
        }
        try {
          const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: content,
                attributes: {
                    "title": title,
                    "tags": tags,
                    "city": city,
                    /* "hashtags": hashtags */
                }
              }),
          });
      
          if (response.ok) {
            const result = await response.json();
            console.log('Post created successfully:', result);
            const { data, error } = await supabase
            .from("createEvent")
            .insert([
              {
                author_id: sessionStorage.getItem("user"),
                title: title,
                content: content,
                status: "open", // optional: can be "open", "full", etc
                head_count: 0, // optional: default to 0 if you're tracking this
                city: city
              }
            ]);
        
          if (error) {
            console.error("Error inserting into createEvent:", error.message);
          } else {
            console.log("Event added to createEvent table:", data);
          }
            document.getElementById("postFormTitle").value = "";
            document.getElementById("postFormBody").value = "";
            setSelectedTags([]);
            document.getElementById("postWarnings").innerHTML = "Successfully posted!";
            loadPosts();
            return result;
          } else {
            const errorData = await response.json();
            console.error('Error creating post:', errorData);
            throw new Error(errorData.message || 'Failed to create post');
          }
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      };



    return (
        <div className="postFormContainer" style={{width: '100%'}}>
            <div className="post-form" style={{minWidth: '70%'}}>
            <h3>{language === "zh-tw" ? "建立新貼文" : "Create a New Post"}</h3>
            <h3 style={{fontWeight: 'normal', fontSize: '16px', marginTop: '0px', color: 'gray'}}>
              <span>{language === "zh-tw" ? "城市：" : "City:"}</span>
              {language === "zh-tw" ? (cityTranslations[city] || city) : city}
            </h3>
                <div className="form-group">
                    <input style={{width: '70%'}}
                        type="text"
                        id="postFormTitle"
                        placeholder={language === "zh-tw" ? "輸入您的貼文標題" : "Enter your post title"}
                        />
                </div>

                <div className="form-group">
                    <textarea style={{border: "none", backgroundColor: '#f9f9f9'}}
                        id="postFormBody"
                        placeholder={language === "zh-tw" ? "寫些什麼..." : "Write something..."}
                    ></textarea>
                </div>

                <div className="form-group"  style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50%', margin: '20px auto'}}>
                  <button className='postFormButtons' 
                    onClick={() => 
                    {document.getElementById("tagsSelection").hidden = !document.getElementById("tagsSelection").hidden
                    setTagsButtonSelected(!tagsButtonSelected)
                    }}
                    style={{border: tagsButtonSelected ? '1px solid gray' : '1px solid #d9d9d9', backgroundColor: tagsButtonSelected ? '#d9d9d9' : '', marginLeft:'auto', marginRight:'auto'}}
                  >{language === "zh-tw" ? "標籤" : "HashTags"}</button> 
                  
                </div>

                <div className="form-group" id="tagsSelection" hidden={true}>
                    <div className="button-group">
                        <button
                            type="button"
                            className={`tagBtn ${selectedTags.includes("Sport") ? 'btn-selected' : ''}`}
                            onClick={() => handleTagClick("Sport")}
                        >
                        {language === "zh-tw" ? "運動" : "Sport"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${selectedTags.includes("Social") ? 'btn-selected' : ''}`}
                            onClick={() => handleTagClick("Social")}
                        >
                        {language === "zh-tw" ? "社交" : "Social"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${selectedTags.includes("Travel") ? 'btn-selected' : ''}`}
                            onClick={() => handleTagClick("Travel")}
                        >
                        {language === "zh-tw" ? "旅遊" : "Travel"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${selectedTags.includes("Study") ? 'btn-selected' : ''}`}
                            onClick={() => handleTagClick("Study")}
                        >
                        {language === "zh-tw" ? "學習" : "Study"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${selectedTags.includes("Entertainment") ? 'btn-selected' : ''}`}
                            onClick={() => handleTagClick("Entertainment")}
                        >
                        {language === "zh-tw" ? "娛樂" : "Entertainment"}
                        </button>

                        <button
                            type="button"
                            className={`tagBtn ${selectedTags.includes("Other") ? 'btn-selected' : ''}`}
                            onClick={() => handleTagClick("Other")}
                        >
                        {language === "zh-tw" ? "其他" : "Other"}
                        </button>
                    </div>
                </div>

                
               
                <div className="form-actions">
                    
                    <button className="submitButton"
                        onClick={() => {
                        const title = document.getElementById("postFormTitle").value; 
                        const body = document.getElementById("postFormBody").value;
                        // const hashtags = ...
                        createPost(title, body, selectedTags/*, hashtags */); 
                        }}
                    >
                        <span style={{color: 'white'}}>{language === "zh-tw" ? "發佈" : "Post"}</span>
                    </button>
                </div> 
                <h3 style={{fontSize: '14px', fontWeight: 'normal', color: 'red', margin:'0', marginTop:'3px'}} id="postWarnings"></h3>
            </div>
            </div>
    )
}


export default ActivitiesPostForm;