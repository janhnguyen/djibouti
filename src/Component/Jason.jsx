import React, { useContext } from "react";
import jasonimg from "../assets/jason.jpg";
import { Link } from "react-router-dom";
import LanguageContext from "../context/LanguageContext";

const Jason = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="michaels-page">
            <div className="mike-left">
                <h2>{language === "zh-tw" ? "你好！" : "Hello!"}</h2>
                <div className="mike-paragraph">
                    <p>
                        {language === "zh-tw"
                            ? "我目前是水牛城大學的資工系四年級學生。"
                            : "I am a senior majoring in Computer Science at the University at Buffalo."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "我熱愛解決問題、科技，以及透過創新方案帶來實際影響。"
                            : "I’m passionate about problem-solving, technology, and making a real-world impact through innovative solutions."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "我精通多種程式語言，包括 Java、Python 和 Go。"
                            : "I’m proficient in a variety of programming languages, including Java, Python, and Go."}
                    </p>
                </div>
                <h4>{language === "zh-tw" ? "聯絡我" : "Contact me"}</h4>
                <section className="mike-contact-section">
                    <a href="mailto:nguyenjanh01@gmail.com">nguyenjanh01@gmail.com</a>
                    <a href="https://www.linkedin.com/in/jason-nguyen-360b7b275/" target="_blank" rel="noopener noreferrer">
                        {language === "zh-tw" ? "LinkedIn 連結" : "LinkedIn"}
                    </a>
                </section>
            </div>

            <div className="mike-right">
                <div>
                    <img
                        src={jasonimg}
                        className="mike-pic"
                        alt="Jason Nguyen"
                    />
                </div>
                <div>
                    <h1>{language === "zh-tw" ? "阮安豪" : "Jason Nguyen"}</h1>
                </div>
            </div>
        </div>
    );
};

export default Jason;
