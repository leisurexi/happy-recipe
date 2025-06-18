import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Download, Settings } from "lucide-react";

interface ChatHeaderProps {
  title?: string;
  onClearChat?: () => void;
  onExportChat?: () => void;
  onSettings?: () => void;
}

export function ChatHeader({ 
  title = "AI 助手", 
  onClearChat, 
  onExportChat, 
  onSettings 
}: ChatHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between bg-white px-4 rounded-t-lg border-b">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-sm font-bold text-white">AI</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500">在线</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onSettings && (
            <DropdownMenuItem onClick={onSettings}>
              <Settings className="mr-2 h-4 w-4" />
              设置
            </DropdownMenuItem>
          )}
          {onExportChat && (
            <DropdownMenuItem onClick={onExportChat}>
              <Download className="mr-2 h-4 w-4" />
              导出对话
            </DropdownMenuItem>
          )}
          {onClearChat && (
            <DropdownMenuItem onClick={onClearChat} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              清空对话
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 