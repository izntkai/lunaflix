import { Link } from "react-router-dom";
import { getProfileUrl } from "../../services/tmdb";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CastRow({ cast, castRef, scrollCast }) {
  if (!cast?.length) return null;

  return (
    <div className="relative group/cast-row mt-6">
      <button
        onClick={() => scrollCast('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center bg-black/50 backdrop-blur-xl border border-white/10 text-white rounded-full opacity-0 group-hover/cast-row:opacity-100 transition-all hover:bg-purple-600 hover:scale-110"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        ref={castRef}
        className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth snap-x snap-mandatory px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cast.slice(0, 16).map((person) => (
          <Link
            key={person.id}
            to={`/person/${person.id}`}
            className="group flex-none w-32 md:w-40 snap-start"
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500 transition-all duration-500">
              <img src={getProfileUrl(person.profile_path, 'w185')} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
            </div>
            <div className="mt-3">
              <p className="font-title font-bold text-lg truncate tracking-tight">{person.name}</p>
              <p className="text-[11px] text-white/40 truncate">{person.character}</p>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scrollCast('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center bg-black/50 backdrop-blur-xl border border-white/10 text-white rounded-full opacity-0 group-hover/cast-row:opacity-100 transition-all hover:bg-purple-600 hover:scale-110"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
