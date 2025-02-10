import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from '@/types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  column: Column;
}

export function TaskColumn({ column }: TaskColumnProps) {
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
      className={`w-80 rounded-lg border-2 border-black ${getBgColor(column.id)} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
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
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}