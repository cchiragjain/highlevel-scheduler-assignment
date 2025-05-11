import { formatISOToHourMinute } from "@/lib/format-iso-to-norm";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SlotSelectorProps {
  slots: string[];
  duration: number;
  onSlotBooked: () => Promise<void>;
  createEvent: (slot: string, duration: number) => Promise<void>;
}

export const SlotSelector = ({
  slots,
  duration,
  onSlotBooked,
  createEvent,
}: SlotSelectorProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);

  const handleBookSlot = async (slot: string) => {
    try {
      setBookingSlot(slot);
      await createEvent(slot, duration);
      toast.success("Event created successfully");
      await onSlotBooked();
    } catch (err) {
      toast.error("Failed to book slot. Please try at a different time");
      console.error(err);
    } finally {
      setBookingSlot(null);
      setSelectedSlot(null);
    }
  };

  if (!slots.length) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Available Slots
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot;
          const isBooking = bookingSlot === slot;
          const disabled = !!bookingSlot;

          return (
            <div
              key={slot}
              className={`flex items-center justify-between rounded-lg border px-4 py-2 transition-colors
                ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-500/40"
                    : "border-gray-200"
                }
                ${!disabled && "hover:bg-blue-50"}
                ${disabled && !isSelected && "opacity-50"}`}
              onClick={() => setSelectedSlot(slot)}
            >
              <button
                type="button"
                disabled={disabled}
                className={`text-sm font-medium ${
                  isSelected ? "text-blue-700" : "text-gray-900"
                }`}
              >
                {formatISOToHourMinute(slot)}
              </button>

              {isSelected && (
                <button
                  type="button"
                  onClick={() => handleBookSlot(slot)}
                  disabled={isBooking}
                  className="ml-2 inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1
                    text-xs font-semibold text-white transition-colors
                    hover:bg-blue-700 disabled:opacity-60"
                >
                  {isBooking ? "Booking…" : "Confirm"}
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
