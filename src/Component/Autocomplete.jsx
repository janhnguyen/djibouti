import React, { useState,useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styles/friends.css"
import LanguageContext from "../context/LanguageContext";


const Autocomplete = ({ suggestions, selectAutocomplete }) => {
  const { language, setLanguage } = useContext(LanguageContext);

  const navigate = useNavigate(); // Hook for navigation

  // the active selection's index
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  // the suggestions that match the user's input
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  // whether or not the suggestion list is shown
  const [showSuggestions, setShowSuggestions] = useState(false);
  // input from the user
  const [userInput, setUserInput] = useState("");

  // Event fired when the input value is changed
  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    let filteredSuggestions = suggestions;

    // Filter suggestions that contain the user's input
    if (suggestions) {
      filteredSuggestions = suggestions.filter((suggestion) => {
        const username = suggestion.attributes?.Username; // Safe access
        return (
          typeof username.username === "string" && // Ensure it's a string
          username.username.toLowerCase().includes(userInput.toLowerCase()) // Use .includes() instead of .indexOf()
        );
      });
    }

    // Update the state with the filtered suggestions and user input
    setActiveSuggestion(0);
    setFilteredSuggestions(Array.isArray(filteredSuggestions) ? filteredSuggestions : []);
    setShowSuggestions(true);
    setUserInput(userInput);
  };

  const handleSubmit = () => {
    if (userInput.trim() !== "") {
      navigate(`/profile/${userInput}`); // Navigate to the user profile
    }
  };

  // Event fired when the user clicks on a suggestion
  const onClick = (e) => {
    // Update the user input and reset the rest of the state
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);
    let selectedId = e.currentTarget.id;
    selectAutocomplete(selectedId);
    console.log("Friend selected is " + selectedId);
  };

  // Event fired when the user presses a key down
  const onKeyDown = (e) => {
    // User pressed the enter key, update the input and close the suggestions
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion]);
    }
    // User pressed the arrow up key, so decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the arrow down key, so increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  let suggestionsListComponent = null;

  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <div className="autocompletelist">
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className =
                index === activeSuggestion ? "suggestion-active" : "";
              return (
                <li
                  className={className}
                  key={suggestion.id}
                  id={suggestion.id}
                  onClick={onClick}
                >
                  {suggestion.attributes?.Username.username}
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      suggestionsListComponent = (
        <div className="autocomplete">
        <em>{language === "zh-tw" ? "沒有建議，你得自己來了！" : "No suggestions, you're on your own!"}</em>
        </div>
      );
    }
  } else {
    suggestionsListComponent = <div className="autocomplete" />;
  }

  return (
    <div className="auto-sm">
      <div>
        <div className="topsearch">
          <input
            type="text"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
            placeholder={language === "zh-tw" ? "搜尋帳號或聊天..." : "Search for people or chats..."}
            />
          <div className="sm-b">
          <button onClick={handleSubmit}>{language === "zh-tw" ? "提交" : "Submit"}</button>
          </div>
        </div>
        <div className="suggestList">
          {suggestionsListComponent}
        </div>
      </div>
    </div>
  );
};

export default Autocomplete;

// PropTypes is a mechanism in React for validating the properties (props) passed to a component.
// Here, Autocomplete component's PropTypes are defined to specify the expected data types for its props.
// 'suggestions' prop is expected to be an instance of an Array.
Autocomplete.propTypes = {
  suggestions: PropTypes.instanceOf(Array)
};

// defaultProps is used to specify default values for props in case they are not provided when using the component.
// If 'suggestions' prop is not provided, it defaults to an empty array.
Autocomplete.defaultProps = {
  suggestions: [],
};