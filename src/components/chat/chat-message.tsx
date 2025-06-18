import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex w-full gap-3 p-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
          <AvatarFallback className="bg-green-100 text-green-600">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex max-w-[80%] flex-col gap-2",
        isUser ? "items-end" : "items-start"
      )}>
        <Card className={cn(
          "rounded-2xl px-4 py-3",
          isUser 
            ? "bg-blue-500 text-white" 
            : "bg-gray-100 text-gray-900"
        )}>
          <CardContent className="p-0">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message}
            </p>
          </CardContent>
        </Card>
        
        {timestamp && (
          <span className="text-xs text-gray-500">
            {timestamp}
          </span>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 