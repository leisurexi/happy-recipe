"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";
import { Message } from "@/components/layout/main-content";
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MainContent
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
