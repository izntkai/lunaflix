import { useNavigate } from "react-router-dom";
import { Play, Plus, Star } from "lucide-react";
import { toggleMyList } from "../../services/library";

export function Hero({ movie }) {
  const navigate = useNavigate();

  if (!movie) {
    return <div className="mx-4 mt-6 h-[58vh] animate-pulse rounded-3xl bg-[#18181C] md:mx-10" />;
  }

  const mediaType = movie.media_type || (movie.name ? "tv" : "movie");
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const runtime = movie.runtime || movie.episode_run_time?.[0];

  const handleAdd = () => {
    toggleMyList({
      id: movie.id,
      type: mediaType,
      title: movie.title,
      name: movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      first_air_date: movie.first_air_date,
    });
  };

  return (
    <section className="mx-4 mt-6 rounded-3xl border border-[#2A2A2F] bg-[#111114] md:mx-10">
      <div className="relative min-h-[62vh] overflow-hidden rounded-3xl">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-[#050505]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />

        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end gap-5 p-6 pb-10 md:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4D4D8]">
            <span className="rounded-full bg-[#A78BFA]/20 px-3 py-1 font-semibold text-[#C4B5FD]">{mediaType.toUpperCase()}</span>
            <span className="flex items-center gap-1 rounded-full bg-black/35 px-3 py-1">
              <Star size={12} fill="currentColor" className="text-[#C4B5FD]" />
              {movie.vote_average?.toFixed(1)}
            </span>
            {year && <span>{year}</span>}
            {runtime ? <span>{runtime} min</span> : null}
          </div>

          <h1 className="text-3xl font-bold leading-tight text-[#F5F5F5] md:text-5xl">{title}</h1>

          <p className="max-w-2xl text-sm leading-relaxed text-[#D4D4D8] md:text-base">
            {movie.overview || "No description available."}
          </p>

          <div className="flex flex-wrap gap-2">
            {(movie.genres || []).slice(0, 4).map((genre) => (
              <span key={genre.id} className="rounded-full border border-[#2A2A2F] bg-black/35 px-3 py-1 text-xs text-[#A1A1AA]">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => navigate(`/watch/${mediaType}/${movie.id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#A78BFA] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#C4B5FD]"
            >
              <Play size={16} fill="currentColor" /> Watch Now
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2A2A2F] bg-black/40 px-5 py-3 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#A78BFA]"
            >
              <Plus size={16} /> Add to My List
            </button>
            <button
              onClick={() => navigate(`/details/${mediaType}/${movie.id}`)}
              className="rounded-xl border border-[#2A2A2F] bg-[#18181C]/70 px-5 py-3 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#A78BFA]"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
