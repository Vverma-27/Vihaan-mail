"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  hours: number;
  minutes: number;
  setHours: (hours: number) => void;
  setMinutes: (minutes: number) => void;
}

export function TimePickerDemo({
  hours,
  minutes,
  setHours,
  setMinutes,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Format hours and minutes for display
  const displayTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 23) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[180px] justify-start text-left font-normal",
            !displayTime && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-4">
          <div className="grid gap-2">
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              className="w-16 tabular-nums"
              value={hours.toString().padStart(2, "0")}
              onChange={handleHoursChange}
              type="number"
              min={0}
              max={23}
              step={1}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="minutes">Minutes</Label>
            <Input
              id="minutes"
              className="w-16 tabular-nums"
              value={minutes.toString().padStart(2, "0")}
              onChange={handleMinutesChange}
              type="number"
              min={0}
              max={59}
              step={1}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
