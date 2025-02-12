import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { Column, Task } from '@/types/task';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { TaskDialog } from './TaskDialog';

export function TaskBoard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'completed', title: 'Completed', tasks: [] },
  ]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const activeTaskRef = useRef<Task | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Add resize listener to detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('createdBy', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: tasks.filter((task) => task.status === col.id),
        }))
      );
    });

    return () => unsubscribe();
  }, [user]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      activeTaskRef.current = task;
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === active.id);
    const overColumn = columns.find((col) => col.id === over.id);

    if (!activeTask || !overColumn) return;

    try {
      await updateDoc(doc(db, 'tasks', activeTask.id), {
        status: overColumn.id,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Task updated',
        description: `Task moved to ${overColumn.title}`,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    }

    setActiveTask(null);
    activeTaskRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent, task: Task) => {
    touchStartX.current = e.touches[0].clientX;
    activeTaskRef.current = task;
  };

  const handleTouchMove = async (e: React.TouchEvent) => {
    if (!touchStartX.current || !activeTaskRef.current) return;

    const touchEndX = e.touches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const task = activeTaskRef.current;
    const currentColumnIndex = columns.findIndex((col) => col.id === task.status);

    if (Math.abs(deltaX) > 100) {
      try {
        let newStatus: string;
        if (deltaX > 0 && currentColumnIndex > 0) {
          newStatus = columns[currentColumnIndex - 1].id;
        } else if (deltaX < 0 && currentColumnIndex < columns.length - 1) {
          newStatus = columns[currentColumnIndex + 1].id;
        } else {
          return;
        }

        await updateDoc(doc(db, 'tasks', task.id), {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        });

        toast({
          title: 'Task moved',
          description: `Task moved to ${columns.find(col => col.id === newStatus)?.title}`,
        });

        touchStartX.current = null;
        activeTaskRef.current = null;
      } catch (error) {
        console.error('Error moving task:', error);
        toast({
          title: 'Error',
          description: 'Failed to move task',
          variant: 'destructive',
        });
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    activeTaskRef.current = null;
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    if (!user) return;

    try {
      const newTask = {
        ...taskData,
        createdBy: user.uid,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'tasks'), newTask);
      toast({
        title: 'Task created',
        description: 'New task has been added to your list',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="h-full w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-black">Task Board</h2>
        <Button
          onClick={() => setIsTaskDialogOpen(true)}
          className="w-full sm:w-auto border-2 border-black bg-[#FFD700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="w-full">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={`${isMobile ? 'flex flex-col gap-6' : 'flex flex-row gap-6 overflow-x-auto pb-4'}`}>
            {columns.map((column) => (
              <div key={column.id} className={`${isMobile ? 'w-full' : 'w-80 flex-shrink-0'}`}>
                <SortableContext items={column.tasks}>
                  <TaskColumn
                    column={column}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />
                </SortableContext>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}