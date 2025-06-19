import { FC } from "react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Sidebar: FC = () => {
  const [open, setOpen] = useState(false);

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <>
      <div className="flex items-center h-20 px-6 border-b border-orange-100">
        <span className="font-bold text-2xl text-orange-600 flex items-center gap-2">
          <span>🍲</span>食谱推荐助手
        </span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-3">
        <button className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium transition">
          <span>🆕</span>新对话
        </button>
        <button className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl hover:bg-orange-100 text-orange-700">
          <span>🔍</span>搜索聊天
        </button>
        <button className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl hover:bg-orange-100 text-orange-700">
          <span>📚</span>菜谱库
        </button>
        <button className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl hover:bg-orange-100 text-orange-700">
          <span>⭐</span>我的收藏
        </button>
        <button className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl hover:bg-orange-100 text-orange-700">
          <span>🕑</span>历史推荐
        </button>
        <div className="mt-8">
          <div className="text-xs text-orange-400 mb-2">模型选择</div>
          <button className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-orange-100 text-orange-600">
            <span>👨‍🍳</span>美食助手
          </button>
          <button className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-orange-100 text-orange-600">
            <span>🤖</span>通用助手
          </button>
        </div>
      </nav>
      <div className="p-4 border-t border-orange-100 text-xs text-orange-400 text-center">
        用心推荐，让美食更简单 🍽️
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              aria-label="打开菜单"
              className="p-2 rounded-full bg-orange-100 text-orange-600 shadow hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="p-0 w-64 max-w-full h-full bg-gradient-to-b from-orange-50 via-yellow-50 to-green-50 border-r shadow-sm">
            <DrawerClose asChild>
              <button
                aria-label="关闭菜单"
                className="absolute top-4 right-4 p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                onClick={() => setOpen(false)}
              >
                <span className="text-xl">×</span>
              </button>
            </DrawerClose>
            {sidebarContent}
          </DrawerContent>
        </Drawer>
      </div>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-gradient-to-b from-orange-50 via-yellow-50 to-green-50 border-r shadow-sm">
        {sidebarContent}
      </aside>
    </>
  );
}; 