import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { searchMulti } from "../services/tmdb";
import { ArrowLeft, Loader2, Search as SearchIcon } from "lucide-react";
import SearchResultCard from "../components/search/SearchResultCard";

const filters = ["all", "movie", "tv", "person"];

export default function Search() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query || "");
  const [mediaFilter, setMediaFilter] = useState("all");

  useEffect(() => {
    setSearchTerm(query || "");
    const timer = setTimeout(() => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      searchMulti(query)
        .then((data) => setResults(data.results || []))
        .catch((error) => {
          console.error(error);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredResults = useMemo(() => {
    if (mediaFilter === "all") return results;
    return results.filter((item) => item.media_type === mediaFilter);
  }, [results, mediaFilter]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search/${searchTerm.trim()}`);
  };

  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-[#2A2A2F] bg-[#111114] p-2 text-[#A1A1AA] hover:text-[#F5F5F5]"
        >
          <ArrowLeft size={18} />
        </button>
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search movies, TV shows, actors..."
            className="w-full rounded-xl border border-[#2A2A2F] bg-[#111114] py-3 pl-10 pr-4 text-sm text-[#F5F5F5] outline-none focus:border-[#A78BFA]"
          />
        </form>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setMediaFilter(filter)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] transition ${
              mediaFilter === filter
                ? "bg-[#A78BFA]/20 text-[#C4B5FD]"
                : "bg-[#111114] text-[#A1A1AA] hover:text-[#F5F5F5]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-[45vh] items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-[#A78BFA]" />
        </div>
      ) : filteredResults.length ? (
        <>
          <p className="mb-4 text-sm text-[#A1A1AA]">
            {filteredResults.length} results for <span className="text-[#C4B5FD]">“{query}”</span>
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {filteredResults.map((item) => (
              <SearchResultCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-[#2A2A2F] bg-[#111114] p-10 text-center">
          <p className="text-lg text-[#F5F5F5]">No results found for “{query}”.</p>
          <p className="mt-2 text-sm text-[#A1A1AA]">Try another title, genre, or person name.</p>
        </div>
      )}
    </div>
  );
}
