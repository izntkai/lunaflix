import { useNavigate } from "react-router-dom";
import { Play, Info, Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export function Hero({ movie }) {
  const navigate = useNavigate();
  if (!movie) return <div className="h-[60vh] w-full bg-[#1a1a1a] animate-pulse rounded-2xl mx-4 mt-24" />;

  const mediaType = movie.media_type || (movie.name ? "tv" : "movie");

  return (
    <div className="pb-6 px-4 md:px-8 max-w-450 mx-auto">
      <div className="relative h-[55vh] md:h-[65vh] w-full rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] group border border-white/5 bg-[#141414]">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0"
        >
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover opacity-90"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        <div className="absolute bottom-0 top-0 left-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 text-xs font-semibold tracking-wide"
          >
            <span className="font-paragraph bg-purple-500 text-black px-2 py-0.5 rounded">FEATURED</span>
            <span className="font-paragraph flex items-center gap-1 text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
              <Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
            </span>
            <span className="font-paragraph text-gray-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
              <Calendar size={12} /> {(movie.release_date || movie.first_air_date)?.split("-")[0]}
            </span>
            {mediaType === 'tv' && (
              <span className="font-paragraph text-gray-300 border border-gray-600 px-2 py-0.5 rounded uppercase">TV Series</span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-title font-bold text-white leading-[1.1] drop-shadow-xl"
          >
            {movie.title || movie.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-paragraph text-gray-300 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed max-w-lg"
          >
            {movie.overview}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 pt-2"
          >
            <button
              onClick={() => navigate(`/details/${mediaType}/${movie.id}`)}
              className="font-title flex items-center gap-2 bg-purple-500 text-black px-6 py-3 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-bold text-sm md:text-base shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Play size={20} fill="currentColor" /> Watch Now
            </button>
            <button
              className="font-title flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-sm md:text-base"
            >
              <Info size={20} /> Details
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
