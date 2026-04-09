import { useNavigate } from "react-router-dom";
import { Star, Play } from "lucide-react";

export default function MovieCard({ movie, type = "movie" }) {
  const navigate = useNavigate();
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const rating = movie.vote_average?.toFixed(1) || "N/A";
  const year = (movie.release_date || movie.first_air_date)?.split("-")[0] || "N/A";

  return (
    <div
      onClick={() => navigate(`/details/${type}/${movie.id}`)}
      className="flex-none w-36 md:w-44 lg:w-52 aspect-[2/3] cursor-pointer rounded-2xl overflow-hidden shadow-lg
      bg-[#1a1a1a] border border-white/5 hover:border-purple-500/50 hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 group relative"
    >
      <img 
        src={posterUrl} 
        alt={movie.title || movie.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 md:p-4">
        
        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1">
            <Play fill="white" className="text-white w-6 h-6 md:w-8 md:h-8" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-sm md:text-base font-bold text-white truncate mb-1.5">{movie.title || movie.name}</h3>
          
          <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-1.5 text-purple-400">
              <Star size={14} fill="currentColor" />
              <span>{rating}</span>
            </div>
            <span className="text-gray-200">{year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
  