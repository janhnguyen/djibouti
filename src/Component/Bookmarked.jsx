import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

const Bookmarked = () => {

    const navigate = useNavigate();
    const userToken = sessionStorage.getItem("token");

    useEffect(() => {
        if (!userToken) {
            navigate("/login");
        }
    }, [userToken, navigate]);

    return (
        <>
            <h1 style={{color: 'black', marginTop:'5%'}}>Placeholder for Bookmark Page (Coming Soon)</h1>
        </>
    );
};




export default Bookmarked;