import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import login from "../assets/inputlayout.JPG";
import hompage from "../assets/homelayout.JPG";
import '../styles/StyleGuide.css';
import popup from "../assets/notifpopupstyle.JPG";
import like from "../assets/thumbsup.png";
import friends from "../assets/friends.png";
import addfriends from "../assets/addfriend.png";
import comments from "../assets/comment.svg";
import exit from "../assets/exit.png";
import location from "../assets/location.png";
import search from "../assets/search_logo.png";
import settings from "../assets/settings.png";
import codeSnippets from "../utils/codeSnippets";
import LanguageContext from "../context/LanguageContext";

const CodePopup = ({ title, code, onClose }) => {
    const [copied, setCopied] = useState(false);
    const { language, setLanguage } = useContext(LanguageContext);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h3>{language === 'zh-tw' ?
                    (title === "Header Color" ? "標題顏色" :
                        title === "Button Color" ? "按鈕顏色" :
                            title === "Body Color" ? "主體顏色" :
                                title === "Delete Button Color" ? "刪除按鈕顏色" :
                                    title === "Request Button Color" ? "請求按鈕顏色" :
                                        title) : title}
                </h3>
                <pre className="popup-code">{code}</pre>
                <button className="popup-button" onClick={handleCopy}>
                    {copied ? (language === 'zh-tw' ? "已複製!" : "Copied!") : (language === 'zh-tw' ? "複製" : "Copy")}
                </button>
                <button className="popup-button" onClick={onClose}>
                    {language === 'zh-tw' ? "關閉" : "Close"}
                </button>
            </div>
        </div>
    );
};

const Styleguide = () => {
    const [popupTitle, setPopupTitle] = useState(null);
    const { language, setLanguage } = useContext(LanguageContext);

    const colorButtons = [
        { label: language === 'zh-tw' ? "標題顏色" : "Header Color", className: "tileHead" },
        { label: language === 'zh-tw' ? "按鈕顏色" : "Button Color", className: "tileButton" },
        { label: language === 'zh-tw' ? "主體顏色" : "Body Color", className: "tileBody" },
        { label: language === 'zh-tw' ? "刪除按鈕顏色" : "Delete Button Color", className: "tilered" },
        { label: language === 'zh-tw' ? "請求按鈕顏色" : "Request Button Color", className: "tilegreen" }
    ];

    return (
        <div className="styleguide">
            <div className="stylecontain">
                {popupTitle && (
                    <CodePopup
                        title={popupTitle}
                        code={codeSnippets[popupTitle] || (language === 'zh-tw' ? "請在此放置程式碼" : "Place Code Here")}
                        onClose={() => setPopupTitle(null)}
                    />
                )}

                <h1>{language === 'zh-tw' ? "顏色" : "Colors"}</h1>
                <div className="tilecontain">
                    {colorButtons.map(({ label, className }) => (
                        <div key={label}>
                            <div className={`color-tile ${className}`}>
                                <p1>{label}</p1>
                            </div>
                            <button className="popup-button" onClick={() => setPopupTitle(label)}>
                                {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                            </button>
                        </div>
                    ))}
                </div>

                <h1>{language === 'zh-tw' ? "圖示" : "Icons"}</h1>
                <div className="popupinfocontain">
                    {[like, friends, addfriends, comments, exit, location, search, settings].map((src, i) => (
                        <img key={i} src={src} alt="icon" style={{ width: "70px", height: "50px" }} />
                    ))}
                </div>

                <h1>{language === 'zh-tw' ? "字體" : "Fonts"}</h1>
                <div className="fontsContain">
                    {[{
                        label: language === 'zh-tw' ? "Logo 字體" : "Logo Font",
                        style: { fontFamily: "Righteous", fontSize: "1.8em", fontWeight: "lighter", color: "#000", textDecoration: "underline" }
                    },
                        {
                            label: language === 'zh-tw' ? "標題字體" : "Header Font",
                            style: { fontFamily: "Verdana, Geneva, Tahoma, sans-serif", fontSize: "1.2em", fontWeight: "lighter", color: "#000" }
                        },
                        {
                            label: language === 'zh-tw' ? "按鈕字體" : "Button Font",
                            style: { fontSize: ".8em", fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }
                        },
                        {
                            label: language === 'zh-tw' ? "文字字體" : "Text Font",
                            style: { fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif", fontSize: ".8em" }
                        },
                        {
                            label: language === 'zh-tw' ? "主體字體" : "Body Font",
                            style: { fontFamily: "Arial, sans-serif" }
                        }].map(({ label, style }) => (
                        <div key={label}>
                            <p style={style}>{label} - {language === 'zh-tw' ? "歡迎來到吉布地網站！" : "Welcome to Djibouti website!"}</p>
                            <button className="popup-button" onClick={() => setPopupTitle(label)}>
                                {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                            </button>
                        </div>
                    ))}
                </div>

                <h1>{language === 'zh-tw' ? "佈局" : "Layouts"}</h1>
                <div className="layoutinfo">
                    <div className="layoutcontianer">
                        <img src={login} alt="loginlayout" />
                        <p>{language === 'zh-tw' ? "輸入佈局" : "Input Layout"}</p>
                        <button className="popup-button" onClick={() => setPopupTitle("Input Layout Code")}>
                            {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                        </button>
                    </div>
                    <div className="layoutcontianer">
                        <img src={hompage} alt="homelayout" />
                        <p>{language === 'zh-tw' ? "主頁佈局" : "Home Layout"}</p>
                        <button className="popup-button" onClick={() => setPopupTitle("Home Layout Code")}>
                            {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                        </button>
                    </div>
                </div>

                <h1>{language === 'zh-tw' ? "彈出資訊" : "Pop up information"}</h1>
                <div className="popupinfocontain">
                    <p>{language === 'zh-tw' ? "第一種彈出方式是利用 javascript 警告。" : "The first form of popups is utilizing javascript alerts."}</p>
                    <button className="popup-button" onClick={() => setPopupTitle("Alert Popup Code")}>
                        {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                    </button>
                </div>
                <div className="popupinfocontain">
                    <p>{language === 'zh-tw' ? "第二種彈出方式是與按鈕連接的小型彈出視窗" : "The second form of popups is a small popup connecting to a button"}</p>
                    <img src={popup} alt="popuplayout" />
                    <p>{language === 'zh-tw' ? "按鈕彈出視窗佈局" : "Button popup Layout"}</p>
                    <button className="popup-button" onClick={() => setPopupTitle("Button Popup Code")}>
                        {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                    </button>
                </div>

                <h1>{language === 'zh-tw' ? "反饋資訊" : "Feedback Information"}</h1>
                <div className="feedbackinfocontain">
                    <p>{language === 'zh-tw' ? "可點擊物件使用指標游標" : "Clickable objects use pointer cursor"}</p>
                    <button className="popup-button" onClick={() => setPopupTitle("Pointer Cursor Code")}>
                        {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                    </button>
                    <p>{language === 'zh-tw' ? "可點擊物件在懸停時會變暗" : "Clickable objects darken on hover"}</p>
                    <button className="popup-button" onClick={() => setPopupTitle("Brightness Filter Code")}>
                        {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                    </button>
                    <p>{language === 'zh-tw' ? "輸入錯誤時顯示紅色警告文字" : "Red warning for incorrect input"}</p>
                    <button className="popup-button" onClick={() => setPopupTitle("Red Warning Text Code")}>
                        {language === 'zh-tw' ? "顯示程式碼" : "Show Code"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Styleguide;
