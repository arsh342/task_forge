import { useState, useEffect } from "react"
import { Calendar } from "@/components/Calendar"
import { ChatBot } from "@/components/ChatBot"
import { TaskBoard } from "@/components/TaskBoard"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { cn } from "@/lib/utils"

// Remove 'settings', 'teams', and 'help' from View type
type View = 'board' | 'calendar' | 'assistant';

export function Dashboard() {
  const [view, setView] = useState<View>('board');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const renderView = () => {
    switch (view) {
      case 'board':
        return <TaskBoard />;
      case 'calendar':
        return <Calendar />;
      case 'assistant':
        return <ChatBot />;
      default:
        return <TaskBoard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setView={setView} 
        currentView={view} 
      />
      
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            "px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
            isSidebarOpen ? "md:ml-64" : "ml-0"
          )}
        >
          <div className="max-w-7xl mx-auto w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
