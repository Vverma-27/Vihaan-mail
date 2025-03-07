"use client";

import { useState, useEffect } from "react";
import { format, isBefore } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || now
  );
  const [error, setError] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate || now);
      setError(null);
    }
  }, [isOpen, initialDate]);

  const confirmSchedule = () => {
    if (!selectedDate || isBefore(selectedDate, now)) {
      setError("Please select a valid future date and time.");
      return;
    }
    setError(null);
    onConfirm(selectedDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 z-[105]">
          <Label className="block text-sm">Pick a date and time:</Label>

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild className="z-[105]">
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "EEEE, MMM d, yyyy h:mm aa")
                  : "Select date & time"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[105]">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                showTimeSelect
                timeIntervals={5}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={now}
                className="w-full p-2 border rounded-md"
              />
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
