import React, { useEffect, useState } from "react";
import ProfileIcon from "../assets/Sheff_G.png";


const UserInfo = () => {
    return (
        <div className="community-member">
            <input type="image" src={ProfileIcon} className="profile-pic"/>
            <div className="profile-name-container">
                <p className="comm-member-name">Sheff G</p>
                <p className="comm-member-username">@sheffg83</p>
            </div>
            <div className="comm-member-options"><button>...</button></div>
        </div>

    )
    
}


export default UserInfo;