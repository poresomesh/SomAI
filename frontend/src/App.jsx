import { useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import Sidebar from "./SideBar";
import ChatWindow from "./ChatWindow";
import Auth from "./components/Auth";
import "./App.css";

const API_BASE = "https://somai.onrender.com/api";

function App() {
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(Date.now().toString());
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // युझर लॉगिन स्टेट
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      localStorage.removeItem("user");
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  // थ्रेड्स आणणे
  const fetchThreads = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/thread?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      const data = await res.json();
      setThreads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchThreads();
    }
  }, [user]);

  // थ्रेड निवडणे
  const handleSelectThread = async (id) => {
    setCurrentThreadId(id);
    try {
      const res = await fetch(`${API_BASE}/thread/${id}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (err) {
      console.error("Error loading thread messages:", err);
    }
  };

  // नवीन चॅट
  const handleNewChat = () => {
    setCurrentThreadId(Date.now().toString());
    setMessages([]);
  };

  // साधा टेक्स्ट मेसेज पाठवणे
  const handleSendMessage = async (text) => {
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: currentThreadId,
          message: text,
          userId: user.id,
        }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      const botReply = data.reply || "No response received";

      setMessages((prev) => [...prev, { role: "model", content: botReply }]);
      fetchThreads();
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Error: Could not connect to the backend server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // थ्रेड डिलीट
  const handleDeleteThread = async (id) => {
    try {
      await fetch(`${API_BASE}/thread/${id}`, { method: "DELETE" });
      fetchThreads();
      if (currentThreadId === id) handleNewChat();
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setThreads([]);
    setMessages([]);
    setCurrentThreadId(Date.now().toString());
  };

  if (isAuthChecking) {
    return <div style={{ backgroundColor: "#131314", width: "100vw", height: "100vh" }} />;
  }

  if (!user) {
    return <Auth onAuthSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <MyContext.Provider
      value={{
        threads,
        currentThreadId,
        messages,
        loading,
        user,
        handleSelectThread,
        handleNewChat,
        handleSendMessage,
        handleDeleteThread,
      }}
    >
      <div className="app-container">
        <Sidebar user={user} onLogout={handleLogout} />
        <ChatWindow user={user} />
      </div>
    </MyContext.Provider>
  );
}

export default App;