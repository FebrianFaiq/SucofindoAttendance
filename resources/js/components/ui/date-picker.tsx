import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date;
    setDate: (date?: Date) => void;
    placeholder?: string;
    className?: string;
    holidays?: { date: string; name: string }[];
}

export function DatePicker({ date, setDate, placeholder = "Pilih tanggal", className, holidays = [] }: DatePickerProps) {
  // Convert holiday strings to Date objects for react-day-picker modifiers
  const holidayDates = React.useMemo(
    () => holidays.map(h => new Date(h.date + 'T00:00:00')),
    [holidays]
  );

  // Weekend matcher: Saturday (6) and Sunday (0)
  const weekendMatcher = { dayOfWeek: [0, 6] };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal bg-white h-10 border-neutral-200",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: id }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          autoFocus
          locale={id}
          modifiers={{
            holiday: holidayDates,
            weekend: weekendMatcher,
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
