import React from "react";
import MyContext from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { Bot, User, Sparkles } from "lucide-react";

function Chat() {
  const { preChat, reply } = React.useContext(MyContext);
  const [typingContent, setTypingContent] = React.useState("");
  const [isTypingComplete, setIsTypingComplete] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [preChat, typingContent]);

  React.useEffect(() => {
    if (!reply) {
      setTypingContent("");
      setIsTypingComplete(false);
      return;
    }

    setIsTypingComplete(false);
    setTypingContent("");

    // Split reply into words
    const words = reply.split(" ");
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        // Build content word by word
        const wordsToShow = words.slice(0, wordIndex + 1);
        setTypingContent(wordsToShow.join(" "));
        wordIndex++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 100); // Adjust speed as needed (100ms per word)

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <div className="flex flex-col h-full w-full p-4 md:p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {preChat.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" fill="white" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            How can I help you today?
          </h3>
          <p className="text-center max-w-md">
            Ask anything, from creative ideas to technical explanations
          </p>
        </div>
      )}

      {/* Previous messages */}
      {preChat.map((chat, index) => (
        <div
          key={index}
          className={`flex animate-fadeIn ${
            chat.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex max-w-[85%] md:max-w-[75%] ${
              chat.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 mx-2 mt-2 ${
                chat.role === "user" ? "ml-3" : "mr-3"
              }`}
            >
              {chat.role === "user" ? (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm ${
                chat.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
                  : "bg-[#2D2D2D] text-gray-200 border border-gray-700 rounded-bl-md"
              }`}
            >
              <div
                className={
                  chat.role === "assistant"
                    ? "prose prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-code:before:hidden prose-code:after:hidden"
                    : ""
                }
              >
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Assistant typing effect */}
      {reply && !isTypingComplete && (
        <div className="flex justify-start animate-fadeIn">
          <div className="flex max-w-[85%] md:max-w-[75%]">
            <div className="flex-shrink-0 mr-3 mt-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#2D2D2D] text-gray-200 border border-gray-700 rounded-bl-md">
              <div className="prose prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {typingContent}
                </ReactMarkdown>
                <div className="flex space-x-1.5 pt-2">
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "100ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "200ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default Chat;
