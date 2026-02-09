export default function MovieCard({ movie, onClick }) {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";
  
    return (
      <div
        onClick={onClick}
        className="cursor-pointer rounded-2xl overflow-hidden shadow-lg
        bg-white/5 backdrop-blur-md border border-white/10 hover:scale-105
        transition-transform duration-300"
      >
        <img src={posterUrl} alt={movie.title} className="w-full h-auto" />
        <div className="p-2 text-center">
          <p className="text-sm font-semibold text-purple-400">{movie.title}</p>
        </div>
      </div>
    );
  }
  