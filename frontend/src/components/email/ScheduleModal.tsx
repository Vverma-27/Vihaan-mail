"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isBefore, setHours, setMinutes, addMinutes } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
}

export function ScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
}: ScheduleModalProps) {
  const now = new Date();
  const defaultDate = useMemo(() => addMinutes(now, 30), []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || defaultDate
  );
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeSelectorOpen, setIsTimeSelectorOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate || defaultDate);
      setError(null);
    }
  }, [isOpen, initialDate, defaultDate]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const updatedDate = setHours(
        setMinutes(date, selectedDate?.getMinutes() || 0),
        selectedDate?.getHours() || 12
      );
      setSelectedDate(updatedDate);
      setError(null);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (!selectedDate) return;

    let updatedDate = new Date(selectedDate);
    const hour = updatedDate.getHours();
    const minute = updatedDate.getMinutes();

    if (type === "hour") {
      const newHour = parseInt(value, 10);
      updatedDate = setHours(updatedDate, hour >= 12 ? newHour + 12 : newHour);
    } else if (type === "minute") {
      updatedDate = setMinutes(updatedDate, parseInt(value, 10));
    } else if (type === "ampm") {
      if (value === "AM" && hour >= 12)
        updatedDate = setHours(updatedDate, hour - 12);
      if (value === "PM" && hour < 12)
        updatedDate = setHours(updatedDate, hour + 12);
    }

    setSelectedDate(updatedDate);
    setError(null);
  };

  const confirmSchedule = () => {
    if (!selectedDate || isBefore(selectedDate, now)) {
      setError("Please select a valid future date and time.");
      return;
    }
    setError(null);
    onConfirm(selectedDate);
  };

  const timeOptions = {
    hours: Array.from({ length: 12 }, (_, i) => i + 1),
    minutes: Array.from({ length: 12 }, (_, i) => i * 5),
    ampm: ["AM", "PM"],
  };

  const selectedHour = selectedDate ? selectedDate.getHours() % 12 || 12 : 12;
  const selectedMinute = selectedDate
    ? Math.floor(selectedDate.getMinutes() / 5) * 5
    : 0;
  const selectedAmPm =
    selectedDate && selectedDate.getHours() >= 12 ? "PM" : "AM";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 z-[105]">
          <Label className="block text-sm">Pick a date and time:</Label>

          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild className="z-[105]">
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "EEEE, MMM d, yyyy h:mm aa")
                  : "Select a date and time"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[105]">
              <Calendar
                mode="single"
                selected={selectedDate || now}
                onSelect={handleDateChange}
                disabled={(date) => isBefore(date, now)}
              />
            </PopoverContent>
          </Popover>

          <Popover
            open={isTimeSelectorOpen}
            onOpenChange={setIsTimeSelectorOpen}
          >
            <PopoverTrigger asChild className="z-[105]">
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "h:mm aa")
                  : "Select a time"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full z-[105]">
              <div className="flex space-x-4">
                <ScrollArea className="flex-1 h-40 overflow-y-auto">
                  {timeOptions.hours.map((hour) => (
                    <Button
                      key={hour}
                      variant={hour === selectedHour ? "default" : "ghost"}
                      onClick={() => handleTimeChange("hour", hour.toString())}
                      className="w-full"
                    >
                      {hour}
                    </Button>
                  ))}
                </ScrollArea>
                <ScrollArea className="flex-1 h-40 overflow-y-auto">
                  {timeOptions.minutes.map((minute) => (
                    <Button
                      key={minute}
                      variant={minute === selectedMinute ? "default" : "ghost"}
                      onClick={() =>
                        handleTimeChange("minute", minute.toString())
                      }
                      className="w-full"
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </ScrollArea>
                <ScrollArea className="flex-1 h-40 overflow-y-auto">
                  {timeOptions.ampm.map((period) => (
                    <Button
                      key={period}
                      variant={period === selectedAmPm ? "default" : "ghost"}
                      onClick={() => handleTimeChange("ampm", period)}
                      className="w-full"
                    >
                      {period}
                    </Button>
                  ))}
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={confirmSchedule}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
