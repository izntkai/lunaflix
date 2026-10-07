import { useEffect, useState } from "react";
import { getTrendingAll } from "../services/tmdb";
import { Loader2 } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import MediaGrid from "../components/MediaGrid";

export default function Trending() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingAll()
      .then((res) => setItems(res.results || []))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <SectionHeader
        eyebrow="Trending"
        title="Trending This Week"
        description="A real-time mix of the movies and shows people are watching right now."
      />
      {loading ? (
        <div className="flex h-[45vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#A78BFA]" />
        </div>
      ) : (
        <MediaGrid items={items} />
      )}
    </div>
  );
}
