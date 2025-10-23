/**
 * AI Assistant Chat Component
 *
 * This component will render:
 * - Chat interface for AI interactions
 * - Voice input button and handling
 * - AI response display with formatting
 * - Quick action buttons for common tasks
 * - AI-generated entry previews
 * - Loading states and error handling
 * - Chat history and conversation management
 */

import { useState, useRef, useContext } from "react";
import { Sparkles } from "lucide-react";
import styles from "../styles/ai.module.css";
import timetableStyles from "../styles/timetable.module.css";
import GeminiAI from "../services/geminiAI";
import { EntryContext } from "../pages/Main/HomePage";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userChatHistory, setChatHistory] = useState([]); //For tracking user chat history
  const [isChatting, setIsChatting] = useState(false); //For handling the chat window UI;
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null); //For clearing the textarea
  const { entries, addEntries, deleteEntries, updateEntries } = useContext(EntryContext);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  function isJSON(str) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === "object" && parsed !== null;
    } catch (e) {
      return false;
    }
  }

  const handleSuccess = (AIResponse) => {
    let message;
    switch (AIResponse.action) {
      case "add":
        message = `${AIResponse.subject} has been added successfully`;
        addEntries(AIResponse);
        return message;
      case "delete":
        message = `${AIResponse.subject} has been deleted successfully`;
        deleteEntries(AIResponse);
        return message;
      case "update":
        message = `Entry has been updated successfully`;
        updateEntries(AIResponse);
        return message;
    }
  };
  const handleSubmit = async (e) => {
    setIsChatting(true);
    setIsLoading(true);
    e.preventDefault();
    //Push the latest prompt to history before passing it to the AI
    const currentInput = userInput.trim();
    const userMessage = {
      role: "user",
      parts: [{ text: currentInput }],
    };

    const historyForAPI = [...userChatHistory, userMessage];

    setChatHistory(historyForAPI);
    const response = await GeminiAI(historyForAPI, entries);
    console.log("AI Response:", response);
    if (!response.error) {
      const successMessage = handleSuccess(response);
      const aiMessage = {
        role: "model",
        parts: [{ text: successMessage }],
      };

      setChatHistory((prevHistory) => [...prevHistory, aiMessage]);
    } else {
      // Handle error display
      const errorMessage = {
        role: "model",
        parts: [{ text: `${response.message}` }],
      };
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
    }

    setIsLoading(false);
    if (inputRef.current) inputRef.current.value = ""; //Clear the text area
    setUserInput("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles["ai-assistant"]}>
      <button
        className={timetableStyles["chat-button"]}
        onClick={toggleChat}
        aria-label="Toggle AI Assistant"
      >
        <Sparkles size={28} strokeWidth={2.5} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles["chat-window"]}>
          {/* Header */}
          <div className={styles["chat-header"]}>
            <div className={styles["chat-header-info"]}>
              <div>
                <h3 className={styles["chat-title"]}>Study Assistant</h3>
                <p className={styles["chat-subtitle"]}>
                  Ask me to manage your timetable
                </p>
              </div>
            </div>
            <div className={styles["chat-header-actions"]}>
              <button
                className={styles["chat-header-btn"]}
                onClick={toggleChat}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={styles["chat-messages"]}>
            {!isChatting && (
              <div className={styles["empty-state"]}>
                <span className={styles["sparkle-large"]}>✨</span>
                <h4 className={styles["empty-title"]}>
                  Hi! I'm your study assistant
                </h4>
                <p className={styles["empty-text"]}>
                  Try asking me to add an entry or check your schedule.
                </p>

                <div className={styles["suggestions"]}>
                  <button>Add new entry</button>
                  <button>Show my schedule</button>
                  <button>What's on Monday?</button>
                  <button>Delete an entry?</button>
                </div>
              </div>
            )}{" "}
            {isChatting && (
              <div className={styles["conversation"]}>
                <ChatMessages messages={userChatHistory} />
                {isLoading && (
                  <div className={styles["loading-dots"]}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <form className={styles["chat-input-area"]} onSubmit={handleSubmit}>
            <textarea
              placeholder="Ask me anything about your timetable..."
              className={styles["chat-input"]}
              onChange={handleInputChange}
              value={userInput}
            ></textarea>
            <button type="submit" className={styles["send-button"]}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const ChatMessages = ({ messages }) => {
  return (
    <div className={styles["chat-message-container"]}>
      {messages.map(({ role, parts }, index) => (
        <div
          key={index}
          className={`${styles["chat-message"]} ${
            role === "model" ? styles["ai-message"] : styles["user-message"]
          }`}
        >
          <strong>{role === "model" ? "AI" : "User"}: </strong>
          {parts.map((part, i) => (
            <span key={i}>{part.text}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AIAssistant;
