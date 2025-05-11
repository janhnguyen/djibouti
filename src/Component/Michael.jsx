import React, { useEffect, useState, useContext } from "react";
import mike from "../assets/mike.jpeg";
import { Link } from "react-router-dom";
import LanguageContext from "../context/LanguageContext";

const Michael = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    return (
        <div className="michaels-page">
            <div className="mike-left">
                <h2>{language === "zh-tw" ? "哈囉，世界！" : "Hello World!"}</h2>
                <div className="mike-paragraph">
                    <p>{language === "zh-tw"
                        ? "我目前是水牛城大學的資工系四年級學生。"
                        : "I am a senior pursuing a degree in Computer Science at the University at Buffalo."}
                    </p>
                    <p>{language === "zh-tw"
                        ? "在 UB 所學的經驗，包括網頁應用程式、軟體工程與電腦安全，使我致力於開發具備高品質、安全性與使用性的軟體。"
                        : "With the experience I gained at UB, such as web application, software engineering and computer security, I strive for excellent software quality, security and usability."}
                    </p>
                    <p>{language === "zh-tw"
                        ? "我在課外的興趣包括籃球、滑雪與看電影。"
                        : "My interests outside of school include basketball, skiing, and movies."}
                    </p>
                </div>
                <h4>{language === "zh-tw" ? "聯絡我" : "Contact me"}</h4>
                <section className="mike-contact-section">
                    <a href="mailto:mjliao82@gmail.com">mjliao82@gmail.com</a>
                    <a href="https://www.linkedin.com/in/michael-liao-aa623323a/" target="_blank" rel="noopener noreferrer">
                        {language === "zh-tw" ? "LinkedIn 連結" : "LinkedIn"}
                    </a>
                </section>
            </div>

            <div className="mike-right">
                <div>
                    <img
                        src={mike}
                        className="mike-pic"
                        alt="Michael Liao"
                    />
                </div>
                <div>
                    <h1>{language === "zh-tw" ? "廖泰榮" : "Michael Liao"}</h1>
                </div>
            </div>
        </div>
    );
};

export default Michael;
