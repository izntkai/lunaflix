import { useEffect, useState } from "react";
import {
  getMyList,
  getContinueWatching,
  isInMyList,
  toggleMyList,
  removeContinueWatching,
} from "../services/library";

export function useMediaLibrary() {
  const [myList, setMyList] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    const sync = () => {
      setMyList(getMyList());
      setContinueWatching(getContinueWatching());
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("lunaflix-library-update", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lunaflix-library-update", sync);
    };
  }, []);

  const handleToggleList = (item) => toggleMyList(item);

  return {
    myList,
    continueWatching,
    handleToggleList,
    isInList: (id, type) => isInMyList(id, type),
    removeContinueWatching,
  };
}
