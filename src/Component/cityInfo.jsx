import React, { useEffect, useState } from "react";
import '../styles/activitiesPage.css'
import Activities from "./Activities";
import { Link } from "react-router-dom";
import friendLogo from "../assets/friends.png";
import basePic from "../assets/baseProfilePic.png";
import buffaloBanner from "../assets/buffalo.jpg";
import charlotteBanner from "../assets/charlotte.jpg";
import sanDiegoBanner from "../assets/sanDiego.jpg";
import phoenixBanner from "../assets/phoenix.jpg";
import miamiBanner from "../assets/miami.jpg";
import nycBanner from "../assets/nyc.jpg";
import seattleBanner from "../assets/seattle.jpg";
import houstonBanner from "../assets/houston.jpg";
import philadelphiaBanner from "../assets/philadelphia.jpg";
import chicagoBanner from "../assets/chicago.jpg";


const CityInfo = () => {
    const [userToken, setUserToken] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect mobile view
    const [username, setUsername] = useState("")
    const [userCity, setUserCity] = useState(null)
    const [name, setName] = useState(localStorage.getItem("name") || "Name");
    const [cityUsers, setCityUsers] = useState([]);
    const cityBanners = {
        'Buffalo': buffaloBanner,
        'Charlotte': charlotteBanner,
        'San Diego': sanDiegoBanner,
        'Phoenix': phoenixBanner,
        'Miami': miamiBanner,
        'New York': nycBanner,
        'Seattle': seattleBanner,
        'Houston': houstonBanner,
        'Philadelphia': philadelphiaBanner,
        'Chicago': chicagoBanner,
    };

    const cityData = {
        'New York': {
            activity: 'Broadway Shows\nCentral Park\nMuseums\nLive Music and Comedy\nQueens Night Market',
            restaurants: "Le Bernardin\nJean-Georges\nEllen's Stardust Diner\nChinatown Delights\nUpper East Side Elegance",
            pros: 'Cultural Diversity\nEmployment Opportunities\nEntertainment Hub',
            cons: 'High Cost of Living\nNoise and Crowds\nWeather Extremes'
        },
        'Buffalo': {
            activity: 'Cultural Institutions\nHistoric Architecture\nOutdoor Festivals',
            restaurants: 'Buffalo Wings\nDiverse Dining\nFood Trails',
            pros: 'Community Spirit\nAffordable Cost of Living\nProximity to Natural Wonders',
            cons: 'Weather Challenges\nPublic Transportation Limitations\nEconomic Shifts'
        },
        'Miami': {
            activity: 'Beaches\nCultural Attractions\nNightlife\nOutdoor Activities',
            restaurants: "Joe's Stone Crab\nThe Salty Donut\nYardbird South Table & Bar",
            pros: 'Cultural Diversity\nThriving Nightlife\nBeautiful Beaches',
            cons: 'High Cost of Living\nTraffic and Congestion\nWeather Challenges'
        },
        'Seattle': {
            activity: 'Space Needle\nSeattle Great Wheel\nPike Place Market\nChihuly Garden and Glass\nSeattle Art Museum\nDiscover Park\nSeattle Center',
            restaurants: 'Canlis\nThe Pink Door\nSeabird',
            pros: 'Thriving Tech Industry\nAcces to Nature\nCultural Scene',
            cons: 'High Cost of Living\nTraffic Congestion\nEarthquake Risk'
        },
        'San Diego': {
            activity: 'Beaches\nBalboa Park\nUSS Midway Museum\nSeaport Village',
            restaurants: 'Addison\nJuniper & Ivy\nLas Cuatro Milpas\nThe Crack Shack',
            pros: 'Outdoor Lifestyle\nCultural Diversity\nThriving Craft Beer Scene',
            cons: 'High Cost of Living\nTraffic Congestion\nLimited Public Transportation'
        },
        'Houston': {
            activity: 'Museum District\nTheater District\nThe Galleria\nLive Music Venues',
            restaurants: 'Uchi Houston\nColtivare Pizza & Garden\nBlood Bros BBQ',
            pros: 'Cultural Diversity\nThriving Job Market\nWorld-Class Dining and Entertainment',
            cons: 'Traffic Congestion\nHigh Humidity and Heat\nFlooding Risks'
        },
        'Chicago': {
            activity: 'Millennium Park\nNavy Pier\nTheater and Music Venues',
            restaurants: "Alinea\nSmyth\nMoody Tongue\nDevil Dawgs\nMilly's Pizza",
            pros: 'Cultural and Recreational Opportunities\nPublic Transportation\nEmployment Opportunities',
            cons: 'High Sales Taxes\nWeather Extremes\nHigh Crime Rates'
        },
        'Philadelphia': {
            activity: 'Historical Sites\nMuseums\nTheater and Music Venues\nSouth Street',
            restaurants: "Zahav\nVedge\nSouth Philly Barbacoa\nKalaya\nLittle Walter's",
            pros: 'Rich Cultural Scene\nCulinary Diversity\nPublic Transportation',
            cons: 'Weather Extremes\nTraffic Congestion\nHigh Cost of Living'
        },
        'Phoenix': {
            activity: 'Outdoor Recreation\nCultural Venues\nMusic and Events',
            restaurants: 'Bacanora\nFry Bread House\nPizzeria Biano\nVarious Food Festivals',
            pros: 'Economic Opportunities\nSunshine and Outdoor Activities\nCultural and Entertainment Options',
            cons: 'Extreme Summer Temperatures\nTraffic and Urban Sprawl\nHigh Crime Rates'
        },
        'Charlotte': {
            activity: 'Cultural Venues\nScience and Nature Museums\nAmusement Parks',
            restaurants: 'Yunta\nCustomshop\nLeah & Louise\nSteak 48\nHeirloom Restaurant',
            pros: 'Economic Opportunities\nCultural Diversity\nPleasant Climate\nRecreational Opportunities',
            cons: 'Traffic and Transportation\nHigh Cost of Living\nUrban Sprawl'
        }
    };

    const selectedCityData = cityData[userCity] || {
        activity: 'City Not Found',
        restaurants: 'City Not Found',
        pros: 'City Not Found',
        cons: 'City Not Found'
    };

    const { activity, restaurants, pros, cons } = selectedCityData;

    useEffect(()=>{
        const fetchUsername = async () => {
            let id = sessionStorage.getItem("user");
            const response = await fetch(`${process.env.REACT_APP_API_PATH}/users/${id}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            const userInfo = await response.json();
            let username = userInfo.attributes?.Username?.username
            let userCity = userInfo.attributes?.City?.city
            setUsername(username);
            setUserCity(userCity)
            console.log("Username: " + username);
            console.log("City: " + userCity)
        }
        fetchUsername();
    }, []);

    useEffect(() => {
        setUserToken(sessionStorage.getItem("token"));
    }, []);

    useEffect(() => {
        const fetchCityUsers = async () => {
            if (!userCity) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_API_PATH}/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });
                const resp = await response.json();
                const allUsers = resp[0];
                console.log("All Users: ", allUsers);
                const filteredUsers = allUsers.filter(user =>
                    user.attributes?.City?.city === userCity
                );
                setCityUsers(filteredUsers);
                console.log("City Users: ", cityUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchCityUsers();
    }, [userCity]);

    return (
        <div>
            <div className="homepage">
                <div className="home--feed">
                    <Link to={`/activities`}>
                        <div className="activity-section">Return
                            <Activities/>
                        </div>
                    </Link>
                    {userCity && (
                        <img
                            src={cityBanners[userCity]}
                            alt={`${userCity} Banner`}
                            className="cityBanner"
                        />
                    )}
                    <div className='activityHeader'>Activities Near You
                        <div className='cityContent' style={{backgroundColor: '#d7a583', marginTop: '10px'}}>
                            <div className='contentBox'>
                                <h3>Activities</h3>
                                <div className='contentBoxContent'>
                                    {activity}
                                </div>
                            </div>
                            <div className='contentBox'>
                                <h3>Restaurants</h3>
                                <div className='contentBoxContent'>
                                    {restaurants}
                                </div>
                            </div>
                            <div className='contentBox'>
                                <h3 style={{color: 'green'}}>Pros</h3>
                                <div className='contentBoxContent'>
                                    {pros}
                                </div>
                            </div>
                            <div className='contentBox'>
                                <h3 style={{color: 'red'}}>Cons</h3>
                                <div className='contentBoxContent'>
                                    {cons}
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
                <div className="webSideBarActivitiesPage">
                    <div className="webSideBarActivitiesPageHeader"
                         style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px'}}>
                        <img src={friendLogo} className='sideNavHeaderImg'/>
                        <div className='sideNavHeaderTitle'>Members in {userCity}</div>
                    </div>

                    <div className="webSideBarActivitiesPageContent">
                        {cityUsers.length > 0 ? (
                            cityUsers.map(user => (
                                <Link to={`/profile/` + user.attributes?.Username?.username}><div key={user.id} className="sideNavItem" style={{ color: 'black'}}>
                                    <img
                                        src={basePic}
                                        alt="Profile"
                                        className="sideNavImg"
                                        style={{ borderRadius: '50%' }}
                                    />
                                    <div>
                                        <div className="homeFriendName">
                                            {user.attributes?.Username?.username || "username"}
                                        </div>

                                    </div>
                                </div></Link>
                            ))
                        ) : (
                            <div className="sideNavEmptyText">
                                {userCity ? `No members found in ${userCity}` : "Select a city to see members"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CityInfo;
