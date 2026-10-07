import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Person from "./pages/Person";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import Genres from "./pages/Genres";
import Genre from "./pages/Genre";
import Details from "./pages/Details";
import Discover from "./pages/Discover";
import Trending from "./pages/Trending";
import MyList from "./pages/MyList";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<TvShows />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/genre/:type/:id/:name" element={<Genre />} />
          <Route path="/details/:type/:id" element={<Details />} />
          <Route path="/watch/:type/:id" element={<Watch />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/person/:id" element={<Person />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
