import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';
import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CalendarProps {
  tasks: Task[];
}

export function Calendar({ tasks }: CalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getDayTasks = (day: Date) => {
    return tasks.filter(
      (task) => format(new Date(task.dueDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="flex gap-4">
      <div className="w-fit">
        <CalendarPrimitive
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            hasTasks: (date) => getDayTasks(date).length > 0,
          }}
          modifiersStyles={{
            hasTasks: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            },
          }}
        />
      </div>

      <div className="flex-1">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5" />
              <h3 className="text-lg font-semibold">
                {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
            </div>

            {date && (
              <div className="space-y-4">
                {getDayTasks(date).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'destructive'
                          : task.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {getDayTasks(date).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No tasks scheduled for this day
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}