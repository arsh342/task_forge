import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column, Task } from '@/types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  column: Column;
  onTouchStart: (e: React.TouchEvent, task: Task) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

// TaskColumn.tsx
export function TaskColumn({ column, onTouchStart, onTouchMove, onTouchEnd }: TaskColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBgColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'bg-[#FFE4E1]';
      case 'in-progress':
        return 'bg-[#E0FFFF]';
      case 'completed':
        return 'bg-[#98FB98]';
      default:
        return 'bg-white';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-[320px] min-w-[320px] rounded-lg border-2 border-black ${getBgColor(
        column.id
      )} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
      {...attributes}
      {...listeners}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-black">{column.title}</h3>
        <span className="rounded-full border-2 border-black bg-white px-2 py-0.5 text-sm font-bold">
          {column.tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {column.tasks.map((task) => (
          <div
            key={task.id}
            className="w-full"
            onTouchStart={(e) => onTouchStart(e, task)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
}
