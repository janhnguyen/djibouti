import React, { useContext } from "react";
import jacksonimg from "../assets/jackson.jpg";
import LanguageContext from "../context/LanguageContext";

const Jackson = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="michaels-page">
            <div className="mike-left">
                <h2>{language === "zh-tw" ? "早安！" : "Good Morning!"}</h2>
                <div className="mike-paragraph">
                    <p>
                        {language === "zh-tw"
                            ? "我目前是水牛城大學資工系的大三學生。"
                            : "I am a junior pursuing a degree in Computer Science at the University at Buffalo."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "我正在深入學習全端開發、分散式系統，以及與機器人相關的程式設計。我一向追求乾淨、可靠且易於理解的程式碼。"
                            : "I'm currently learning more about full stack development and distributed systems, and programming related to robotics. I always strive for clean, reliable and understandable code."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "我目前的興趣包括3D列印、木工與金工、玩電動、看電影以及釀啤酒。"
                            : "My current hobbies are 3D printing, wood and metal working, playing video games, watching movies and beer brewing."}
                    </p>
                </div>
                <h4>{language === "zh-tw" ? "聯絡我" : "Contact me"}</h4>
                <section className="mike-contact-section">
                    <a href="mailto:jrpealer@buffalo.edu">jrpealer@buffalo.edu</a>
                    <a href="https://www.linkedin.com/in/jackson-pealer-416b99254/" target="_blank" rel="noopener noreferrer">
                        {language === "zh-tw" ? "LinkedIn 連結" : "LinkedIn"}
                    </a>
                </section>
            </div>

            <div className="mike-right">
                <div>
                    <img
                        src={jacksonimg}
                        className="mike-pic"
                        alt="Jackson Pealer"
                    />
                </div>
                <div>
                    <h1>{language === "zh-tw" ? "Jackson Pealer" : "Jackson Pealer"}</h1>
                </div>
            </div>
        </div>
    );
};

export default Jackson;
