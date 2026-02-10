import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Person from "./pages/Person";
import Movies from "./pages/Movies"; 
import TvShows from "./pages/TvShows";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} /> {/* New Route */}
        <Route path="/series" element={<TvShows />} />
        <Route path="/watch/:type/:id" element={<Watch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/person/:id" element={<Person />} />
      </Routes>
    </BrowserRouter>
  );
}