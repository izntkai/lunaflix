import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { useMediaLibrary } from "../hooks/useMediaLibrary";
import MediaGrid from "../components/MediaGrid";

export default function MyList() {
  const { myList } = useMediaLibrary();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    let list = [...myList];
    if (filter !== "all") list = list.filter((item) => item.type === filter);

    if (sort === "rating") {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sort === "title") {
      list.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
    } else {
      list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    }

    return list;
  }, [myList, filter, sort]);

  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <SectionHeader
        eyebrow="My List"
        title="Your Watchlist"
        description="Save movies and TV shows to watch later, then launch playback in one tap."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "movie", label: "Movies" },
          { key: "tv", label: "TV Shows" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] ${
              filter === item.key ? "bg-[#A78BFA]/20 text-[#C4B5FD]" : "bg-[#111114] text-[#A1A1AA]"
            }`}
          >
            {item.label}
          </button>
        ))}

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-full border border-[#2A2A2F] bg-[#111114] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#A1A1AA]"
        >
          <option value="recent">Recently Added</option>
          <option value="rating">Top Rated</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {filtered.length ? (
        <MediaGrid items={filtered} />
      ) : (
        <p className="rounded-2xl border border-[#2A2A2F] bg-[#111114] p-10 text-center text-[#A1A1AA]">
          Your list is empty. Add titles from cards or detail pages.
        </p>
      )}
    </div>
  );
}
