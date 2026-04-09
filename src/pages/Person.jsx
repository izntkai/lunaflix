import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPersonDetails } from "../services/tmdb";
import { ArrowLeft, Loader2, Film, MapPin, Calendar, Tv } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { usePersonCredits } from "../hooks/usePersonCredits";
import { PersonCredits } from "../components/PersonCredits";

export default function Person() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getPersonDetails(id).then((data) => {
      setPerson(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
    </div>
  );

  const credits = usePersonCredits(person);

  return (
    <div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(145, 70, 255, 0.3); border-radius: 10px; }
      `}</style>
    <div className="px-4 pb-8 max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-xs text-gray-500 hover:text-white transition group cursor-pointer">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Profile Card */}
          <div className="w-full md:w-56 shrink-0 space-y-4">
            <div className="relative group">
              <img 
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
                className="w-40 md:w-full mx-auto rounded-xl shadow-xl border border-white/5 object-cover aspect-2/3"
              />
            </div>
            
            <div className="hidden md:block bg-white/5 p-3 rounded-xl border border-white/5 space-y-3">
              <div>
                <span className="font-title text-gray-500 block uppercase text-[9px] font-bold tracking-tighter">Born</span>
                <p className="text-xs">{person.birthday || "N/A"}</p>
              </div>
              <div>
                <span className="font-subtitle text-gray-500 block uppercase text-[9px] font-bold tracking-tighter">Place of Birth</span>
                <p className="text-xs leading-tight">{person.place_of_birth || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 min-w-0 space-y-6">
            <header className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-title font-bold tracking-tight text-center md:text-left">
                {person.name}
              </h1>
              
              <div className="font-subtitle flex md:hidden items-center justify-center gap-4 text-[11px] text-gray-400 border-y border-white/5 py-2">
                <span className="flex items-center gap-1"><Calendar size={12}/> {person.birthday || "N/A"}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {person.place_of_birth?.split(',').pop() || "N/A"}</span>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                <h3 className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-2">Biography</h3>
                <div className="max-h-32 md:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  <p className="font-paragraph text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {person.biography || `No biography available for ${person.name}.`}
                  </p>
                </div>
              </div>
            </header>

            <PersonCredits credits={credits} />
          </div>
        </div>
      </div>
    </div>
  );
}