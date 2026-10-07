import { useEffect, useState } from "react";
import { discoverMovies, getMovieGenres } from "../services/tmdb";
import FilterBar from "../components/FilterBar";
import { Loader2 } from "lucide-react";
import MediaGrid from "../components/MediaGrid";
import SectionHeader from "../components/SectionHeader";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedRuntime, setSelectedRuntime] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const genreData = await getMovieGenres();
        setGenres(genreData.genres || []);
        await fetchMovies(1, true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) fetchMovies(1, true);
  }, [selectedGenre, selectedYear, selectedLanguage, minRating, selectedRuntime]);

  const fetchMovies = async (pageNum, reset = false) => {
    if (pageNum > 1) setLoadingMore(true);
    try {
      const data = await discoverMovies({
        genre: selectedGenre,
        year: selectedYear,
        language: selectedLanguage,
        minRating,
        runtime: selectedRuntime,
        page: pageNum,
      });
      setMovies((prev) => (reset ? data.results : [...prev, ...data.results]));
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <SectionHeader
        eyebrow="Movies"
        title="Explore Movies"
        description="Discover popular, top-rated, and hidden gems with smart filters powered by TMDB data."
      />

      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        minRating={minRating}
        setMinRating={setMinRating}
        selectedExtra={selectedRuntime}
        setSelectedExtra={setSelectedRuntime}
      />

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#A78BFA]" />
        </div>
      ) : movies.length ? (
        <>
          <MediaGrid items={movies} type="movie" />
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => fetchMovies(page + 1)}
              disabled={loadingMore}
              className="rounded-xl border border-[#2A2A2F] bg-[#111114] px-6 py-3 text-sm text-[#F5F5F5] hover:border-[#A78BFA] disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load More Movies"}
            </button>
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-[#A1A1AA]">No movies found for these filters.</p>
      )}
    </div>
  );
}
