import { Filter, ChevronDown, Star, Clock, Activity } from "lucide-react";
import { languages, minRatingOptions, runtimeOptions, statusOptions } from "./FilterBar.constants";

// Static Data: Years from Current Year down to 1900
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

function FilterSelect({ value, onChange, options, placeholder, icon: Icon, colorClass }) {
  return (
    <div className="relative">
      {Icon && (
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${colorClass} pointer-events-none`}>
          <Icon size={14} fill={Icon === Star ? "currentColor" : "none"} />
        </div>
      )}
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className={`w-full bg-[#1a1a1a] text-xs md:text-sm text-gray-300 py-3 ${Icon ? 'pl-9' : 'px-4'} pr-8 rounded-xl appearance-none border border-white/5 hover:border-white/20 focus:border-purple-500 focus:text-white outline-none cursor-pointer transition-all`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.id || opt.code || opt.value || opt} value={opt.id || opt.code || opt.value || opt}>
            {opt.name || opt.label || opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
    </div>
  );
}

export default function FilterBar({ 
  genres, 
  selectedGenre, setSelectedGenre,
  selectedYear, setSelectedYear,
  selectedLanguage, setSelectedLanguage,
  minRating, setMinRating,
  selectedExtra, setSelectedExtra, 
  type = "movie" 
}) {
  
  const handleReset = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedLanguage("");
    if (setMinRating) setMinRating("");
    if (setSelectedExtra) setSelectedExtra(""); 
  };

  return (
    <div className="font-title grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 bg-[#0f0f0f]/95 backdrop-blur-xl p-4 border border-white/5 rounded-2xl shadow-2xl">
      <FilterSelect value={selectedGenre} onChange={setSelectedGenre} options={genres} placeholder="All Genres" />
      <FilterSelect value={selectedYear} onChange={setSelectedYear} options={years} placeholder={type === "movie" ? "All Years" : "First Aired"} />
      <FilterSelect value={selectedLanguage} onChange={setSelectedLanguage} options={languages} placeholder="Global (All)" />
      
      <FilterSelect 
        value={minRating} 
        onChange={setMinRating} 
        options={minRatingOptions} 
        placeholder="Any Rating" 
        icon={Star} 
        colorClass="text-yellow-500" 
      />

      <FilterSelect 
        value={selectedExtra} 
        onChange={setSelectedExtra} 
        options={type === "movie" ? runtimeOptions : statusOptions} 
        placeholder={type === "movie" ? "Any Length" : "Any Status"} 
        icon={type === "movie" ? Clock : Activity} 
        colorClass="text-blue-400" 
      />

      <button onClick={handleReset} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-white/10 rounded-xl text-xs md:text-sm font-medium transition-all text-gray-400 col-span-2 md:col-span-1 lg:col-span-1">
        <Filter size={14} /> Reset
      </button>
    </div>
  );
}