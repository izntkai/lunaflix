import { useEffect, useRef, useState } from "react";

export function useDetailsTrailer(trailer, id) {
  const playerRef = useRef(null);
  const retriesRef = useRef(0);
  const retryTimerRef = useRef(null);
  const onApiReadyRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (!trailer) return;

    let isActive = true;
    const maxRetries = 12;
    const previousOnApiReady = window.onYouTubeIframeAPIReady;

    retriesRef.current = 0;

    const clearRetryTimer = () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };

    const scheduleRetry = (initPlayer) => {
      if (!isActive || retriesRef.current >= maxRetries) return;
      retriesRef.current += 1;
      clearRetryTimer();
      retryTimerRef.current = window.setTimeout(initPlayer, 250);
    };

    const initPlayer = () => {
      if (!isActive || playerRef.current) return;

      const iframe = document.getElementById("details-trailer-iframe");
      if (!iframe || !window.YT?.Player) {
        scheduleRetry(initPlayer);
        return;
      }

      try {
        playerRef.current = new window.YT.Player("details-trailer-iframe", {
          events: {
            onReady: (event) => {
              if (!isActive) return;
              event.target.mute();
              setIsMuted(true);
              setPlayerReady(true);
              if (typeof event.target.playVideo === "function") {
                event.target.playVideo();
              }
            },
            onError: () => {
              if (!isActive) return;
              setPlayerReady(false);
            }
          }
        });
      } catch {
        scheduleRetry(initPlayer);
      }
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }

    onApiReadyRef.current = () => {
      if (typeof previousOnApiReady === "function") previousOnApiReady();
      initPlayer();
    };

    window.onYouTubeIframeAPIReady = onApiReadyRef.current;
    initPlayer();

    return () => {
      isActive = false;
      clearRetryTimer();
      if (window.onYouTubeIframeAPIReady === onApiReadyRef.current) {
        window.onYouTubeIframeAPIReady = previousOnApiReady;
      }
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [trailer, id]);

  const toggleMute = () => {
    if (!playerRef.current || !playerReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return { isMuted, toggleMute };
}
