import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TaskBoard } from '../TaskBoard';
import { Calendar } from '../Calendar';
import { ChatBot } from '../ChatBot';
import { Settings } from './Settings';
import { Teams } from './Teams';
import { Help } from './Help';
import { cn } from '@/lib/utils';

type View = 'board' | 'calendar' | 'assistant' | 'settings' | 'teams' | 'help';

export function Dashboard() {
  const [view, setView] = useState<View>('board');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (view) {
      case 'board':
        return <TaskBoard />;
      case 'calendar':
        return <Calendar />;
      case 'assistant':
        return <ChatBot />;
      case 'settings':
        return <Settings />;
      case 'teams':
        return <Teams />;
      case 'help':
        return <Help />;
      default:
        return <TaskBoard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setView={setView} currentView={view} />
      
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className={cn(
          "flex-1 overflow-y-auto p-8 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}