import { Link } from "react-router-dom";
import { Film, Tv, User } from "lucide-react";

export default function SearchResultCard({ item }) {
  const mediaType = item.media_type || (item.title ? "movie" : item.name ? "tv" : "person");
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4) || "—";

  if (mediaType === "person") {
    return (
      <Link to={`/person/${item.id}`} className="rounded-2xl border border-[#2A2A2F] bg-[#111114] p-4 transition hover:border-[#A78BFA]">
        <div className="mb-3 aspect-[2/3] overflow-hidden rounded-xl bg-[#18181C]">
          {item.profile_path ? (
            <img src={`https://image.tmdb.org/t/p/w300${item.profile_path}`} alt={title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-[#A1A1AA]">
              <User />
            </div>
          )}
        </div>
        <p className="truncate text-sm font-semibold text-[#F5F5F5]">{title}</p>
        <p className="mt-1 text-xs text-[#A1A1AA]">Actor</p>
      </Link>
    );
  }

  return (
    <Link to={`/details/${mediaType}/${item.id}`} className="group relative overflow-hidden rounded-2xl border border-[#2A2A2F] bg-[#111114] transition hover:border-[#A78BFA]">
      <div className="aspect-[2/3] overflow-hidden bg-[#18181C]">
        {item.poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w400${item.poster_path}`} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-[#A1A1AA]">
            {mediaType === "movie" ? <Film /> : <Tv />}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-[#F5F5F5]">{title}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-[#A1A1AA]">
          <span className="uppercase">{mediaType}</span>
          <span>{year}</span>
        </div>
      </div>
    </Link>
  );
}
