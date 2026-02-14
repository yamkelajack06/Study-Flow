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

import { useState, useRef, useContext, useLayoutEffect } from "react";
import { Sparkles } from "lucide-react";
import styles from "../styles/ai.module.css";
import timetableStyles from "../styles/timetable.module.css";
import GeminiAI from "../services/geminiAI";
import { EntryContext } from "../pages/Main/HomePage";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userChatHistory, setChatHistory] = useState([]); //For tracking user chat history
  const [isChatting, setIsChatting] = useState(false); //For handling the chat window UI;
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null); //For clearing the textarea
  const chatContainerRef = useRef(null); // for auto scroll to latest message
  const {
    entries,
    addEntries,
    deleteEntries,
    updateEntries,
    addMultipleEntries,
    deleteMultipleEntries,
  } = useContext(EntryContext);

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [userChatHistory]); // Trigger when messages change

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSuccess = (AIResponse) => {
    let message;
    let success;

    switch (AIResponse.action) {
      case "add": {
        success = addEntries(AIResponse);
        if (success) {
          // Format message based on entry type
          if (AIResponse.type === "once") {
            const dateObj = new Date(AIResponse.date);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            });
            message = `**${AIResponse.subject}** has been added successfully for ${formattedDate} from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
          } else {
            // Recurring entry
            const recurrenceText = {
              weekly: "every week",
              biweekly: "every 2 weeks",
              monthly: "every month"
            }[AIResponse.recurrence] || "weekly";
            
            message = `**${AIResponse.subject}** has been added successfully for ${AIResponse.day}s (${recurrenceText}) from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
          }
        } else {
          message = `Failed to add **${AIResponse.subject}**. There may be a time conflict.`;
        }
        return message;
      }

      case "add_multiple": {
        const addResults = addMultipleEntries(AIResponse.entries);

        if (addResults.successful.length === 0) {
          message = `Failed to add any entries. All had conflicts:\n\n`;
          addResults.failed.forEach((fail) => {
            message += `- **${fail.entry.subject}**: ${fail.reason}\n`;
          });
        } else if (addResults.failed.length === 0) {
          message = `Successfully added all ${addResults.successful.length} entries:\n\n`;
          addResults.successful.forEach((entry) => {
            if (entry.type === "once") {
              const dateObj = new Date(entry.date);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              });
              message += `- **${entry.subject}** - ${formattedDate} (${entry.startTime} - ${entry.endTime})\n`;
            } else {
              message += `- **${entry.subject}** - ${entry.day} (${entry.startTime} - ${entry.endTime})\n`;
            }
          });
        } else {
          message = `Added ${addResults.successful.length} of ${AIResponse.entries.length} entries:\n\n`;
          message += `**Successful:**\n`;
          addResults.successful.forEach((entry) => {
            if (entry.type === "once") {
              const dateObj = new Date(entry.date);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              });
              message += `- **${entry.subject}** - ${formattedDate} (${entry.startTime} - ${entry.endTime})\n`;
            } else {
              message += `- **${entry.subject}** - ${entry.day} (${entry.startTime} - ${entry.endTime})\n`;
            }
          });
          message += `\n**Failed:**\n`;
          addResults.failed.forEach((fail) => {
            message += `- **${fail.entry.subject}**: ${fail.reason}\n`;
          });
        }
        return message;
      }

      case "delete": {
        success = deleteEntries(AIResponse);
        if (success) {
          message = `**${AIResponse.subject}** has been deleted successfully.`;
        } else {
          message = `Deletion was cancelled.`;
        }
        return message;
      }

      case "delete_multiple": {
        const deleteResults = deleteMultipleEntries(AIResponse.entries);

        if (deleteResults.deletedCount === deleteResults.requestedCount) {
          message = `Successfully deleted ${deleteResults.deletedCount} entries.`;
        } else if (deleteResults.deletedCount === 0) {
          message = `No entries were deleted. Could not find the specified entries.`;
        } else {
          message = `Deleted ${deleteResults.deletedCount} of ${deleteResults.requestedCount} requested entries.`;
        }
        return message;
      }

      case "update": {
        success = updateEntries(AIResponse);
        if (success) {
          if (AIResponse.type === "once") {
            const dateObj = new Date(AIResponse.date);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric"
            });
            message = `Entry has been updated successfully to: **${AIResponse.subject}** on ${formattedDate} from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
          } else {
            message = `Entry has been updated successfully to: **${AIResponse.subject}** on ${AIResponse.day} from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
          }
        } else {
          message = `Failed to update entry. There may be a time conflict with the new schedule.`;
        }
        return message;
      }

      default:
        return "Action completed.";
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
          <div className={styles["chat-messages"]} ref={chatContainerRef}>
            {!isChatting && (
              <div className={styles["empty-state"]}>
                <h4 className={styles["empty-title"]}>
                  Hi! I'm your study assistant
                </h4>
                <p className={styles["empty-text"]}>
                  Try asking me to add an entry or check your schedule.
                </p>

                <div className={styles["suggestions"]}>
                  <button>Add exam on March 5th</button>
                  <button>Add recurring class</button>
                  <button>Show my schedule</button>
                  <button>Delete an entry</button>
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
            <ReactMarkdown key={i} rehypePlugins={[rehypeHighlight]}>
              {part.text}
            </ReactMarkdown>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AIAssistant;