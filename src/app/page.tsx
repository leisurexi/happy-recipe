"use client";

import { useState } from "react";
import { ChatContainer, Message } from "@/components/chat/chat-container";
import { ChatHeader } from "@/components/chat/chat-header";
import { createUserMessage, createAIMessage, simulateAIResponse } from "@/lib/chat-utils";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    const userMessage = createUserMessage(content);
    setMessages(prev => [...prev, userMessage]);
    
    // 开始加载状态
    setIsLoading(true);
    
    try {
      // 模拟 AI 响应
      const aiResponse = await simulateAIResponse(content);
      const aiMessage = createAIMessage(aiResponse);
      
      // 添加 AI 响应
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = createAIMessage("抱歉，我遇到了一些问题。请稍后再试。");
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    const chatText = messages
      .map(msg => `${msg.isUser ? '用户' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex h-full flex-col rounded-lg border bg-white shadow-lg">
          {/* 头部 */}
          <ChatHeader
            title="AI 智能助手"
            onClearChat={handleClearChat}
            onExportChat={handleExportChat}
          />
          
          {/* 聊天容器 */}
          <div className="flex-1 overflow-hidden">
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
