import { useCallback, useEffect, useState } from "react";
import { discoverTv, getTvGenres } from "../services/tmdb";
import FilterBar from "../components/FilterBar";
import { Loader2 } from "lucide-react";
import MediaGrid from "../components/MediaGrid";
import SectionHeader from "../components/SectionHeader";

export default function TvShows() {
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchShows = useCallback(async (pageNum, reset = false) => {
    if (pageNum > 1) setLoadingMore(true);
    try {
      const data = await discoverTv({
        genre: selectedGenre,
        year: selectedYear,
        language: selectedLanguage,
        minRating,
        status: selectedStatus,
        page: pageNum,
      });

      setShows((prev) => (reset ? data.results : [...prev, ...data.results]));
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, [minRating, selectedGenre, selectedLanguage, selectedStatus, selectedYear]);

  useEffect(() => {
    const init = async () => {
      try {
        const genreData = await getTvGenres();
        setGenres(genreData.genres || []);
        await fetchShows(1, true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchShows]);

  useEffect(() => {
    if (!loading) fetchShows(1, true);
  }, [fetchShows, loading, selectedGenre, selectedYear, selectedLanguage, minRating, selectedStatus]);

  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <SectionHeader
        eyebrow="TV Shows"
        title="Binge-Worthy Series"
        description="Browse trending series, filter by genre and language, and jump straight into episodes."
      />

      <FilterBar
        type="tv"
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        minRating={minRating}
        setMinRating={setMinRating}
        selectedExtra={selectedStatus}
        setSelectedExtra={setSelectedStatus}
      />

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#A78BFA]" />
        </div>
      ) : shows.length ? (
        <>
          <MediaGrid items={shows} type="tv" />
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => fetchShows(page + 1)}
              disabled={loadingMore}
              className="rounded-xl border border-[#2A2A2F] bg-[#111114] px-6 py-3 text-sm text-[#F5F5F5] hover:border-[#A78BFA] disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load More Shows"}
            </button>
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-[#A1A1AA]">No TV shows found for these filters.</p>
      )}
    </div>
  );
}
