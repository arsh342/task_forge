import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CalendarIcon, MessageSquareText, Users, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  setView: (view: 'board' | 'calendar' | 'assistant') => void;
}

export function Sidebar({ isOpen, currentView, setView }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r-4 border-black bg-white transition-transform duration-300 lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b-4 border-black px-6">
        <h1 className="text-2xl font-black">Task Manager</h1>
      </div>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg font-semibold border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
                currentView === 'board' && "border-black bg-[#FFD700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}
              onClick={() => setView('board')}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg font-semibold border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
                currentView === 'calendar' && "border-black bg-[#98FB98] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              Calendar
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg font-semibold border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
                currentView === 'assistant' && "border-black bg-[#87CEEB] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}
              onClick={() => setView('assistant')}
            >
              <MessageSquareText className="mr-2 h-5 w-5" />
              AI Assistant
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Settings</h2>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-lg font-semibold border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Users className="mr-2 h-5 w-5" />
              Team
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lg font-semibold border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lg font-semibold border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Help
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
