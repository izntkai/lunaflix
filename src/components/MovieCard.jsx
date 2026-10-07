import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Play, Plus, Check } from "lucide-react";
import { isInMyList, toggleMyList } from "../services/library";

export default function MovieCard({ movie, type = "movie", progress, compact = false }) {
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);
  const mediaType = type || movie.media_type || (movie.name ? "tv" : "movie");

  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date)?.split("-")[0] || "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const safeProgress = useMemo(() => {
    if (typeof progress !== "number") return null;
    return Math.max(0, Math.min(100, progress));
  }, [progress]);

  useEffect(() => {
    const sync = () => setInList(isInMyList(movie.id, mediaType));
    sync();
    window.addEventListener("lunaflix-library-update", sync);
    return () => window.removeEventListener("lunaflix-library-update", sync);
  }, [movie.id, mediaType]);

  const handleToggleList = (event) => {
    event.stopPropagation();
    toggleMyList({
      id: movie.id,
      type: mediaType,
      title,
      name: movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      first_air_date: movie.first_air_date,
    });
  };

  return (
    <article
      onClick={() => navigate(`/details/${mediaType}/${movie.id}`)}
      className={`group relative flex-none ${compact ? "w-34 md:w-40" : "w-40 md:w-48 lg:w-52"} aspect-[2/3] cursor-pointer overflow-hidden rounded-2xl border border-[#2A2A2F] bg-[#18181C] transition-all duration-300 hover:-translate-y-1 hover:border-[#A78BFA]/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]`}
    >
      <img src={posterUrl} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />

      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
        <p className="truncate text-sm font-semibold text-[#F5F5F5]">{title}</p>
        <div className="mt-1 flex items-center justify-between text-[11px] text-[#A1A1AA]">
          <span>{year}</span>
          <span className="flex items-center gap-1 text-[#C4B5FD]">
            <Star size={12} fill="currentColor" /> {rating}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 hidden items-center justify-center bg-black/40 opacity-0 transition group-hover:flex group-hover:opacity-100">
        <span className="rounded-full bg-[#A78BFA] p-3 text-black shadow-lg">
          <Play size={18} fill="currentColor" />
        </span>
      </div>

      <button
        type="button"
        onClick={handleToggleList}
        aria-label={inList ? "Remove from my list" : "Add to my list"}
        className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/55 p-2 text-[#F5F5F5] backdrop-blur hover:border-[#C4B5FD]/70 hover:text-[#C4B5FD]"
      >
        {inList ? <Check size={14} /> : <Plus size={14} />}
      </button>

      {safeProgress !== null && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
          <div className="h-full bg-[#A78BFA]" style={{ width: `${safeProgress}%` }} />
        </div>
      )}
    </article>
  );
}
