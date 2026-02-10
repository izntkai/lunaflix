import { Filter, ChevronDown, Star } from "lucide-react";

// Static Data: Years from Current Year down to 1900
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

// Static Data: Comprehensive list of languages sorted alphabetically
const languages = [
  { code: "af", name: "Afrikaans" },
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "zh", name: "Chinese" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ms", name: "Malay" },
  { code: "no", name: "Norwegian" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "tl", name: "Tagalog" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
];

// UPDATED RATING OPTIONS
const minRatingOptions = [
  { value: "1-3", label: "1 - 3 Stars" },
  { value: "4-6", label: "4 - 6 Stars" },
  { value: "7", label: "7+ Stars" },
];

export default function FilterBar({ 
  genres, 
  selectedGenre, setSelectedGenre,
  selectedYear, setSelectedYear,
  selectedLanguage, setSelectedLanguage,
  minRating, setMinRating           
}) {
  
  const handleReset = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedLanguage("");
    if (setMinRating) setMinRating("");
  };

  return (
    <div className="font-title grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8 bg-[#0f0f0f]/95 backdrop-blur-xl p-4 border border-white/5 rounded-2xl shadow-2xl">
      
      {/* 1. Genre Select */}
      <div className="relative">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="w-full bg-[#1a1a1a] text-xs md:text-sm text-gray-300 py-3 px-4 pr-8 rounded-xl appearance-none border border-white/5 hover:border-white/20 focus:border-purple-500 focus:text-white outline-none cursor-pointer transition-all"
        >
          <option value="">All Genres</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
      </div>

      {/* 2. Year Select */}
      <div className="relative">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full bg-[#1a1a1a] text-xs md:text-sm text-gray-300 py-3 px-4 pr-8 rounded-xl appearance-none border border-white/5 hover:border-white/20 focus:border-purple-500 focus:text-white outline-none cursor-pointer transition-all"
        >
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
      </div>

      {/* 3. Language Select */}
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-[#1a1a1a] text-xs md:text-sm text-gray-300 py-3 px-4 pr-8 rounded-xl appearance-none border border-white/5 hover:border-white/20 focus:border-purple-500 focus:text-white outline-none cursor-pointer transition-all"
        >
          <option value="">Global (All)</option>
          {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
      </div>

      {/* 4. Min Rating Select */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">
          <Star size={14} fill="currentColor" />
        </div>
        <select
          value={minRating}
          onChange={(e) => setMinRating && setMinRating(e.target.value)}
          className="w-full bg-[#1a1a1a] text-xs md:text-sm text-gray-300 py-3 pl-9 pr-8 rounded-xl appearance-none border border-white/5 hover:border-white/20 focus:border-purple-500 focus:text-white outline-none cursor-pointer transition-all"
        >
          <option value="">Any Rating</option>
          {minRatingOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
      </div>

      {/* 5. Reset Button */}
      <button 
        onClick={handleReset}
        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-white/10 rounded-xl text-xs md:text-sm font-medium transition-all text-gray-400 col-span-2 md:col-span-1 lg:col-span-1"
      >
        <Filter size={14} /> Reset
      </button>
    </div>
  );
}