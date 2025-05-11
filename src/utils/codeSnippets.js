const codeSnippets = {
    "Header Color": "background-color: #d7a582;",
    "Button Color": "background-color: #d7a582;",
    "Body Color": "background-color: #ffffff;",
    "Delete Button Color": "background-color: #E37479;",
    "Request Button Color": "background-color: #009207;",
    "Logo Font": 'font-family: "Righteous", sans-serif; font-size: 1.8em; font-weight: lighter; text-decoration: underline;',
    "Header Font": 'font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 1.2em; font-weight: lighter;',
    "Button Font": 'font-size: .8em; font-family: Verdana, Geneva, Tahoma, sans-serif;',
    "Text Font": "font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
    "Body Font": "font-family: Arial, sans-serif;",
    
    "Home Layout Code": `
  <div className='mainContainer'>
    <div className="webHomePage">
      <div className='webFeed'>
        <div className="createPost">
          <button className="loginButton">Click Here To Log In</button>
        </div>
  
        <div className="feed">
          <p>Post feed goes here</p>
        </div>
      </div>
  
      <div className='webSideBar'>
        <input className='sideSearch' type='text' placeholder='Search for people or chats...' />
  
        <div className='sideFriends'>
          <div className='sideNavHeader'>
            <img src="/assets/friends.png" className='sideNavHeaderImg' alt="Friends" />
            <div className='sideNavHeaderTitle'>Friends</div>
          </div>
          <p>Friends list goes here</p>
        </div>
  
        <div className='sideChats'>
          <div className='sideNavHeader'>
            <img src="/assets/chatLogo.png" className='sideNavHeaderImg' alt="Chats" />
            <div className='sideNavHeaderTitle'>Chats</div>
          </div>
          <h3 style={{ fontSize: "16px" }}>Placeholder for Chats list</h3>
        </div>
  
        <div className='sideEvents'>
          <div className='sideNavHeader'>
            <div className='sideNavHeaderTitle'>Upcoming Events</div>
          </div>
  
          <div className="sideNavEventsList">
            <div className="sideEventItem">
              <div className="eventTitle" style={{ cursor: "pointer", color: "#007bff" }}>
                Example Event Title
              </div>
              <div className="eventMeta">
                <span className="eventCreator">By: Someone</span>
                <span className="eventStatus">Reserved</span>
              </div>
              <div className="eventContent" style={{ marginTop: "6px", color: "#444" }}>
                Event description or content here.
              </div>
            </div>
  
            <div className="sideNavHeaderTitle" style={{ marginTop: "10px" }}>
              Your Created Events
            </div>
  
            <div className="sideEventItem">
              <div className="eventTitle" style={{ cursor: "default", color: "#333" }}>
                Created Event Title
              </div>
              <div className="eventMeta">
                <span className="eventStatus">Status: open</span>
                <span className="eventCount">Head Count: 5</span>
              </div>
              <button
                className="btn btn-danger"
                style={{
                  marginTop: "5px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Close Event
              </button>
            </div>
          </div>
        </div>
  
        <div className='sideNotifications'>
          <div className='sideNavHeader'>
            <div className='sideNavHeaderTitle'>Notifications</div>
          </div>
          <p className="sideNavEmptyText">No Notifications...</p>
        </div>
      </div>
    </div>
  </div>
  `,
  
    "Alert Popup Code": "alert('Alert');",
  
    "Input Layout Code": `
  <h1>Login</h1>
  
  <form>
    <label>
      Email
      <input type="email" />
    </label>
    <br />
    <label>
      Password
      <input type="password" />
    </label>
    <input type="submit" className="submitbutton" value="submit" />
  </form>
  
  <div>
    <p>
      Register <a href="/register">here</a>
    </p>
  </div>
  
  <div>
    <p>
      Reset your password <a href="/reset-password">here</a>
    </p>
  </div>
  `,
  
    "Button Popup Code": `
  <div className="popup-box">
    <p>This is a popup!</p>
    <button>Close</button>
  </div>
  `,
  
    "Pointer Cursor Code": "cursor: pointer;",
    "Brightness Filter Code": "filter: brightness(90%);",
    "Red Warning Text Code": "color: red;"
  };
  
  export default codeSnippets;
  