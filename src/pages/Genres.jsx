import { GenreGrid } from "../components/home/GenreGrid";
import { LayoutGroup, motion } from "framer-motion";

export default function Genres() {
  return (
    <div className="pb-20 mt-24">
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h1 className="text-3xl md:text-5xl font-title font-black text-white uppercase tracking-tighter">
              Explore <span className="text-purple-500">Genres</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm md:text-base font-paragraph font-medium max-w-2xl">
            Discover your next favorite movie or series by browsing our curated categories. From high-octane action to heartwarming dramas.
          </p>
        </motion.div>
      </div>

      <LayoutGroup>
        <div className="mt-4">
          <GenreGrid />
        </div>
      </LayoutGroup>
    </div>
  );
}
