import { useNavigate } from "react-router-dom";

export function CastList({ cast }) {
  const navigate = useNavigate();
  if (!cast?.length) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-title font-bold flex items-center gap-3">
        <span className="w-2 h-8 bg-purple-500 rounded-full" />
        Top Cast
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {cast.map((person) => (
          <div
            key={person.id}
            className="flex-none w-32 cursor-pointer group"
            onClick={() => navigate(`/person/${person.id}`)}
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-white/5 ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all">
              <img
                src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : "https://via.placeholder.com/185x278?text=No+Image"}
                alt={person.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
              />
            </div>
            <p className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-purple-400 transition-colors">{person.name}</p>
            <p className="text-xs text-gray-500 line-clamp-1 italic">{person.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
