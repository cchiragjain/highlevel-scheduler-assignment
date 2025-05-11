import { TIMEZONES } from "@/constants/timezones";
import { Calendar, Clock, Globe } from "lucide-react";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker from "react-datepicker";

export const BookEvent = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState(30);
  const [timeZone, setTimeZone] = useState<string>(TIMEZONES[0]);

  return (
    <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Event</h1>

      <div className="space-y-4 flex gap-6 items-center">
        {/* datepicker */}
        <div className="flex gap-4 mb-0">
          <div className="flex items-center justify-start">
            <Calendar className="w-4 h-4 mr-2" />
            <label className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showMonthDropdown={true}
            showYearDropdown={true}
            dateFormat="YYYY-MM-dd"
            dropdownMode="select"
            minDate={new Date()} // cant book events in past
            placeholderText="Select appointment date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* duration input */}
        <div className="flex gap-4 mb-0">
          <div className="flex items-center justify-start">
            <Clock className="w-6 h-6 mr-2" />
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
          </div>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* timezone select input */}
        <div className="flex gap-4 mb-0">
          <div className="flex items-center justify-start">
            <Globe className="w-4 h-4 mr-2" />
            <label className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
          </div>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
