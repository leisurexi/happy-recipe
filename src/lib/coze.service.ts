import { CozeAPI, COZE_CN_BASE_URL, ChatStatus, RoleType } from "@coze/api";

interface ChatResponse {
  success: boolean;
  data: any;
  error?: any;
}

const botId = process.env.COZE_BOT_ID || undefined;

// Import token using the environment variable
const token = process.env.COZE_API_TOKEN || "";

export class CozeService {
  private client: CozeAPI;

  constructor() {
    this.client = new CozeAPI({
      token: token,
      baseURL: COZE_CN_BASE_URL,
    });
  }

  /**
   * 发送消息到 Coze 智能体
   * @param message 用户消息
   * @param sessionId 会话ID
   * @returns 聊天响应
   */
  async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<ChatResponse> {
    if (!botId) {
      throw new Error("Bot ID is required");
    }

    const v = await this.client.chat.createAndPoll({
      bot_id: botId,
      additional_messages: [
        {
          role: RoleType.User,
          content: message,
          content_type: "text",
        },
      ],
    });

    if (v.chat.status === ChatStatus.COMPLETED && v.messages) {
      // 过滤出 type 为 answer 的消息并拼接内容
      const answerContent = v.messages
        .filter((item) => item.type === "answer")
        .map((item) => item.content)
        .join("");

      console.log("usage", v.chat.usage);

      return {
        success: v.chat.last_error ? false : true,
        data: answerContent,
        error: v.chat.last_error,
      };
    }

    return {
      success: v.chat.last_error ? false : true,
      data: "",
      error: v.chat.last_error,
    };
  }

  async streamMessage(message: string) {
    const stream = await this.client.chat.stream({
      bot_id: botId || "",
      additional_messages: [
        {
          role: RoleType.User,
          content: message,
          content_type: "text",
        },
      ],
    });
    return stream
  }
}