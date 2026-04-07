import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Person from "./pages/Person";
import Movies from "./pages/Movies"; 
import TvShows from "./pages/TvShows";
import Details from "./pages/Details";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<TvShows />} />
          <Route path="/details/:type/:id" element={<Details />} />
          <Route path="/watch/:type/:id" element={<Watch />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/person/:id" element={<Person />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}