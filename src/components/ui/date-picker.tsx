
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  className?: string;
  mode?: "default" | "month"; // Add mode option
}

export function DatePicker({ date, setDate, className, mode = "default" }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            mode === "month" ? 
            format(date, "MMMM yyyy") : 
            format(date, "PPP")
          ) : (
            <span>Pick a {mode === "month" ? "month" : "date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode === "month" ? "range" : "single"} 
          selected={date}
          onSelect={(date) => date && setDate(date)}
          initialFocus
          className="p-3 pointer-events-auto"
          fromMonth={mode === "month" ? new Date(date.getFullYear(), 0) : undefined}
          toMonth={mode === "month" ? new Date(date.getFullYear(), 11) : undefined}
          captionLayout={mode === "month" ? "dropdown-buttons" : "buttons"}
          // Hide day selection for month picker
          hidden={mode === "month" ? { day: true } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
