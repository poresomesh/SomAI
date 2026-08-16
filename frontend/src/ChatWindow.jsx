import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import Chat from "./Chat";
import "./ChatWindow.css";

function ChatWindow({ user }) {
  const { handleSendMessage, loading } = useContext(MyContext);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    handleSendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-window">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <h2>SomAI</h2>
        </div>
        <div className="navbar-user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </header>

      {/* Message Area */}
      <main className="chat-body">
        <Chat />
      </main>

      {/* Input Form */}
      <footer className="chat-footer">
        <form onSubmit={handleSubmit} className="input-box-wrapper">
          <input
            type="text"
            placeholder="Ask SomAI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={loading || !input.trim()}
          >
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
        <span className="footer-disclaimer">
          SomAI may display inaccurate info, including about people, so double-check its responses.
        </span>
      </footer>
    </div>
  );
}

export default ChatWindow;