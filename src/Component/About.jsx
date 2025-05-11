import React from "react";
import mike from "../assets/mike.jpeg";
import jason from "../assets/jason.jpg";
import sajjad from "../assets/Sajjad.JPG"
import jackson from "../assets/jackson.jpg";
import dylan from "../assets/dylan.png"
import { Link } from "react-router-dom";
import '../styles/About.css'

const About = () => {
    return (
        <>
            <div className="about">
                <h1>About Us</h1>
                <p>Hello people, we are team Djibouti!!!</p>
            </div>

            <div className="members">

                <div className="pic-name">
                    <img
                        src = {mike}
                        className="about-us-pic"
                    />
                    <Link to="/michael">
                        <button className="michael-btn">Michael</button>
                    </Link>
                </div>

                <div className="pic-name">
                    <img
                        src = {jason}
                        className="about-us-pic"
                    />
                    <Link to="/jason">
                        <button className="jason-btn">Jason</button>
                    </Link>
                </div>
                <div className="pic-name">
                    <img
                        src = {dylan}
                        className="about-us-pic"
                    />
                    <Link to="/dylan">
                        <button className="jason-btn">Dylan</button>
                    </Link>
                </div>


                <div className="pic-name">
                    <img
                        src = {sajjad}
                        className="about-us-pic"
                    />
                    <Link to="/Sajjad">
                        <button className="jason-btn">Sajjad</button>
                    </Link>
                </div>


                <div className="pic-name">
                    <img
                        src = {jackson}
                        className="about-us-pic"
                    />
                    <Link to="/jackson">
                        <button className="jackson-btn">Jackson</button>
                    </Link>
                </div>
                {/* add ur images here if u want */}

            </div>

        </>
    );
};

export default About;