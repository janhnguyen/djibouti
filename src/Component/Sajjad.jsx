import React, { useContext } from "react";
import sajimg from "../assets/Sajjad.JPG";
import LanguageContext from "../context/LanguageContext";

const Sajjad = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="michaels-page">
            <div className="mike-left">
                <h2>{language === "zh-tw" ? "您好！" : "Greetings!"}</h2>
                <div className="mike-paragraph">
                    <p>
                        {language === "zh-tw"
                            ? "我目前是水牛城大學資工系的大三學生。"
                            : "I am a third year undergrad studying Computer Science at the University at Buffalo."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "我的目標是運用電腦科學的技能，開發能解決現代問題的創新技術。"
                            : "My goal is to use my skills in Computer Science to develop innovative technology that will help solve modern day problems."}
                    </p>
                    <p>
                        {language === "zh-tw"
                            ? "我熟悉的程式語言包括 Python、Java、JavaScript、C 與 C++。"
                            : "My skillset includes languages such as Python, Java, JavaScript, C, and C++."}
                    </p>
                </div>
                <h4>{language === "zh-tw" ? "聯絡我" : "Contact me"}</h4>
                <section className="mike-contact-section">
                    <a href="mailto:sali22@buffalo.edu">sali22@buffalo.edu</a>
                    <a href="https://www.linkedin.com/in/sajjad-ali-22b71a291/" target="_blank" rel="noopener noreferrer">
                        {language === "zh-tw" ? "LinkedIn 連結" : "LinkedIn"}
                    </a>
                </section>
            </div>

            <div className="mike-right">
                <div>
                    <img
                        src={sajimg}
                        className="mike-pic"
                        alt="Sajjad Ali"
                    />
                </div>
                <div>
                    <h1>{language === "zh-tw" ? "Sajjad Ali" : "Sajjad Ali"}</h1>
                </div>
            </div>
        </div>
    );
};

export default Sajjad;
