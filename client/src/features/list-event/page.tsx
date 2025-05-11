import { listEvents } from "@/api/events";
import {
  formatISOToDate,
  formatISOToHourMinute,
} from "@/lib/format-iso-to-norm";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";

interface Event {
  startTime: string;
  endTime: string;
  duration: number;
}

export const ListEvent = () => {
  const todayDate = new Date();

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(todayDate.getDate() + 7);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    todayDate,
    sevenDaysLater,
  ]);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const [startDate, endDate] = dateRange;

  const fetchEvents = async () => {
    if (!startDate || !endDate) {
      toast.info("Please select date");
      return;
    }
    setLoading(true);
    try {
      const data = await listEvents(
        startDate.toISOString(),
        endDate.toISOString()
      );

      setEvents(data);
    } catch (error) {
      console.error(error);
      toast.error("Cant fetch events right now. Please try later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">List Events</h1>

      <div className="mb-4">
        {/* daterange picker */}
        <div className="grid grid-cols-5 gap-6 mb-0">
          <div className="col-span-1 flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-2" />
            <label className="block text-sm font-medium text-gray-700">
              Select Dates
            </label>
          </div>
          <div className="col-span-4">
            <DatePicker
              selectsRange={true}
              showMonthDropdown={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              showYearDropdown={true}
              dateFormat="YYYY-MM-dd"
              dropdownMode="select"
              minDate={new Date()} // cant book events in past
              placeholderText="Select date range"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              wrapperClassName="w-full"
            />
          </div>
        </div>
      </div>
      {loading && (
        <div className="space-y-4 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="animate-pulse space-y-2">
                <div className="h-6 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="max-h-96 overflow-y-auto pr-2">
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={`${event.startTime}_${event.endTime}_${event.duration}`}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">
                      {formatISOToDate(event.startTime)}
                    </p>
                    <p className="text-gray-600">
                      {formatISOToHourMinute(event.startTime)} -{" "}
                      {formatISOToHourMinute(event.endTime)}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {event.duration} minutes
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          startDate &&
          endDate &&
          !loading && (
            <div className="text-center py-4 text-gray-500">
              No events found for the selected date range
            </div>
          )
        )}
      </div>
    </div>
  );
};
