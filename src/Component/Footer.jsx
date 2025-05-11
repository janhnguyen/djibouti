import "../styles/footer.css";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import LanguageContext from "../context/LanguageContext";


const Footer = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    return (
        <div className="footer">
            <Link to="/About"><p><p>{language === "zh-tw" ? "關於我們" : "About Us"}</p></p></Link>
            <Link to="/styleguide"><p>{language === "zh-tw" ? "風格指南" : "Style Guide"}</p></Link>
        </div>

    )
}

export default Footer;