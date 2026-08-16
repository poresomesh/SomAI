import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./MyContext";
import "./Chat.css";

// 🟢 Gemini Style Word-by-Word Typing Component
function TypewriterMessage({ text, isLatestAssistant, onUpdate }) {
  const [displayedText, setDisplayedText] = useState(isLatestAssistant ? "" : text);

  useEffect(() => {
    if (!isLatestAssistant) {
      setDisplayedText(text);
      return;
    }

    const words = text.split(" ");
    let currentIndex = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText((prev) => (prev ? prev + " " + words[currentIndex] : words[currentIndex]));
        currentIndex++;
        if (onUpdate) onUpdate();
      } else {
        clearInterval(interval);
      }
    }, 30); // टायपिंगचा वेग (30ms per word)

    return () => clearInterval(interval);
  }, [text, isLatestAssistant]);

  return <div className="message-bubble">{displayedText}</div>;
}

function Chat() {
  const { messages, loading, user } = useContext(MyContext);
  const latestPromptRef = useRef(null);

  // शेवटच्या user आणि assistant मेसेजचा index
  const lastUserIndex = messages.map((m) => m.role).lastIndexOf("user");
  const lastAssistantIndex = messages.map((m) => m.role === "model" || m.role === "assistant").lastIndexOf(true);

  // 🟢 प्रश्न Top ला आणणारे स्क्रोल फंक्शन
  const scrollToPromptTop = () => {
    const chatBody = document.querySelector(".chat-body");
    if (chatBody && latestPromptRef.current) {
      const targetTop = latestPromptRef.current.offsetTop - chatBody.offsetTop;
      chatBody.scrollTo({
        top: Math.max(0, targetTop - 10),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (latestPromptRef.current) {
      setTimeout(scrollToPromptTop, 50);
    }
  }, [messages.length, loading]);

  return (
    <div className="chat-messages-container">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <h1 className="empty-chat-hello">
            Hello, {user?.name ? user.name : "User"}
          </h1>
          <h1 className="empty-chat-sub">How can I help you today?</h1>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isModel = msg.role === "model" || msg.role === "assistant";
          const isLatestUser = index === lastUserIndex;
          const isLatestAssistant = isModel && index === lastAssistantIndex;

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
              {isModel ? (
                <TypewriterMessage
                  text={msg.content}
                  isLatestAssistant={isLatestAssistant}
                />
              ) : (
                <div className="message-bubble">{msg.content}</div>
              )}
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

      {messages.length > 0 && <div className="bottom-scroll-spacer" />}
    </div>
  );
}

export default Chat;