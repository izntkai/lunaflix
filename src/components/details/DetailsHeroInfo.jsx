import { Star, Clock, Globe, Play, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DetailsHeroInfo({ movie, trailer, type, id }) {
  const navigate = useNavigate();

  return (
    <div className="relative z-20 px-6 md:px-20 pt-20 md:pt-48 pb-16 md:pb-24 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-end">
        {/* Poster Box */}
        <div className="w-53 sm:w-56 md:w-60 shrink-0 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] border border-white/10 z-30 transition-all duration-700 group-hover/hero:scale-105 group-hover/hero:border-purple-500/50">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Box */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
            <span className="bg-purple-600 text-white px-4 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-600/30">
              {type === "movie" ? "Movie" : "Series"}
            </span>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
              <Star size={18} className="text-purple-500" fill="currentColor" />
              <span className="text-white text-base">{movie.vote_average?.toFixed(1)}</span>
              <span className="text-white/40 text-[10px] ml-1">TMDB</span>
            </div>
            <span className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">
              {(movie.release_date || movie.first_air_date)?.split("-")[0]}
            </span>
          </div>

          {movie.images?.logos?.length > 0 ? (
            <div className="flex justify-center md:justify-start">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.images.logos[0].file_path}`}
                alt={movie.title || movie.name}
                className="h-20 sm:h-24 md:h-32 lg:h-40 object-contain drop-shadow-2xl brightness-110"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-7xl font-title font-black text-white tracking-tight leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              {movie.title || movie.name}
            </h1>
          )}

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-5 text-[11px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-purple-500" />
              {type === "movie" && movie.runtime
                ? `${Math.floor(movie.runtime / 60)}H ${movie.runtime % 60}M`
                : movie.episode_run_time?.[0]
                  ? `${movie.episode_run_time[0]} MIN`
                  : "-"}
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-purple-500" />
              {movie.original_language}
            </div>
            {movie.status && <span className="text-purple-500/80">{movie.status}</span>}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-3">
            <button
              onClick={() => navigate(`/watch/${type}/${id}`)}
              className="flex items-center gap-3 bg-white text-black font-black px-10 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 group/btn"
            >
              <Play fill="currentColor" size={20} className="group-hover/btn:scale-110 transition-transform" />
              WATCH NOW
            </button>

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black px-8 py-4 rounded-full transition-all"
              >
                <Video size={20} />
                TRAILER
              </a>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2 pb-4 md:pb-0">
            {movie.genres?.map((g) => (
              <button
                key={g.id}
                onClick={() => navigate(`/genre/${type === 'movie' ? 'movie' : 'tv'}/${g.id}/${encodeURIComponent(g.name)}`)}
                className="text-[10px] font-black uppercase text-gray-400 border border-white/5 bg-white/5 px-4 py-1.5 rounded-lg hover:border-purple-500 hover:text-white hover:bg-purple-500/10 transition-all cursor-pointer"
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
