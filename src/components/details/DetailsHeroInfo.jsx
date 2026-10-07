import { Star, Clock, Globe, Play, Video, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleMyList } from "../../services/library";

export function DetailsHeroInfo({ movie, trailer, type, id }) {
  const navigate = useNavigate();

  const addToList = () => {
    toggleMyList({
      id: movie.id,
      type,
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
    <div className="relative z-20 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-24 md:px-20 md:pt-48">
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-end md:gap-12">
        <div className="w-52 shrink-0 overflow-hidden rounded-2xl border border-[#2A2A2F] shadow-[0_30px_80px_rgba(0,0,0,0.8)] md:w-56">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title || movie.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex-1 space-y-5 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <span className="rounded-full bg-[#A78BFA]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#C4B5FD]">
              {type === "movie" ? "Movie" : "TV Show"}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-sm text-[#F5F5F5]">
              <Star size={14} className="text-[#C4B5FD]" fill="currentColor" />
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-sm text-[#A1A1AA]">{(movie.release_date || movie.first_air_date || "").slice(0, 4)}</span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-[#F5F5F5] md:text-6xl">{movie.title || movie.name}</h1>

          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#D4D4D8] md:mx-0 md:text-base">{movie.overview}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.12em] text-[#A1A1AA] md:justify-start">
            <span className="flex items-center gap-2"><Clock size={13} className="text-[#C4B5FD]" />
              {type === "movie" && movie.runtime ? `${movie.runtime} min` : `${movie.episode_run_time?.[0] || "-"} min`}
            </span>
            <span className="flex items-center gap-2"><Globe size={13} className="text-[#C4B5FD]" />{movie.original_language}</span>
            {movie.status ? <span>{movie.status}</span> : null}
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <button
              onClick={() => navigate(`/watch/${type}/${id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#A78BFA] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#C4B5FD]"
            >
              <Play fill="currentColor" size={16} /> Watch Now
            </button>
            <button
              onClick={addToList}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2A2A2F] bg-[#111114] px-6 py-3 text-sm font-semibold text-[#F5F5F5] hover:border-[#A78BFA]"
            >
              <Plus size={16} /> Add to My List
            </button>
            {trailer ? (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2A2A2F] bg-black/50 px-6 py-3 text-sm font-semibold text-[#F5F5F5] hover:border-[#A78BFA]"
              >
                <Video size={16} /> Trailer
              </a>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {movie.genres?.map((genre) => (
              <button
                key={genre.id}
                onClick={() => navigate(`/genre/${type === "movie" ? "movie" : "tv"}/${genre.id}/${encodeURIComponent(genre.name)}`)}
                className="rounded-full border border-[#2A2A2F] bg-black/35 px-3 py-1 text-xs text-[#A1A1AA] hover:border-[#A78BFA] hover:text-[#F5F5F5]"
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
