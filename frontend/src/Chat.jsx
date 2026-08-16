import { useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import "./Chat.css";

function Chat() {
  const { messages, loading } = useContext(MyContext);
  const latestPromptRef = useRef(null);

  // शेवटच्या user message चा index
  const lastUserIndex = messages.map((m) => m.role).lastIndexOf("user");

  useEffect(() => {
    // DOM रेंडर होताच नवीन प्रॉम्प्टला स्क्रीनच्या वर आणणे
    if (latestPromptRef.current) {
      setTimeout(() => {
        latestPromptRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  }, [messages.length]);

  return (
    <div className="chat-messages-container">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <h1 className="empty-chat-hello">Hello, User</h1>
          <h1 className="empty-chat-sub">How can I help you today?</h1>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isModel = msg.role === "model" || msg.role === "assistant";
          const isLatestUser = index === lastUserIndex;

          return (
            <div
              key={index}
              ref={isLatestUser ? latestPromptRef : null}
              className={`message-row ${isModel ? "assistant" : "user"} ${
                isLatestUser ? "latest-user-prompt" : ""
              }`}
            >
              {isModel && (
                <div className="gemini-sparkle-icon">
                  <svg viewBox="0 0 28 28" fill="none">
                    <path
                      d="M14 0C14 7.73199 7.73199 14 0 14C7.73199 14 14 20.268 14 28C14 20.268 20.268 14 28 14C20.268 14 14 7.73199 14 0Z"
                      fill="url(#gemini-sparkle-grad)"
                    />
                    <defs>
                      <linearGradient
                        id="gemini-sparkle-grad"
                        x1="0"
                        y1="0"
                        x2="28"
                        y2="28"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#4285F4" />
                        <stop offset="0.5" stopColor="#9B72CF" />
                        <stop offset="1" stopColor="#D96570" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
              <div className="message-bubble">{msg.content}</div>
            </div>
          );
        })
      )}

      {loading && (
        <div className="loading-indicator">
          <div className="gemini-sparkle-icon">
            <svg viewBox="0 0 28 28" fill="none">
              <path
                d="M14 0C14 7.73199 7.73199 14 0 14C7.73199 14 14 20.268 14 28C14 20.268 20.268 14 28 14C20.268 14 14 7.73199 14 0Z"
                fill="#4285F4"
              />
            </svg>
          </div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* 🟢 ही मोकळी जागा नवीन मेसेजला Top ला ढकलण्यासाठी आवश्यक आहे */}
      <div className="bottom-scroll-spacer" />
    </div>
  );
}

export default Chat;