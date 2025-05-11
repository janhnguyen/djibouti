import "../styles/citiesList.css";
import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/location.png';
import infoIcon from '../assets/info_icon.png';


const CitiesList = () => { 
    return(

        <div className="cities-list-container">
            <h3 className="cities-list-header">Select Your City :</h3>


            <ul className="cities-list-ul">

                <li className="city-list-item">
                    <Link to="/buffalo">
                        <input type="image" src={logo} className="city-select-logo" alt="Buffalo Logo" />
                        <span className="city-name">Buffalo, NY</span>
                        <Link to="/buffalo-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Buffalo Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/charlotte">
                        <input type="image" src={logo} className="city-select-logo" alt="Charlotte Logo" />
                        <span className="city-name">Charlotte, NC</span>
                        <Link to="/charlotte-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Charlotte Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/chicago">
                        <input type="image" src={logo} className="city-select-logo" alt="Chicago Logo" />
                        <span className="city-name">Chicago, IL</span>
                        <Link to="/chicago-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Chicago Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/houston">
                        <input type="image" src={logo} className="city-select-logo" alt="Houston Logo" />
                        <span className="city-name">Houston, TX</span>
                        <Link to="/houston-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Houston Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/miami">
                        <input type="image" src={logo} className="city-select-logo" alt="Miami Logo" />
                        <span className="city-name">Miami, FL</span>
                        <Link to="/miami-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Miami Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/nyc">
                        <input type="image" src={logo} className="city-select-logo" alt="New York Logo" />
                        <span className="city-name">New York, NY</span>
                        <Link to="/nyc-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="New York Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/philadelphia">
                        <input type="image" src={logo} className="city-select-logo" alt="Philadelphia Logo" />
                        <span className="city-name">Philadelphia, PA</span>
                        <Link to="/philadelphia-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Philadelphia Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/phoenix">
                        <input type="image" src={logo} className="city-select-logo" alt="Phoenix Logo" />
                        <span className="city-name">Phoenix, AZ</span>
                        <Link to="/phoenix-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Phoenix Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/seattle">
                        <input type="image" src={logo} className="city-select-logo" alt="Seattle Logo" />
                        <span className="city-name">Seattle, WA</span>
                        <Link to="/seattle-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="Seattle Info Logo" />
                        </Link>
                    </Link>
                </li>

                <li className="city-list-item">
                    <Link to="/sandiego">
                        <input type="image" src={logo} className="city-select-logo" alt="San Diego Logo" />
                        <span className="city-name">San Diego, CA</span>
                        <Link to="/sandiego-info">
                            <button className="view-city-info-btn">View Info</button>
                            <input type="image" src={infoIcon} className="view-info-logo" alt="San Diego Info Logo" />
                        </Link>
                    </Link>
                </li>


            </ul>


        </div>
        
    );
};



export default CitiesList;