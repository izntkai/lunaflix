import { useDetailsTrailer } from "../../hooks/useDetailsTrailer";
import { DetailsHeroBackdrop } from "./DetailsHeroBackdrop";
import { DetailsHeroInfo } from "./DetailsHeroInfo";

export function DetailsHero({ movie, trailer, type, id }) {
  const { isMuted, toggleMute } = useDetailsTrailer(trailer, id);

  return (
    <div className="relative w-full min-h-[65vh] md:h-[75vh] group/hero overflow-hidden bg-black flex flex-col justify-end">
      <DetailsHeroBackdrop 
        movie={movie} 
        trailer={trailer} 
        isMuted={isMuted} 
        toggleMute={toggleMute} 
      />
      
      <DetailsHeroInfo 
        movie={movie} 
        trailer={trailer} 
        type={type} 
        id={id} 
      />
    </div>
  );
}
