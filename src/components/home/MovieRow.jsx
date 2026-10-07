import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import MovieCard from "../MovieCard";

export function MovieRow({ title, subtitle, movies, type, progressMap = {} }) {
  const rowRef = useRef(null);

  const scroll = (offset) => rowRef.current?.scrollBy({ left: offset, behavior: "smooth" });

  if (!movies?.length) return null;

  return (
    <section className="group/row relative mb-8 px-4 md:px-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#F5F5F5] md:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-[#A1A1AA]">{subtitle}</p>}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll(-680)}
          className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-[#2A2A2F] bg-black/70 p-2 text-white transition hover:border-[#A78BFA] lg:block"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-4 pr-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((movie) => (
            <MovieCard
              key={`${type || movie.media_type || "media"}-${movie.id}`}
              movie={movie}
              type={type || movie.media_type || (movie.name ? "tv" : "movie")}
              progress={progressMap[`${type || movie.media_type || (movie.name ? "tv" : "movie")}:${movie.id}`]}
            />
          ))}
        </div>

        <button
          onClick={() => scroll(680)}
          className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-[#2A2A2F] bg-black/70 p-2 text-white transition hover:border-[#A78BFA] lg:block"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
