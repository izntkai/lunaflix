import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export const CrewCard = ({ label, person, fallbackName = "Unknown" }) => (
  <Link 
    to={person?.id ? `/person/${person.id}` : "#"} 
    className={`flex items-center gap-3 min-w-0 group ${!person?.id && 'pointer-events-none'}`}
  >
    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-[10px] text-white/40 font-semibold shrink-0 group-hover:border-purple-500/50 transition-colors">
      {person?.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
          alt={person?.name || label}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        "N/A"
      )}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-white/35 uppercase tracking-wide font-semibold leading-none mb-1">{label}</p>
      <p className="text-sm text-white font-semibold truncate group-hover:text-purple-400 transition-colors">{person?.name || fallbackName}</p>
    </div>
  </Link>
);

export const CastScroll = ({ cast, isTv }) => (
  <div className="pt-6 border-t border-white/5">
    <h3 className="text-2xl font-semibold mb-4 text-white font-title flex items-center gap-2">
      <Users size={17} className="text-white/80" />
      {isTv ? "Episode Cast & Regulars" : "Top Cast"}
    </h3>
    <div className="flex overflow-x-auto gap-3 pb-4 custom-cast-scrollbar">
      {cast?.map((person) => (
        <Link 
          key={person.id} 
          to={`/person/${person.id}`}
          className="flex-shrink-0 w-[78px] md:w-[86px] group text-left block"
        >
          <div className="aspect-square rounded-xl overflow-hidden mb-2 border border-white/10 group-hover:border-purple-500/60 transition-colors">
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                alt={person.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-900/80 flex items-center justify-center text-xs font-semibold text-white/70">N/A</div>
            )}
          </div>
          <p className="text-[11px] font-semibold text-white truncate leading-tight group-hover:text-purple-300 transition-colors">{person.name}</p>
          <p className="text-[10px] text-white/40 truncate italic">{person.character}</p>
        </Link>
      ))}
    </div>
  </div>
);
