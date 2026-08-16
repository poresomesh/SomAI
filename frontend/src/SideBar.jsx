import { useContext } from "react";
import { MyContext } from "./MyContext";
import "./SideBar.css";

function SideBar({ user, onLogout }) {
  const {
    threads,
    currentThreadId,
    handleSelectThread,
    handleNewChat,
    handleDeleteThread,
  } = useContext(MyContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={handleNewChat}>
          <svg viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New chat
        </button>
      </div>

      <div className="history-list">
        <p className="history-title">Recent</p>
        {threads &&
          threads.map((thread) => (
            <div
              key={thread.threadId}
              className={`history-item ${
                thread.threadId === currentThreadId ? "active" : ""
              }`}
              onClick={() => handleSelectThread(thread.threadId)}
            >
              <span className="thread-title">
                {thread.title || "Untitled Chat"}
              </span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteThread(thread.threadId);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          ))}
      </div>

              
      <div className="sidebar-footer-custom">
        <div className="user-profile-row">
          <div className="user-glow-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="user-details-box">
            <span className="user-name-title">{user?.name || "Sam"}</span>
            <span className="user-location-info">
              <span className="location-ping"></span> Maharashtra, India
            </span>
          </div>
        </div>

        {/* मॉडर्न ग्रेडियंट Logout बटण */}
        <button className="gemini-logout-btn" onClick={onLogout}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}

export default SideBar;