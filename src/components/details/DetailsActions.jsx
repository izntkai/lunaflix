import { Play, Info, Share2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DetailsActions({ type, id, movie }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center gap-4 py-8">
      <button
        onClick={() => navigate(`/watch/${type}/${id}`)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
      >
        <Play fill="currentColor" size={20} />
        Watch Now
      </button>

      <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all hover:scale-110 text-white group">
        <Plus size={24} className="group-hover:text-purple-400 transition-colors" />
      </button>

      <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all hover:scale-110 text-white">
        <Share2 size={24} />
      </button>
    </div>
  );
}
