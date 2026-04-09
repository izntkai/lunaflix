import { useMemo } from "react";

export function usePersonCredits(person) {
  return useMemo(() => {
    if (!person?.combined_credits) return null;

    const cast = person.combined_credits.cast || [];
    const crew = person.combined_credits.crew || [];

    const getGroups = (items) => {
      const groups = {
        acting: [],
        directing: [],
        writing: [],
        cinematography: [],
        production: []
      };

      // Map roles to groups
      const ROLE_MAP = {
        "Director": "directing",
        "Writer": "writing",
        "Screenplay": "writing",
        "Story": "writing",
        "Teleplay": "writing",
        "Director of Photography": "cinematography",
        "Cinematographer": "cinematography",
        "Producer": "production",
        "Executive Producer": "production"
      };

      // Process Cast
      cast.forEach(item => {
        groups.acting.push({ ...item, displayRole: item.character || "Actor" });
      });

      // Process Crew
      crew.forEach(item => {
        const groupKey = ROLE_MAP[item.job];
        if (groupKey) {
          groups[groupKey].push({ ...item, displayRole: item.job });
        }
      });

      // Deduplicate within groups and sort
      Object.keys(groups).forEach(key => {
        const unique = {};
        groups[key].forEach(item => {
          const id = `${item.media_type}-${item.id}`;
          if (!unique[id] || (item.popularity > unique[id].popularity)) {
            unique[id] = item;
          }
        });
        
        groups[key] = Object.values(unique)
          .filter(item => item.poster_path)
          .sort((a, b) => {
            const dateA = a.release_date || a.first_air_date || "0";
            const dateB = b.release_date || b.first_air_date || "0";
            return dateB.localeCompare(dateA);
          });
      });

      return groups;
    };

    return getGroups();
  }, [person]);
}
