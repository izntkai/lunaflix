import { Star, Clock, Calendar, Globe } from "lucide-react";

export function DetailsHero({ movie, type }) {
  return (
    <div className="relative h-[65vh] md:h-[80vh] w-full mt-4">
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end">
        <div className="hidden md:block w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 md:mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {type === "movie" ? "Movie" : "TV Series"}
            </span>
            {movie.status && (
              <span className="bg-white/10 backdrop-blur-md text-gray-300 px-3 py-1 rounded-full text-xs border border-white/10">
                {movie.status}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-title font-bold text-white drop-shadow-2xl leading-tight">
            {movie.title || movie.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300 font-medium">
            <div className="flex items-center gap-2 text-purple-400">
              <Star size={20} fill="currentColor" />
              <span className="text-white font-bold">{movie.vote_average?.toFixed(1)}</span>
              <span className="text-gray-500">TMDB</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-purple-500/70" />
              {(movie.release_date || movie.first_air_date)?.split("-")[0]}
            </div>

            {type === "movie" && movie.runtime && (
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-purple-500/70" />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </div>
            )}

            {movie.original_language && (
              <div className="flex items-center gap-2 uppercase">
                <Globe size={18} className="text-purple-500/70" />
                {movie.original_language}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {movie.genres?.map((g) => (
              <span key={g.id} className="text-xs md:text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-1.5 rounded-xl transition-colors">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
