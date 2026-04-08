import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import MovieCard from "../MovieCard";

export function MovieRow({ title, movies, type }) {
  const rowRef = useRef(null);

  const scroll = (offset) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 group/row relative px-4 md:px-12">
      <h2 className="text-purple-400 text-lg md:text-2xl font-title font-bold mb-4 flex items-center gap-2 hover:text-white cursor-pointer transition-colors w-fit">
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll(-800)}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-l-md pointer-events-none group-hover/row:pointer-events-auto"
        >
          <ChevronLeft className="text-white" size={32} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type={type} />
          ))}
        </div>

        <button
          onClick={() => scroll(800)}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-r-md pointer-events-none group-hover/row:pointer-events-auto"
        >
          <ChevronRight className="text-white" size={32} />
        </button>
      </div>
    </div>
  );
}
