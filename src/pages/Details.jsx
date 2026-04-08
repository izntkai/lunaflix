import { useMovieDetails } from "../hooks/useMovieDetails";
import { DetailsHero } from "../components/details/DetailsHero";
import { CastRow } from "../components/details/CastRow";
import { Recommendations } from "../components/details/Recommendations";
import { motion, AnimatePresence } from "framer-motion";

export default function Details() {
  const {
    details, videos, recommendations, loading, activeTab, setActiveTab,
    isMuted, setIsMuted, playerRef, castRef, toggleMute, scrollCast, type, id
  } = useMovieDetails();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="h-12 w-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  if (!details) return null;

  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-purple-600/50 px-4 md:px-20">
      <DetailsHero
        details={details}
        trailer={trailer}
        type={type}
        id={id}
        isMuted={isMuted}
        toggleMute={toggleMute}
        setIsMuted={setIsMuted}
        playerRef={playerRef}
      />

      <div className="max-w-6xl mx-auto w-full px-0 py-10">
        <div className="flex font-title gap-8 mb-8 border-b border-white/5 pb-1">
          {['overview', 'cast', 'videos'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`relative pb-3 text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white'}`}>
              {tab}
              {activeTab === tab && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-full" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-title mb-4 flex items-center gap-2">THE STORY</h2>
                  <p className="text-white/90 text-lg leading-relaxed">{details.overview}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                  {[
                    { label: 'Status', value: details.status },
                    { label: 'Language', value: details.original_language?.toUpperCase() },
                    { label: 'Budget', value: details.budget > 0 ? `$${(details.budget / 1000000).toFixed(1)}M` : 'N/A' },
                    { label: 'Revenue', value: details.revenue > 0 ? `$${(details.revenue / 1000000).toFixed(1)}M` : 'N/A' }
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">{stat.label}</p>
                      <p className="font-title font-bold text-base">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1 space-y-8">
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                  <h4 className="text-xs font-black uppercase text-purple-400 tracking-[0.2em] mb-4">Production</h4>
                  <div className="text-sm text-white/70 space-y-3">
                    {details.production_companies?.slice(0, 4).map(c => (
                      <p key={c.id} className="flex items-center gap-2">
                        <span className="h-1 w-1 bg-white/30 rounded-full" /> {c.name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cast' && (
            <CastRow cast={details.credits?.cast} castRef={castRef} scrollCast={scrollCast} />
          )}
        </AnimatePresence>

        <Recommendations recommendations={recommendations} type={type} />
      </div>
    </div>
  );
}
