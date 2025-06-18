import { Message } from "@/components/chat/chat-container";

// 模拟 AI 响应
export async function simulateAIResponse(userMessage: string): Promise<string> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // 简单的响应逻辑
  const responses = [
    "我理解你的问题。让我来帮你分析一下...",
    "这是一个很有趣的问题！根据我的理解...",
    "谢谢你的提问。我认为可以从以下几个方面来考虑...",
    "我明白你的困惑。让我为你详细解释一下...",
    "这是一个很好的问题。我的建议是...",
    "基于你提供的信息，我认为...",
    "让我从专业的角度来回答这个问题...",
    "这确实是一个值得深入探讨的话题...",
  ];
  
  // 根据用户消息内容选择响应
  if (userMessage.toLowerCase().includes('你好') || userMessage.toLowerCase().includes('hello')) {
    return "你好！我是你的 AI 助手，很高兴为你服务。有什么我可以帮助你的吗？";
  }
  
  if (userMessage.toLowerCase().includes('谢谢') || userMessage.toLowerCase().includes('感谢')) {
    return "不客气！我很高兴能帮到你。如果还有其他问题，随时可以问我。";
  }
  
  if (userMessage.toLowerCase().includes('再见') || userMessage.toLowerCase().includes('拜拜')) {
    return "再见！希望我们的对话对你有帮助。如果以后还有问题，随时欢迎回来！";
  }
  
  // 随机选择一个响应
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return randomResponse + " " + generateDetailedResponse();
}

function generateDetailedResponse(): string {
  const topics = [
    "这个问题涉及到多个方面，需要综合考虑各种因素。",
    "从技术角度来看，这确实是一个挑战，但也有很多解决方案。",
    "我建议你可以先尝试这个方法，如果遇到问题我们再进一步讨论。",
    "这是一个常见的问题，很多人都遇到过类似的情况。",
    "基于我的经验，我认为最好的做法是循序渐进。",
  ];
  
  return topics[Math.floor(Math.random() * topics.length)];
}

// 生成消息 ID
export function generateMessageId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// 格式化时间戳
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 创建用户消息
export function createUserMessage(content: string): Message {
  return {
    id: generateMessageId(),
    content,
    isUser: true,
    timestamp: formatTimestamp(new Date())
  };
}

// 创建 AI 消息
export function createAIMessage(content: string): Message {
  return {
    id: generateMessageId(),
    content,
    isUser: false,
    timestamp: formatTimestamp(new Date())
  };
} 