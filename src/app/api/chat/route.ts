import { NextRequest } from "next/server";
import { CozeService } from '@/lib/coze.service'
import { ChatEventType } from "@coze/api";


export async function GET(req: NextRequest) {
  // 从查询参数获取消息
  const { searchParams } = new URL(req.url);
  const message = searchParams.get("message") || "";
  console.log(message)

  const cozeService = new CozeService()

  // 设置 SSE 响应头
  const stream = new ReadableStream({
    async start(controller) {
        try {
            const stream = await cozeService.streamMessage(message)
    
            for await (const part of stream) {
              if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                // 发送数据到客户端
                controller.enqueue(`data: ${JSON.stringify({ content: part.data.content })}\n\n`)
              }
            }
            // 发送结束标记
            controller.enqueue(`data: ${JSON.stringify({ done: true })}\n\n`)
            controller.close()
          } catch (error) {
            console.error('Stream Error:', error)
            controller.enqueue(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`)
            controller.close()
          }

      controller.enqueue("event: end\ndata: [DONE]\n\n");
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
} 