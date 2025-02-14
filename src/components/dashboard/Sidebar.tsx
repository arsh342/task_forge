import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  MessageSquareText,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  setView: (view: 'board' | 'calendar' | 'assistant') => void;
}

export function Sidebar({ isOpen, currentView, setView }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 glass border-r-4 border-black transition-transform duration-300",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b-4 border-black px-6">
      </div>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg font-semibold neubrutalism-sm neubrutalism-hover",
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
                "w-full justify-start text-lg font-semibold neubrutalism-sm neubrutalism-hover",
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
                "w-full justify-start text-lg font-semibold neubrutalism-sm neubrutalism-hover",
                currentView === 'assistant' && "border-black bg-[#87CEEB] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}
              onClick={() => setView('assistant')}
            >
              <MessageSquareText className="mr-2 h-5 w-5" />
              AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
