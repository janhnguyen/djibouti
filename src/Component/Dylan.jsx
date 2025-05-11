import React, { useContext } from "react";
import dylanpic from "../assets/dylan.png";
import LanguageContext from "../context/LanguageContext";

const Dylan = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="michaels-page">
            <div className="mike-left">
                <h2>{language === "zh-tw" ? "哈囉，世界！" : "Hello World!"}</h2>
                <div className="mike-paragraph">
                    <p>
                        {language === "zh-tw"
                            ? "我目前是水牛城大學的資工系四年級學生。"
                            : "I am a senior at the University at Buffalo studying computer science."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "在 UB 的學習過程中，我深入了解了軟體與網頁開發，並希望在未來的職涯中善用這些技能。"
                            : "Through my time at UB I have gained tons of understanding about software and web development and hope to use that in my future career."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "課餘時間我喜歡打冰球、看體育賽事，和朋友一起放鬆。"
                            : "Outside of class I like to play hockey, watch sports and hang out with friends."}
                    </p>
                </div>
                <h4>{language === "zh-tw" ? "聯絡我" : "Contact me"}</h4>
                <section className="mike-contact-section">
                    <a href="mailto:dvasapollo30@gmail.com">dvasapollo30@gmail.com</a>
                    <a href="https://www.linkedin.com/in/dylan-vasapollo/" target="_blank" rel="noopener noreferrer">
                        {language === "zh-tw" ? "LinkedIn 連結" : "LinkedIn"}
                    </a>
                </section>
            </div>

            <div className="mike-right">
                <div>
                    <img
                        src={dylanpic}
                        className="mike-pic"
                        alt="Dylan Vasapollo"
                    />
                </div>
                <div>
                    <h1>{language === "zh-tw" ? "Dylan Vasapollo" : "Dylan Vasapollo"}</h1>
                </div>
            </div>
        </div>
    );
};

export default Dylan;
