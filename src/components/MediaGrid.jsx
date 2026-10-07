import MovieCard from "./MovieCard";

export default function MediaGrid({ items, type, progressMap }) {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MovieCard
          key={`${type || item.media_type || "media"}-${item.id}`}
          movie={item}
          type={type || item.media_type || (item.name ? "tv" : "movie")}
          progress={progressMap?.[`${type || item.media_type || (item.name ? "tv" : "movie")}:${item.id}`]}
          compact
        />
      ))}
    </div>
  );
}
