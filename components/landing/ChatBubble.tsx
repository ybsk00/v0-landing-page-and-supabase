"use client"

interface ChatBubbleProps {
  role: "customer" | "bot"
  text: string
  isTyping?: boolean
}

export function ChatBubble({ role, text, isTyping }: ChatBubbleProps) {
  return (
    <div className={`flex ${role === "customer" ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
          role === "customer"
            ? "bg-teal-500/20 text-white rounded-br-md"
            : "bg-white/5 text-gray-200 rounded-bl-md"
        }`}
        style={{ wordBreak: "keep-all" }}
      >
        {isTyping ? (
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          text
        )}
      </div>
    </div>
  )
}
