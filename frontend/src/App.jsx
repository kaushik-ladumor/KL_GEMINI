import React from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MyContext from "./components/MyContext";

function App() {
  const [prompt, setPrompt] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [preChat, setPreChat] = React.useState([]);
  const [newChat, setNewChat] = React.useState([]);
  const [threadId, setThreadId] = React.useState(uuidv4());
  const [allThreads, setAllThreads] = React.useState([]);
  const providerValue = {
    prompt,
    setPrompt,
    reply,
    setReply,
    threadId,
    setThreadId,
    preChat,
    setPreChat,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-[#0F0F0F] to-[#1E1E1E] text-[#E3E3E3] font-sans">
      <MyContext.Provider value={providerValue}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
