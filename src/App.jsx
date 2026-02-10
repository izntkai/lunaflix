import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Person from "./pages/Person";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Updated: Now accepts :type (movie/tv) and :id */}
        <Route path="/watch/:type/:id" element={<Watch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/person/:id" element={<Person />} />
      </Routes>
    </BrowserRouter>
  );
}