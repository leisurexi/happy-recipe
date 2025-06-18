import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatContainer({ 
  messages, 
  onSendMessage, 
  isLoading = false 
}: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 消息列表 */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4"
      >
        <div className="space-y-2">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="mb-4 text-4xl">🤖</div>
                <h3 className="mb-2 text-lg font-semibold">欢迎使用 AI 助手</h3>
                <p className="text-sm">开始对话吧！</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))
          )}
          
          {isLoading && (
            <ChatMessage
              message="正在思考..."
              isUser={false}
            />
          )}
        </div>
      </ScrollArea>

      {/* 输入框 */}
      <ChatInput
        onSendMessage={onSendMessage}
        disabled={isLoading}
        placeholder={isLoading ? "AI 正在回复..." : "发送消息..."}
      />
    </div>
  );
} 