import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { discoverMovies, discoverTv } from "../services/tmdb";
import { Loader2 } from "lucide-react";
import MediaGrid from "../components/MediaGrid";
import SectionHeader from "../components/SectionHeader";

export default function Genre() {
  const { type, id, name } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async (pageNum, reset = false) => {
    if (pageNum > 1) setLoadingMore(true);
    else setLoading(true);

    try {
      const fetchFn = type === "movie" ? discoverMovies : discoverTv;
      const data = await fetchFn({ genre: id, page: pageNum });
      setItems((prev) => (reset ? data.results : [...prev, ...data.results]));
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [id, type]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    fetchData(1, true);
  }, [fetchData, id, type]);

  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <SectionHeader
        eyebrow={type === "movie" ? "Movie Genre" : "TV Genre"}
        title={decodeURIComponent(name)}
        description="Explore curated picks from this category with live TMDB data."
      />

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#A78BFA]" />
        </div>
      ) : items.length ? (
        <>
          <MediaGrid items={items} type={type} />
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => fetchData(page + 1)}
              disabled={loadingMore}
              className="rounded-xl border border-[#2A2A2F] bg-[#111114] px-6 py-3 text-sm text-[#F5F5F5] hover:border-[#A78BFA] disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-[#A1A1AA]">No results available for this genre yet.</p>
      )}
    </div>
  );
}
