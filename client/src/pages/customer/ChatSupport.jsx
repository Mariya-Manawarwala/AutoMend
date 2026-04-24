import Card from "../../components/Card";
import { mockChatMessages } from "../../utils/mockData";

export default function ChatSupport() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">AI Support Chat</h1>
      <Card hover={false} className="flex flex-col h-[calc(100vh-220px)] min-h-[400px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {mockChatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === "user"
                  ? "bg-brand text-[#0E0E0E] rounded-br-md"
                  : "bg-soft text-text-primary rounded-bl-md"
              }`}>
                {msg.sender === "bot" && <p className="text-brand text-xs font-bold mb-1">🤖 AutoMend AI</p>}
                <p className="whitespace-pre-line">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="flex gap-2 pt-3 border-t border-soft">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-soft border border-soft rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors"
          />
          <button className="bg-brand hover:bg-brand-hover text-[#0E0E0E] font-semibold px-5 py-3 rounded-lg transition-colors cursor-pointer">
            Send
          </button>
        </div>
      </Card>
    </div>
  );
}
