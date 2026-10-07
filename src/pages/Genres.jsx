import { GenreGrid } from "../components/home/GenreGrid";
import SectionHeader from "../components/SectionHeader";

export default function Genres() {
  return (
    <div className="px-4 pb-16 pt-6 md:px-8">
      <SectionHeader
        eyebrow="Genres"
        title="Browse by Genre"
        description="Jump into action, drama, thriller, sci-fi, animation, and more with quick genre discovery."
      />
      <GenreGrid />
    </div>
  );
}
