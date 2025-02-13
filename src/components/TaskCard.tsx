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
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
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
      className={`neubrutalism card-hover ${
        isDragging ? 'opacity-50' : ''
      } cursor-grab active:cursor-grabbing bg-white p-4`}
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
        <Avatar className="h-8 w-8 neubrutalism-sm">
          <AvatarImage src={`https://avatar.vercel.sh/${task.assignedTo}`} />
          <AvatarFallback className="border-2 border-black">
            {task.assignedTo.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Badge
          className={`neubrutalism-sm font-bold ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}