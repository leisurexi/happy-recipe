import { FC, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

function getTimeString() {
  const date = new Date();
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const MainContent: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dotCount, setDotCount] = useState(1);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isLoading && (!messages.reverse().find(m => !m.isUser) || !messages.reverse().find(m => !m.isUser)?.content)) {
      const timer = setInterval(() => {
        setDotCount(c => (c % 3) + 1);
      }, 500);
      return () => clearInterval(timer);
    } else {
      setDotCount(1);
    }
  }, [isLoading, messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      id: `${Date.now()}-user`,
      content: input,
      isUser: true,
      timestamp: getTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // 预先插入 AI 消息（流式追加内容）
    const aiMsg: Message = {
      id: `${Date.now()}-ai`,
      content: "",
      isUser: false,
      timestamp: getTimeString(),
    };
    setMessages(prev => [...prev, aiMsg]);

    try {
      const eventSource = new EventSource(`/api/chat?message=${input}`);
      let aiContent = "";
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.error) {
          console.error('Stream error:', data.error)
          eventSource.close()
          return
        }
  
        if (data.done) {
          eventSource.close();
          setIsLoading(false);
          return;
        }
        
        if (data.content) {
          aiContent += data.content;
          setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: aiContent } : m));
        }
      };
      eventSource.onerror = (event) => {
        console.log(event)
        eventSource.close();
        setIsLoading(false);
        setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: "AI 服务异常，请稍后再试。" } : m));
      };
    } catch (e) {
      setIsLoading(false);
      setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: "AI 服务异常，请稍后再试。" } : m));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 找到最后一条 AI 消息
  const lastAIMsg = [...messages].reverse().find(m => !m.isUser);
  // 动态省略号动画
  useEffect(() => {
    if (isLoading && (!lastAIMsg || !lastAIMsg.content)) {
      const timer = setInterval(() => {
        setDotCount(c => (c % 3) + 1);
      }, 500);
      return () => clearInterval(timer);
    } else {
      setDotCount(1);
    }
  }, [isLoading, lastAIMsg]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50 min-h-screen">
      {/* 顶部温馨提示 */}
      <div className="w-full max-w-2xl mx-auto mt-6 mb-2 text-center px-2 sm:px-0">
        <span className="inline-block text-lg font-semibold text-orange-600 bg-orange-100 rounded-full px-4 py-1 shadow-sm">让美食点亮你的生活！</span>
      </div>
      {/* 消息区 */}
      <div className="flex-1 w-full flex flex-col items-center overflow-y-auto pt-2 pb-28">
        <div className="w-full max-w-2xl mx-auto space-y-2 px-2 sm:px-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-orange-400">
              <div className="mb-4 text-5xl">👨‍🍳</div>
              <h3 className="mb-2 text-xl font-bold">欢迎使用食谱推荐助手</h3>
              <p className="text-base">输入你手头的食材、口味、人数等，我来帮你推荐菜谱！</p>
            </div>
          ) : (
            messages
              .filter(msg => msg.isUser || msg.content)
              .map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full gap-3",
                  msg.isUser ? "justify-end" : "justify-start"
                )}
              >
                {!msg.isUser && (
                  <div className="flex items-end">
                    <span className="text-3xl mr-1">👨‍🍳</span>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[70%] whitespace-pre-wrap text-base",
                    msg.isUser
                      ? "bg-orange-400 text-white rounded-2xl px-4 py-2 shadow-md"
                      : "bg-white/80 text-orange-900 rounded-2xl px-4 py-2 border border-orange-100 shadow-sm"
                  )}
                >
                  {msg.isUser ? (
                    msg.content
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>
                {msg.isUser && (
                  <div className="flex items-end">
                    <span className="text-3xl ml-1">🧑‍🍳</span>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (!lastAIMsg || !lastAIMsg.content) && (
            <div className="flex w-full gap-3 justify-start">
              <span className="text-3xl mr-1">👨‍🍳</span>
              <div className="max-w-[70%] whitespace-pre-wrap text-base bg-white/80 text-orange-900 rounded-2xl px-4 py-2 border border-orange-100 shadow-sm">
                正在为你思考美味菜谱{'.'.repeat(dotCount)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* 输入区 */}
      <form
        className="fixed bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-orange-100/80 to-transparent py-2 z-10 md:left-64 md:w-[calc(100%-16rem)]"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <div
          className="w-full max-w-2xl flex items-end bg-white rounded-2xl shadow px-4 py-1 border border-orange-200 mx-4 sm:mx-2 sm:px-3"
        >
          <Textarea
            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent resize-none min-h-[34px] max-h-32 pr-2 sm:pr-12 text-orange-900 placeholder:text-orange-300 text-base sm:text-base"
            placeholder="如：鸡蛋、西红柿，2人，喜欢微辣，今晚吃什么？"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            style={{ fontSize: '1rem' }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="ml-2 bg-orange-400 hover:bg-orange-500 text-white rounded-full min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px]"
            variant="ghost"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}; 