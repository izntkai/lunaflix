import { Link } from "react-router-dom";
import { getPosterUrl } from "../../services/tmdb";

export function Recommendations({ recommendations, type }) {
  if (!recommendations?.length) return null;

  return (
    <div className="mt-20 pt-10 border-t border-white/5">
      <h2 className="text-2xl font-bold font-title uppercase tracking-tight mb-8">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {recommendations.map(item => (
          <Link key={item.id} to={`/details/${item.media_type || type}/${item.id}`} className="group">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500 transition-all duration-500">
              <img src={getPosterUrl(item.poster_path, 'w300')} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                <p className="text-[10px] font-black uppercase truncate">{item.title || item.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
