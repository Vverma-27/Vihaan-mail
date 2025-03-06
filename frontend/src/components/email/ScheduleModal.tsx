import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, addDays, setHours, setMinutes, addHours } from "date-fns";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export function ScheduleModal({
  isOpen,
  onClose,
  onConfirm,
}: ScheduleModalProps) {
  const now = new Date();
  const tomorrow = addDays(now, 1);

  const [selectedDate, setSelectedDate] = useState<string>("later-today");
  const [selectedHour, setSelectedHour] = useState<string>(
    format(addHours(now, 1), "HH")
  );
  const [selectedMinute, setSelectedMinute] = useState<string>(
    format(now, "mm")
  );

  const handleConfirm = () => {
    let scheduledTime: Date;

    switch (selectedDate) {
      case "later-today":
        scheduledTime = setHours(
          setMinutes(new Date(), parseInt(selectedMinute, 10)),
          parseInt(selectedHour, 10)
        );
        break;
      case "tomorrow":
        scheduledTime = setHours(
          setMinutes(tomorrow, parseInt(selectedMinute, 10)),
          parseInt(selectedHour, 10)
        );
        break;
      default:
        scheduledTime = setHours(
          setMinutes(new Date(), parseInt(selectedMinute, 10)),
          parseInt(selectedHour, 10)
        );
    }

    onConfirm(scheduledTime);
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule send</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Send date</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="later-today">Later today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label>Hour</Label>
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label>Minute</Label>
              <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                <SelectTrigger>
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 text-sm text-gray-600">
            {selectedDate === "later-today" ? "Today" : "Tomorrow"} at{" "}
            {selectedHour}:{selectedMinute}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
