import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TaskBoard } from '../TaskBoard';
import { Calendar } from '../Calendar';
import { ChatBot } from '../ChatBot';
import { cn } from '@/lib/utils';

type View = 'board' | 'calendar' | 'assistant';

export function Dashboard() {
  const [view, setView] = useState<View>('board');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setView={setView} currentView={view} />
      
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className={cn(
          "flex-1 overflow-y-auto p-8 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}>
          {view === 'board' && <TaskBoard />}
          {view === 'calendar' && <Calendar tasks={[]} />}
          {view === 'assistant' && <ChatBot tasks={[]} />}
        </main>
      </div>
    </div>
  );
}