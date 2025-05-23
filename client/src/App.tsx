import { Calendar, Clock } from "lucide-react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { BookEvent } from "./features/book-event";
import { ListEvent } from "./features/list-event";
import { cn } from "./lib/utils";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600",
                  location.pathname === "/" &&
                    "text-blue-600 border-b-2 border-blue-500"
                )}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Event
              </Link>
              <Link
                to="/events"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600",
                  location.pathname === "/events" &&
                    "text-blue-600 border-b-2 border-blue-500"
                )}
              >
                <Clock className="w-5 h-5 mr-2" />
                Show Events
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<BookEvent />} />
          <Route path="/events" element={<ListEvent />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
