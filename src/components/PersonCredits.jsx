import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Film, Tv, LayoutGrid } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function PersonCredits({ credits }) {
  const [activeCategory, setActiveCategory] = useState("directing");
  const [mediaFilter, setMediaFilter] = useState("all");

  const categories = useMemo(() => {
    if (!credits) return [];
    return [
      { id: "directing", label: "Directing", data: credits.directing },
      { id: "writing", label: "Writing", data: credits.writing },
      { id: "acting", label: "Acting", data: credits.acting },
      { id: "cinematography", label: "Cinematography", data: credits.cinematography },
      { id: "production", label: "Production", data: credits.production },
    ].filter(cat => cat.data?.length > 0);
  }, [credits]);

  const resolvedCategory = categories.find((category) => category.id === activeCategory)?.id || categories[0]?.id;

  const currentItems = useMemo(() => {
    const data = credits?.[resolvedCategory] || [];
    if (mediaFilter === "all") return data;
    return data.filter(item => item.media_type === mediaFilter);
  }, [credits, resolvedCategory, mediaFilter]);

  if (!categories.length) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/5 pb-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                activeTabStyle(activeCategory === cat.id)
              }`}
            >
              {cat.label.toUpperCase()} ({cat.data.length})
            </button>
          ))}
        </div>

        {/* Media Filter */}
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-lg">
            {[
              { id: "all", label: "All", icon: <LayoutGrid size={12} /> },
              { id: "movie", label: "Movies", icon: <Film size={12} /> },
              { id: "tv", label: "TV Shows", icon: <Tv size={12} /> },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setMediaFilter(f.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] font-bold transition-colors ${
                  mediaFilter === f.id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {f.icon} {f.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <div 
          key={`${resolvedCategory}-${mediaFilter}`}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {currentItems.length > 0 ? (
            currentItems.map((media) => (
              <CreditCard key={`${media.media_type}-${media.id}`} media={media} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </AnimatePresence>
    </section>
  );
}

function activeTabStyle(isActive) {
  return isActive 
    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20" 
    : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white";
}

function CreditCard({ media }) {
  return (
    <Link to={`/watch/${media.media_type}/${media.id}`} className="group flex flex-col gap-2">
      <div className="aspect-2/3 relative overflow-hidden rounded-xl border border-white/5 group-hover:border-purple-500 transition-colors">
        <img 
          src={`https://image.tmdb.org/t/p/w300${media.poster_path}`}
          alt={media.title || media.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold border border-white/10">
          {media.vote_average?.toFixed(1) || "N/A"}
        </div>
        {media.media_type === "tv" && (
          <div className="absolute bottom-2 left-2 bg-purple-600 px-1.5 py-0.5 rounded text-[7px] font-black tracking-tighter">TV</div>
        )}
      </div>
      <div className="px-1">
        <p className="text-[11px] font-title font-semibold truncate text-white leading-tight">
          {media.title || media.name}
        </p>
        <p className="text-[9px] font-paragraph text-gray-500 truncate mt-0.5">
          {media.displayRole}
        </p>
        <p className="text-[9px] font-paragraph text-purple-400 font-medium">
          {(media.release_date || media.first_air_date)?.split("-")[0] || "N/A"}
        </p>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
      <p className="text-gray-500 text-xs font-medium">No results found for this filter.</p>
    </div>
  );
}
