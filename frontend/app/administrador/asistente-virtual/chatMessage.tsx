import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  sender: "bot" | "user";
  text: string;
}

const ChatMessage = ({ sender, text }: ChatMessageProps) => {
  const isBot = sender === "bot";

  return (
    <div className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#003952]">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
        isBot 
          ? "bg-white text-gray-700 border border-gray-100 rounded-tl-none" 
          : "bg-[#003952] text-white rounded-tr-none"
      }`}>
        <p className="whitespace-pre-line leading-relaxed">
          {text}
        </p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;