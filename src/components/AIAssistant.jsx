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
  const [userChatHistory, setChatHistory] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
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
  }, [userChatHistory]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Helper to assign color based on context if AI didn't provide one
  const assignColorContext = (subject) => {
    const lower = subject.toLowerCase();
    if (
      lower.includes("exam") ||
      lower.includes("test") ||
      lower.includes("quiz") ||
      lower.includes("midterm")
    )
      return "#dc3545";
    if (
      lower.includes("study") ||
      lower.includes("revision") ||
      lower.includes("review")
    )
      return "#10b981";
    if (
      lower.includes("assignment") ||
      lower.includes("project") ||
      lower.includes("homework") ||
      lower.includes("paper")
    )
      return "#f59e0b";
    if (
      lower.includes("lab") ||
      lower.includes("workshop") ||
      lower.includes("practical")
    )
      return "#8b5cf6";
    return "#447ff8";
  };

  const handleSuccess = async (AIResponse) => {
    try {
      let message;
      let success;

      if (!AIResponse.action || AIResponse.action === "chat") {
        return AIResponse.message || "Done! Let me know if there's anything else.";
      }

      switch (AIResponse.action) {
        case "add": {
          const entryToAdd = {
            ...AIResponse,
            color: AIResponse.color || assignColorContext(AIResponse.subject),
          };
          success = await addEntries(entryToAdd);
          if (success) {
            if (AIResponse.type === "once") {
              const dateObj = new Date(AIResponse.date);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              });
              message = `**${AIResponse.subject}** has been added for ${formattedDate} from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
            } else {
              const recurrenceText =
                {
                  weekly: "every week",
                  biweekly: "every 2 weeks",
                  monthly: "every month",
                }[AIResponse.recurrence] || "every week";
              message = `**${AIResponse.subject}** has been added for ${AIResponse.day}s (${recurrenceText}) from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
            }
          } else {
            message = `Couldn't add **${AIResponse.subject}** — it looks like that slot is already taken. Want to try a different time?`;
          }
          return message;
        }

        case "add_multiple": {
          const entriesWithColors = AIResponse.entries.map((entry) => ({
            ...entry,
            color: entry.color || assignColorContext(entry.subject),
          }));

          const addResults = await addMultipleEntries(entriesWithColors);

          if (addResults.successful.length === 0) {
            message = `Couldn't add any of those — all had time conflicts with existing entries:\n\n`;
            addResults.failed.forEach((fail) => {
              message += `- **${fail.entry.subject}**: ${fail.reason}\n`;
            });
          } else if (addResults.failed.length === 0) {
            message = `Added all ${addResults.successful.length} entries successfully!\n\n`;
            addResults.successful.forEach((entry) => {
              if (entry.type === "once") {
                const dateObj = new Date(entry.date);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                message += `- **${entry.subject}** — ${formattedDate} (${entry.startTime} - ${entry.endTime})\n`;
              } else {
                message += `- **${entry.subject}** — ${entry.day} (${entry.startTime} - ${entry.endTime})\n`;
              }
            });
          } else {
            message = `Added ${addResults.successful.length} of ${AIResponse.entries.length} entries:\n\n`;
            message += `**Added:**\n`;
            addResults.successful.forEach((entry) => {
              if (entry.type === "once") {
                const dateObj = new Date(entry.date);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                message += `- **${entry.subject}** — ${formattedDate} (${entry.startTime} - ${entry.endTime})\n`;
              } else {
                message += `- **${entry.subject}** — ${entry.day} (${entry.startTime} - ${entry.endTime})\n`;
              }
            });
            message += `\n**Skipped due to conflicts:**\n`;
            addResults.failed.forEach((fail) => {
              message += `- **${fail.entry.subject}**: ${fail.reason}\n`;
            });
          }
          return message;
        }

        case "delete": {
          success = await deleteEntries(AIResponse);
          if (success) {
            message = `**${AIResponse.subject}** has been removed from your schedule.`;
          } else {
            message = `Couldn't remove **${AIResponse.subject}** — it may have already been deleted, or you cancelled.`;
          }
          return message;
        }

        case "delete_multiple": {
          // Use actual results from the operation — never trust AI-reported counts
          const deleteResults = await deleteMultipleEntries(AIResponse);

          if (deleteResults.deletedCount === 0) {
            message = `Nothing was removed — those entries may have already been deleted. Try refreshing if something looks off!`;
          } else if (deleteResults.deletedCount === deleteResults.requestedCount) {
            message = `Done! ${deleteResults.deletedCount} ${deleteResults.deletedCount === 1 ? "entry" : "entries"} removed from your schedule.`;
          } else {
            message = `Removed ${deleteResults.deletedCount} of ${deleteResults.requestedCount} entries. A few couldn't be deleted — try tapping on them directly to remove them.`;
          }
          return message;
        }

        case "update": {
          success = await updateEntries(AIResponse);
          if (success) {
            if (AIResponse.type === "once") {
              const dateObj = new Date(AIResponse.date);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              });
              message = `Updated! **${AIResponse.subject}** is now on ${formattedDate} from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
            } else {
              message = `Updated! **${AIResponse.subject}** is now on ${AIResponse.day} from ${AIResponse.startTime} to ${AIResponse.endTime}.`;
            }
          } else {
            message = `Couldn't update that entry — the new time might clash with something else in your schedule.`;
          }
          return message;
        }

        default:
          return (
            AIResponse.message ||
            "Done! Let me know if there's anything else you'd like to change."
          );
      }
    } catch (error) {
      console.error("Error in handleSuccess:", error);
      return "Something went wrong on my end — please try that again!";
    }
  };

  const handleSubmit = async (e) => {
    setIsChatting(true);
    setIsLoading(true);
    e.preventDefault();

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
      const successMessage = await handleSuccess(response);
      const aiMessage = {
        role: "model",
        parts: [{ text: successMessage }],
      };
      setChatHistory((prevHistory) => [...prevHistory, aiMessage]);
    } else {
      // error: true carries conversational AI messages (clarifying questions,
      // chat replies, or plain-English error descriptions from the AI itself)
      const aiMessage = {
        role: "model",
        parts: [
          {
            text:
              response.message ||
              "Something went wrong — please try again!",
          },
        ],
      };
      setChatHistory((prevHistory) => [...prevHistory, aiMessage]);
    }

    setIsLoading(false);
    if (inputRef.current) inputRef.current.value = "";
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
            )}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
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