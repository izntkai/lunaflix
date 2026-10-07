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
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#A1A1AA]">
          <Film size={14} className="text-[#C4B5FD]" /> Movie Genres
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movieGenres.map((genre) => (
            <GenreCard key={genre.id} type="movie" genre={genre} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#A1A1AA]">
          <Tv size={14} className="text-[#C4B5FD]" /> TV Genres
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tvGenres.map((genre) => (
            <GenreCard key={genre.id} type="tv" genre={genre} />
          ))}
        </div>
      </section>
    </div>
  );
}

function GenreCard({ type, genre }) {
  return (
    <Link
      to={`/genre/${type}/${genre.id}/${encodeURIComponent(genre.name)}`}
      className="rounded-xl border border-[#2A2A2F] bg-[#111114] px-3 py-4 text-center text-sm font-medium text-[#F5F5F5] transition hover:border-[#A78BFA] hover:text-[#C4B5FD]"
    >
      {genre.name}
    </Link>
  );
}
