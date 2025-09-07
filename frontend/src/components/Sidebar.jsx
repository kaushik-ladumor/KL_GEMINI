import React from "react";
import {
  Plus,
  MessageSquare,
  Menu,
  X,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import MyContext from "./MyContext";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    threadId,
    setNewChat,
    setThreadId,
    setPrompt,
    setPreChat,
    setReply,
  } = React.useContext(MyContext);

  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [hoveredThread, setHoveredThread] = React.useState(null);

  const getAllThread = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/thread`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      const formData = data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
        createdAt: thread.createdAt,
      }));
      setAllThreads(formData);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  React.useEffect(() => {
    getAllThread();
  }, [threadId]);

  const createChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setThreadId(uuidv4());
    setPreChat([]);
    setIsMobileOpen(false);
  };

  const changeChat = async (newThreadId) => {
    setThreadId(newThreadId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/thread/${newThreadId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setPreChat(data.messages || []);
      setPrompt("");
    } catch (error) {
      console.error("Error changing chat:", error);
    }
    setIsMobileOpen(false);
  };

  const deleteThread = async (delThreadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/thread/${delThreadId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        setAllThreads((prev) =>
          prev.filter((thread) => thread.threadId !== delThreadId)
        );
      } else {
        console.error("Error deleting thread:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#161B22] backdrop-blur-md border border-[#30363D] shadow-lg hover:bg-[#21262D] transition-colors"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-300" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`flex flex-col h-screen w-72 bg-[#0D1117] border-r border-[#21262D] transition-all duration-300 fixed lg:relative z-40 ${
          isMobileOpen ? "left-0" : "-left-72 lg:left-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#21262D] bg-[#161B22]/50">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-semibold text-white ml-50">Chats</h2>
            {/* <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-[#21262D] transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button> */}
          </div>

          <button
            onClick={createChat}
            className="flex items-center justify-center w-full bg-[#21262D] hover:bg-[#30363D] rounded-xl px-4 py-3 border border-[#30363D] hover:border-[#4F46E5]/50 transition-all duration-200 group"
          >
            <Plus className="w-4 h-4 text-gray-300 group-hover:text-white mr-2" />
            <span className="font-medium text-gray-300 group-hover:text-white">
              New Chat
            </span>
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 pb-2">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Recent</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-[#30363D] scrollbar-track-transparent">
            {allThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-600 mt-1">
                  Start a new chat to begin
                </p>
              </div>
            ) : (
              <div className="space-y-1 pb-4">
                {allThreads.map((thread) => (
                  <div
                    key={thread.threadId}
                    className="relative group"
                    onMouseEnter={() => setHoveredThread(thread.threadId)}
                    onMouseLeave={() => setHoveredThread(null)}
                  >
                    <button
                      onClick={() => changeChat(thread.threadId)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 ${
                        thread.threadId === threadId
                          ? "bg-[#21262D] border border-[#30363D] text-white"
                          : "hover:bg-[#161B22] text-gray-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              thread.threadId === threadId
                                ? "bg-[#4F46E5]"
                                : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate pr-2">
                              {thread.title || "Untitled Chat"}
                            </h4>
                            {hoveredThread === thread.threadId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteThread(thread.threadId);
                                }}
                                className="flex-shrink-0 p-1 rounded-md hover:bg-[#30363D] text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatDate(thread.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#21262D] bg-[#161B22]/30">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Powered by KL_GEMINI</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
