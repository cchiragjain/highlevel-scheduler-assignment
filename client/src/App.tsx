import { Route, Routes } from "react-router-dom";
import { BookEvent } from "./features/book-event";
import { ListEvent } from "./features/list-event";

function App() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <Routes>
        <Route path="/" element={<BookEvent />} />
        <Route path="/list-events" element={<ListEvent />} />
      </Routes>
    </main>
  );
}

export default App;
