import React, { useEffect, useState, useContext } from "react";
import { json, Link, useNavigate } from "react-router-dom";
import blankphoto from "../assets/emptyphoto.jpg"
import dropdown from "../assets/dropdown.png"
import dropdownup from "../assets/dropwdownup.webp"
import settings from "../assets/settings.svg"
import person from "../assets/personlogo.png"
import friend from "../assets/friendslogo.png"
import faq from "../assets/help.svg"
import logout from "../assets/logout.png"
import '../styles/Settings.css'
import LanguageContext from "../context/LanguageContext";

function Settings() {
    const { language, setLanguage } = useContext(LanguageContext);
    const navigate = useNavigate();
    const userToken = sessionStorage.getItem("token");

    useEffect(() => {
        if (!userToken) {
            navigate("/login");
        }
    }, [userToken, navigate]);

    const [name, setName] = useState(localStorage.getItem("name") || "Name");
    const [rightPlace, setRight] = useState(0);
    const [email, setEmail] = useState(localStorage.getItem('email') || 'email@email.com');
    const [birthday, setBirthday] = useState(localStorage.getItem("birthday") || "1990-01-01");
    const [phone, setPhone] = useState(localStorage.getItem("phone") || "123-456-7890");
    const [errorMessage, setErrorMessage] = useState("");
    const storedProfilePicture = localStorage.getItem("profilePicture");
    const [profilePicture, setProfilePicture] = useState(storedProfilePicture ? storedProfilePicture : blankphoto);
    const [imageid, setimageid] = useState("");
    const userID = sessionStorage.getItem("user");
    const [fileerror, setfileerror] = useState(false);
    const [deletepopup, setdeletepopup] = useState(false);
    const [savedchanges, setsavechanges] = useState(false);
    const [BlockedList, setBlockedList] = useState([]);
    const [faq1drop, setfaq1drop] = useState(false);
    const [faq2drop, setfaq2drop] = useState(false);
    const [faq3drop, setfaq3drop] = useState(false);
    const [faq4drop, setfaq4drop] = useState(false);

    const [errorchanged, seterrorchange] = useState(false);
    const [errormess, seterrormess] = useState(false);


    const [whichClicked, setWhichClicked] = useState(1);

    useEffect(() => {
        const fetchUsername = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_PATH}/users/${userID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            const userInfo = await response.json();
            // console.log(userInfo.attributes.Username.username);
            if (userInfo.attributes?.ProfileImageID?.imageid) {
                setimageid(userInfo.attributes?.ProfileImageID?.imageid);
            }
            setEmail(userInfo.email)
            if (!userInfo.attributes?.Username?.username) {
                setName("user")
            } else {
                if (name != userInfo.attributes?.Username?.username) {
                    localStorage.setItem("name", userInfo.attributes?.Username?.username);
                }
                setName(userInfo.attributes?.Username?.username);
            }
            updateprofileimage(userInfo.attributes?.ProfileImageID?.imageid)
        }
        fetchUsername();
    }, []);


    const loadBlockedList = async () => {
        try {
            const [toUserRes, fromUserRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_PATH}/connections?toUserID=${userID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                }),
                fetch(`${process.env.REACT_APP_API_PATH}/connections?fromUserID=${userID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                }),
            ]);

            const toUserData = await toUserRes.json();
            const fromUserData = await fromUserRes.json();

            if (!Array.isArray(toUserData) || !Array.isArray(fromUserData)) {
                console.error("Unexpected API response:", { toUserData, fromUserData });
                return;
            }

            // Flatten and filter the results
            const blockedToUser = toUserData.flat().filter(
                conn => conn?.attributes?.status === "blocked"
            );
            const blockedFromUser = fromUserData.flat().filter(
                conn => conn?.attributes?.status === "blocked"
            );

            // Combine both lists
            const combinedBlockedList = [...blockedToUser, ...blockedFromUser];

            console.log("Updated blocked list:", combinedBlockedList);
            setBlockedList(combinedBlockedList);
        } catch (error) {
            console.error("❌ Error fetching blocked users:", error);
        }
    };

    useEffect(() => {
        loadBlockedList();
        console.log("Blocked List:", BlockedList);
    }, []);


    const handleUnblock = async (connectionID) => {
        try {
            await fetch(`${process.env.REACT_APP_API_PATH}/connections/${connectionID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
            });
            // Refresh the list after successful unblock
            loadBlockedList();
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };



    const handleSaveChanges = async () => {
        const cleanedPhone = phone.replace(/\D/g, ""); // remove non numbers from phone numnber
        if (cleanedPhone.length !== 10) {
            seterrorchange(true)
            seterrormess(
                language === "zh-tw"
                    ? "電話號碼必須正好是 10 位數。"
                    : "Phone number must be exactly 10 digits."
            );
            return;
        }
        const isNameTaken = await checkUserName(name);
        if (isNameTaken) {
            console.log("name failed")
            seterrorchange(true)
            seterrormess(
                language === "zh-tw"
                    ? "名稱已被使用"
                    : "Name is already taken"
            );
            return;
        }
        seterrorchange(false)
        updatenameandiamge(imageid, name);
        localStorage.setItem("name", name);
        localStorage.setItem("birthday", birthday);
        localStorage.setItem("phone", phone);
        setsavechanges(true)
        setTimeout(() => {
            setsavechanges(false)
        }, 2500)

    };

    const handleSignOut = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };


    const updateprofileimage = (imageID) => {
        if (!imageID) {
            console.log("no profile image " + imageID);
            setProfilePicture(blankphoto);
            return;
        }
        fetch(process.env.REACT_APP_API_PATH + "/file-uploads/" + imageID, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        }).then((res) => res.json())
            .then((result) => {
                setProfilePicture("https://webdev.cse.buffalo.edu" + result.path);
            })
            .catch((error) => console.error("Error updating image:", error));
    }

    const updatenameandiamge = (imageID, name) => {
        fetch(`${process.env.REACT_APP_API_PATH}/users/${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((result) => {
                let currUserAttributes = result?.attributes || {};
                currUserAttributes.Username = { "username": name };
                currUserAttributes.ProfileImageID = { "imageid": imageID };
                console.log("Updated attributes:", currUserAttributes);
                return fetch(`${process.env.REACT_APP_API_PATH}/users/${userID}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ attributes: currUserAttributes }),
                });
            })
            .then((res) => res.json())
            .then((result) => {
                console.log("User attributes updated successfully:", result);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            })
            .then(() => {
            });
    }

    const uploadimage = (image) => {
        //image.target.files[0]
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(image.target.files[0].type)) {
            console.log("invalid file type")
            setfileerror(true);
        }
        else {
            setfileerror(false);
        }
        const form = new FormData();
        form.append("uploaderID", userID);
        form.append("attributes", JSON.stringify({}));
        form.append("file", image.target.files[0]);
        fetch(process.env.REACT_APP_API_PATH + "/file-uploads/", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: form,
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result); // Debugging
                console.log("Image id is: " + result.id)
                console.log("Image path is: " + result.path);

                setProfilePicture("https://webdev.cse.buffalo.edu" + result.path);
                setimageid(result.id)

            })
            .catch((error) => console.error("Error uploading image:", error));
    }

    const checkUserName = async (username) => {
        const response = await fetch(process.env.REACT_APP_API_PATH + "/users/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        });
        const result = await response.json();

        if (result && result[0]) {
            const isTaken = result[0].some((element) => {
                const fetchedUsername = element.attributes?.Username?.username?.trim();
                return (fetchedUsername === username.trim()) && (element.id != userID);
            });

            return isTaken; // true = taken, false = available
        }

        return false;
    }

    const deleteaccount = () => {
        fetch(process.env.REACT_APP_API_PATH + "/users/" + userID + "?relatedObjectsAction=delete", {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then(() => {
                console.log("account deleted");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                navigate("/");
            })
            .catch((error) => console.error("Error Deleting Account:", error));
    };

    return (
        <div className='settingsLayout'>
            <div className='leftSetting'>
                <div className="settingsicon">
                    <img src={settings} alt="sicon" id="settings"></img>
                    {language === "zh-tw" ? "設定" : "Settings"}
                </div>
                <div className="tabsrow">
                    <div className={whichClicked == 1 ? "tabClicked" : "tab"} onClick={() => {
                        setWhichClicked(1)
                    }}>
                        <img src={person} alt="sicon" id="settings" style={{ width: '25px' }}></img>
                        {language === "zh-tw" ? "帳戶" : "Account"}
                    </div>
                    {/*
                    <div className={whichClicked == 2 ? "tabClicked" : "tab"} onClick={() => {
                        setWhichClicked(2)
                    }}>
                        <img src={friend} alt="sicon" id="settings" className="friendicon"></img>
                        Friends
                    </div>
                    */}
                    <div className={whichClicked == 2 ? "tabClicked" : "tab"} onClick={() => {
                        setWhichClicked(2)
                    }}>
                        <img src={faq} alt="sicon" id="settings" className="icon"></img>
                        {language === "zh-tw" ? "常見問題" : "FAQ"}
                    </div>
                </div>
                <div className="signoutdiv" onClick={handleSignOut}>
                    <img src={logout}></img>
                    <h3>{language === "zh-tw" ? "登出" : "Sign Out"}</h3>
                </div>
            </div>
            {(whichClicked == 1) && (
                <div className="rightSetting">
                    <div className="head" style={{ fontSize: '24px' }}>
                        <img src={person} alt="sicon" id="settings"></img>
                        {language === "zh-tw" ? "我的帳戶" : "My Account"}
                    </div>
                    <div className="informationblock">
                        <div className="infoblock">
                            <img src={profilePicture ? profilePicture : blankphoto} alt="sicon" id="settings"></img>
                            <label htmlFor="photoinput" className="photolab">{language === "zh-tw" ? "上傳圖片" : "Upload Image"}</label>
                            <input
                                className="photoinput"
                                id="photoinput"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => uploadimage(e)}
                            />
                        </div>
                        <div className="nameblock">
                            <h1>{name ? name : (language === "zh-tw" ? "使用者" : "user")}</h1>
                            <h2>{email ? email : (language === "zh-tw" ? "電子郵件" : "email@email.com")}</h2>
                        </div>
                        <Link to={`/profile/${name}`} className="view" >{language === "zh-tw" ? "查看個人資料" : "View Profile"}</Link>
                        <div className="photoinfo">{language === "zh-tw" ? "* 必須選擇 PNG、JPG 或 JPEG 檔案" : "* Must select PNG, JPG or JPEG file"}</div>
                    </div>
                    <div className="settingsform">
                        <div className='infoField' >
                            <label htmlFor="nameinput" style={{ fontSize: '18px' }}>
                                {language === "zh-tw" ? "姓名：" : "Name:"}
                            </label>

                            {name && name.length === 0 && (
                                <div className="errormessage">
                                    {language === "zh-tw" ? "*姓名不能為空" : "*Name cannot be nothing"}
                                </div>
                            )}

                            {name && name.length === 15 && (
                                <div className="errormessage">
                                    {language === "zh-tw" ? "*最多只能輸入15個字元" : "*Max character length is 15"}
                                </div>
                            )}

                            <input
                                className='defualtinput'
                                type="text"
                                value={name}
                                id="nameinput"
                                maxLength={15}
                                style={{
                                    borderColor: name && name.length === 0 ? 'red' : 'black',
                                    borderColor: name && name.length === 15 ? 'red' : 'black',
                                }}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </div>
                        <div className='infoField' >
                            <label htmlFor="dateinput" style={{ fontSize: '18px' }}>
                                {language === "zh-tw" ? "出生日期：" : "Date of Birth:"}
                            </label>
                            <input
                                className='brithdayinput'
                                id="dateinput"
                                type="date"
                                value={birthday}
                                onChange={(e) => {
                                    setBirthday(e.target.value);
                                }
                                }
                            />
                        </div>
                        <div className='infoField' >
                            <label htmlFor="phoneinput" style={{ fontSize: '18px' }}>
                                {language === "zh-tw" ? "電話號碼：" : "Phone Number:"}
                            </label>
                            <input
                                className='brithdayinput'
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="infoField">
                            <label htmlFor="phoneinput" style={{ fontSize: '18px' }}>
                                {language === "zh-tw" ? "被阻止：" : "Blocked Users:"}
                            </label>
                            <div className="blockedusers">
                                {BlockedList.length === 0 ? (
                                    <p>{language === "zh-tw" ? "目前沒有封鎖的使用者" : "Currently no blocked users"}</p>
                                ) : (
                                    <ul className="blocked-user-list">
                                        {BlockedList.map((user, index) => (
                                            <li key={index} className="blocked-user-item">
                                                <span className="blocked-username">
                                                    {user?.fromUser?.attributes?.Username?.username || (language === "zh-tw" ? "未知使用者" : "Unknown User")}
                                                </span>
                                                <button
                                                    className="unblock-button"
                                                    onClick={() => handleUnblock(user.id)}
                                                >
                                                    {language === "zh-tw" ? "解除封鎖" : "Unblock"}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>
                        {savedchanges && (
                            <div className="savedpopup">
                                {language === "zh-tw" ? "變更已儲存！" : "Changes Saved!"}
                            </div>
                        )}

                        {errorchanged && (<div className="errorchanged">{errormess}</div>)}
                        <div className="buttoncontainer" style={{ marginTop: '50px' }}>
                            <button
                                className="savebutton"
                                type="button"
                                onClick={() => {
                                    handleSaveChanges()
                                }
                                }
                            >
                                {language === "zh-tw" ? "儲存變更" : "Save Changes"}
                            </button>
                            <button
                                className="deletebuttoninit"
                                type="button"
                                onClick={() => {
                                    if (!deletepopup) {
                                        setdeletepopup(true)
                                    }
                                    else {
                                        setdeletepopup(false)
                                    }
                                }}
                            >
                                {language === "zh-tw" ? "刪除帳戶" : "Delete Account"}
                            </button>
                        </div>
                        {deletepopup && (<div className="deletepopup">
                            <b>{language === "zh-tw" ? "您確定要刪除嗎？" : "Are you sure you want to delete?"}</b>
                            <div className="buttonsgroup">
                                <button
                                    className="deletebutton"
                                    type="button"
                                    onClick={deleteaccount}
                                >
                                    {language === "zh-tw" ? "刪除帳戶" : "Delete Account"}
                                </button>
                                <button
                                    className="cancelbutton"
                                    type="button"
                                    onClick={() => {
                                        setdeletepopup(false)
                                    }}
                                >
                                    {language === "zh-tw" ? "取消" : "Cancel"}
                                </button>
                            </div>
                        </div>)}
                    </div>
                </div>
            )}
            {(whichClicked == 2) && (
                <div className="rightSetting">
                    <div className="headfaq">
                        <img src={faq} alt="sicon" id="settings"></img>
                        {language === "zh-tw" ? "常見問題" : "FAQ"}
                    </div>
                    <div className="faqcontain">
                        <div className="faq">
                            <div className="faqtop" onClick={() => {
                                if (!faq1drop) {
                                    setfaq1drop(true)
                                }
                                else {
                                    setfaq1drop(false)
                                }
                            }}>
                                <label>{language === "zh-tw" ? "我該如何刪除貼文？" : "How Do I Delete a Post"}</label>
                                {!faq1drop && (<img src={dropdownup}></img>)}
                                {faq1drop && (<img src={dropdown}></img>)}
                            </div>
                            {faq1drop && (
                                <div className="faqdrop">
                                    <p>
                                        {language === "zh-tw"
                                            ? "您可以透過前往所需貼文，點擊右上角的三個點，然後點擊刪除貼文按鈕來刪除貼文。"
                                            : "You can delete a post by first going to the desired post, then clicking on the three dots in the top right corner. Then you can click the delete post button and the post is deleted."}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="faq">
                            <div className="faqtop" onClick={() => {
                                if (!faq2drop) {
                                    setfaq2drop(true)
                                }
                                else {
                                    setfaq2drop(false)
                                }
                            }}>
                                <label>
                                    {language === "zh-tw" ? "我如何為貼文加上標籤？" : "How Can I Tag A Post?"}
                                </label>

                                {!faq2drop && (<img src={dropdownup}></img>)}
                                {faq2drop && (<img src={dropdown}></img>)}
                            </div>
                            {faq2drop && (
                                <div className="faqdrop">
                                    <p>
                                        {language === "zh-tw"
                                            ? "您可以透過點擊貼文並尋找井字號圖示來為貼文加上標籤，然後會打開一個文字框讓您輸入標籤"
                                            : "You can add tags to posts by clicking on your post and looking for the hashtag icon, then a textbox will open allowing you to type in your tags"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="faq">
                            <div className="faqtop" onClick={() => {
                                if (!faq3drop) {
                                    setfaq3drop(true)
                                }
                                else {
                                    setfaq3drop(false)
                                }
                            }}>
                                <label>
                                    {language === "zh-tw"
                                        ? "我如何查看我的通知？"
                                        : "How Can I See My Notifications?"}
                                </label>
                                {!faq3drop && (<img src={dropdownup}></img>)}
                                {faq3drop && (<img src={dropdown}></img>)}
                            </div>
                            {faq3drop && (
                                <div className="faqdrop">
                                    <p>
                                        {language === "zh-tw"
                                            ? "您可以查看標頭中的鈴鐺來查看當前通知，如果它是紅色的，則表示您有新的通知。"
                                            : "You can view your current notifications by looking at the bell in the header, and if it is red you have a new notification to see."}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="faq">
                            <div className="faqtop" onClick={() => {
                                if (!faq4drop) {
                                    setfaq4drop(true)
                                }
                                else {
                                    setfaq4drop(false)
                                }
                            }}>
                                <label>
                                    {language === "zh-tw" ? "我該如何建立活動？" : "How do I create an event?"}
                                </label>
                                {!faq4drop && (<img src={dropdownup}></img>)}
                                {faq4drop && (<img src={dropdown}></img>)}
                            </div>
                            {faq4drop && (
                                <div className="faqdrop">
                                    <p>
                                        {language === "zh-tw"
                                            ? "您可以點擊標頭欄中的「建立活動」按鈕，或導航到主頁並選擇其中一個顯示的城市，來跳轉到建立活動的表單。"
                                            : "You can be directed to a form to create an event by either clicking on the 'Create Event' button in the header bar or by navigating to the home page and selecting one of the cities displayed."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}
            <div className='bottomsetting'>
                <div className="tabsrow">
                    <div className={whichClicked == 1 ? "tabClickedb" : "tabb"} onClick={() => {
                        setWhichClicked(1)
                    }}>
                        <img src={person} alt="sicon" id="settings" style={{ width: '25px' }}></img>
                        {language === "zh-tw" ? "帳戶" : "Account"}
                    </div>
                    {/*
                    <div className={whichClicked == 2 ? "tabClicked" : "tab"} onClick={() => {
                        setWhichClicked(2)
                    }}>
                        <img src={friend} alt="sicon" id="settings" className="friendicon"></img>
                        Friends
                    </div>
                    */}
                    <div className={whichClicked == 2 ? "tabClickedb" : "tabb"} onClick={() => {
                        setWhichClicked(2)
                    }}>
                        <img src={faq} alt="sicon" id="settings" className="icon"></img>
                        {language === "zh-tw" ? "常見問題" : "FAQ"}
                    </div>
                    <div className="signoutdivb" onClick={handleSignOut}>
                        <img src={logout}></img>
                        <h3>{language === "zh-tw" ? "登出" : "Sign Out"}</h3>
                    </div>
                </div>

            </div>
        </div>
    );
}




export default Settings;