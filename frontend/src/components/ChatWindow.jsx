import React from "react";
import MyContext from "./MyContext";
import {
  CircleUserRound,
  SendHorizontal,
  Sparkles,
  StopCircle,
  Menu,
} from "lucide-react";
import Chat from "./Chat";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, threadId, preChat, setPreChat } =
    React.useContext(MyContext);

  const [loading, setLoading] = React.useState(false);
  const [controller, setController] = React.useState(null);
  const [isTyping, setIsTyping] = React.useState(false);

  const getReply = async () => {
    if (loading || isTyping) return;

    setLoading(true);
    setIsTyping(false);
    const abortCtrl = new AbortController();
    setController(abortCtrl);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, threadId }),
        signal: abortCtrl.signal,
      });

      const data = await response.json();
      setLoading(false);
      setIsTyping(true);
      setReply(data.reply);

      setPreChat((prev) => [...prev, { role: "user", content: prompt }]);
      setPrompt("");
    } catch (error) {
      if (error.name !== "AbortError") console.error(error);
      setLoading(false);
      setIsTyping(false);
    }

    setController(null);
  };

  const stopGeneration = () => {
    if (controller) {
      controller.abort();
      setLoading(false);
      setController(null);
      setIsTyping(false);
    }
  };

  React.useEffect(() => {
    if (reply && !loading) {
      const timer = setTimeout(() => {
        setIsTyping(false);
        setPreChat((prev) => [...prev, { role: "assistant", content: reply }]);
        setReply("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [reply, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && !isTyping && prompt.trim()) getReply();
    }
  };

  const showStopButton = loading || isTyping;
  const canSend = prompt.trim() && !loading && !isTyping;

  return (
    <div className="flex flex-col h-screen w-full bg-[#0D1117] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#161B22] border-b border-[#21262D] shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#21262D] rounded-lg transition-colors lg:hidden">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#161B22]"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold text-white text-lg leading-tight">
                KL_GEMINI
              </h1>
              <span className="text-sm text-gray-400">
                {isTyping ? "Typing..." : loading ? "Thinking..." : "Online"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-[#21262D] hover:bg-[#30363D] rounded-full transition-colors">
            <CircleUserRound className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>

      {/* Input Section */}
      <footer className="bg-[#0D1117] border-t border-[#21262D] p-4">
        <div className="max-w-4xl mx-auto">
          {/* Stop Generation Indicator */}
          {showStopButton && (
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1C2128] rounded-full border border-[#30363D]">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">
                  {loading ? "Generating response..." : "Typing response..."}
                </span>
              </div>
            </div>
          )}

          {/* Input Container */}
          <div className="relative bg-[#21262D] rounded-2xl border border-[#30363D] shadow-sm transition-all duration-200 focus-within:border-[#4F46E5] focus-within:shadow-md focus-within:shadow-[#4F46E5]/10">
            <div className="flex items-end gap-3 p-3">
              <div className="flex-1 min-h-[40px] max-h-32 overflow-y-auto">
                <textarea
                  className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 text-base resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                  placeholder="Message KL_GEMINI..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || isTyping}
                  rows="1"
                  style={{
                    minHeight: "40px",
                    height: "auto",
                    lineHeight: "1.5",
                  }}
                />
              </div>

              <div className="flex items-center gap-2 pb-1">
                {showStopButton ? (
                  <button
                    onClick={stopGeneration}
                    className="p-2.5 bg-[#30363D] hover:bg-[#424851] rounded-xl transition-all border border-[#424851] hover:border-[#4F46E5]/50"
                    title="Stop generating"
                  >
                    <StopCircle className="w-5 h-5 text-gray-300" />
                  </button>
                ) : (
                  <button
                    onClick={getReply}
                    disabled={!canSend}
                    className={`p-2.5 rounded-xl transition-all ${
                      canSend
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] shadow-lg hover:shadow-xl hover:shadow-[#4F46E5]/25 transform hover:scale-105"
                        : "bg-[#30363D] cursor-not-allowed opacity-50"
                    }`}
                    title={canSend ? "Send message" : "Type a message"}
                  >
                    <SendHorizontal className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ChatWindow;
