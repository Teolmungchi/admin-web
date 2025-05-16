'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export const DateRangePicker = ({
  className,
  dateRange,
  setDateRange,
  placeholder,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  placeholder?: string;
}) => (
  <div className={cn('grid gap-2', className)}>
    <Popover>
      <PopoverTrigger asChild>
        <Button id="date" variant={'outline'} className={cn('justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}>
          <CalendarIcon />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'y-MM-dd', { locale: ko })} - {format(dateRange.to, 'y-MM-dd', { locale: ko })}
              </>
            ) : (
              format(dateRange.from, 'y-MM-dd', { locale: ko })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  </div>
);
