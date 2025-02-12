import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  const { toast } = useToast();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#FF6B6B] hover:bg-[#FF5252]';
      case 'medium':
        return 'bg-[#FFD93D] hover:bg-[#FFC107]';
      case 'low':
        return 'bg-[#4ADE80] hover:bg-[#22C55E]';
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
      toast({
        title: 'Task deleted',
        description: 'The task has been successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
        isDragging ? 'opacity-50' : ''
      } cursor-grab active:cursor-grabbing`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between">
        <h4 className="mb-2 font-bold">{task.title}</h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <p className="mb-4 text-sm text-gray-600">{task.description}</p>
      
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(task.dueDate), 'MMM d')}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-green-600" />
            <span>{task.startTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-red-600" />
            <span>{task.dueTime}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Avatar className="h-8 w-8 border-2 border-black">
          <AvatarImage src={`https://avatar.vercel.sh/${task.assignedTo}`} />
          <AvatarFallback className="border-2 border-black">
            {task.assignedTo.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Badge
          className={`border-2 border-black font-bold ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}