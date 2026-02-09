import { useEffect, useState } from "react";

export default function Header({ trendingMovies }) {
  if (!trendingMovies || trendingMovies.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true); // for fade animation

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
        setFade(true); // fade in new movie
      }, 500); // fade duration
    }, 6000); // change movie every 6 seconds
    return () => clearInterval(interval);
  }, [trendingMovies]);

  const movie = trendingMovies[currentIndex];
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1280x720?text=No+Backdrop";

  const genres = movie.genres?.map((g) => g.name).join(", ") || "N/A";

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden mb-16">
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay + content */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-start p-10 md:p-40">
        <div className="max-w-md flex flex-col justify-center">
          <h1 className="text-2xl md:text-4xl font-title font-bold text-purple-400 drop-shadow-lg mb-2">
            {movie.title}
          </h1>

          {/* Glassmorphism Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-white/10 backdrop-blur-md text-white text-xs md:text-sm px-3 py-1 rounded-full shadow-sm">
              {movie.release_date?.split("-")[0] || "N/A"}
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white text-xs md:text-sm px-3 py-1 rounded-full shadow-sm">
              ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white text-xs md:text-sm px-3 py-1 rounded-full shadow-sm">
              {genres}
            </span>
          </div>

          {/* Overview */}
          <p className="text-white/80 text-xs md:text-sm drop-shadow font-paragraph mb-3">
            {movie.overview}
          </p>

          {/* Watch Now Button */}
          <a
            href={`/watch/${movie.id}`}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium
                       bg-black/40 border border-purple-400 text-white
                       backdrop-blur-md shadow-sm hover:bg-purple-600
                       hover:scale-105 transition-transform duration-200"
          >
            ▶ Watch Now
          </a>
        </div>
      </div>
    </div>
  );
}
