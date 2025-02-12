import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="rounded-lg border shadow-md p-6 bg-white dark:bg-gray-900 max-w-2xl mx-auto w-full">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('p-6 w-full', className)}
        classNames={{
          months: 'flex flex-col sm:flex-row gap-6 w-full',
          month: 'space-y-6 w-full',
          caption: 'flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-lg',
          caption_label: 'text-md font-semibold text-gray-700 dark:text-gray-300',
          nav: 'flex items-center space-x-3',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 w-10 rounded-md transition hover:bg-gray-200 dark:hover:bg-gray-700 text-lg'
          ),
          nav_button_previous: 'order-first',
          nav_button_next: 'order-last',
          table: 'w-full border-collapse',
          head_row: 'flex justify-around',
          head_cell: 'text-muted-foreground font-medium text-sm uppercase w-8 text-center',
          row: 'flex justify-around mt-3',
          cell: cn(
            'relative p-2 text-center text-md transition hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md',
            props.mode === 'range'
              ? 'first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
              : '[&:has([aria-selected])]:rounded-md'
          ),
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-12 w-12 rounded-full font-semibold transition aria-selected:opacity-100 text-lg'
          ),
          day_range_start: 'day-range-start',
          day_range_end: 'day-range-end',
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary-600 focus:bg-primary-600 rounded-full',
          day_today: 'bg-accent text-accent-foreground font-bold',
          day_outside:
            'text-gray-400 dark:text-gray-600 opacity-50 aria-selected:bg-accent/50',
          day_disabled: 'text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
