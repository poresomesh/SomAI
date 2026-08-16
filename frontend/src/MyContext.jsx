import { createContext } from "react";

// 🟢 हे Named Export असणे आवश्यक आहे
export const MyContext = createContext();


function Sidebar({ onLogout }) {
  const { threads, currentThreadId, handleSelectThread, handleNewChat, handleDeleteThread, user } = useContext(MyContext);

}

export default MyContext;