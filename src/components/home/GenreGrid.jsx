import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovieGenres, getTvGenres } from "../../services/tmdb";
import { Film, Tv } from "lucide-react";

export function GenreGrid() {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [m, t] = await Promise.all([getMovieGenres(), getTvGenres()]);
        setMovieGenres(m.genres || []);
        setTvGenres(t.genres || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="px-6 md:px-12 py-12 max-w-[1600px] mx-auto">
      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm font-paragraph font-bold uppercase tracking-widest">
            <Film size={14} className="text-purple-500" />
            <span>Movie Genres</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {movieGenres.map((g) => (
              <GenreCard key={g.id} type="movie" genre={g} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm font-paragraph font-bold uppercase tracking-widest">
            <Tv size={14} className="text-purple-500" />
            <span>Series Genres</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {tvGenres.map((g) => (
              <GenreCard key={g.id} type="tv" genre={g} />
            ))}
          </div>
        </section>
      </div >
    </div >
  );
}

function GenreCard({ type, genre }) {
  return (
    <Link
      to={`/genre/${type}/${genre.id}/${encodeURIComponent(genre.name)}`}
      className="group relative h-16 sm:h-20 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden transition-all hover:bg-purple-600 hover:border-purple-500 hover:scale-[1.02] shadow-lg active:scale-95"
    >
      <span className="relative z-10 text-xs sm:text-sm font-title font-bold text-white uppercase tracking-widest group-hover:scale-110 transition-transform">
        {genre.name}
      </span>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
