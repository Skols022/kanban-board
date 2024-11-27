import { useEffect, useState } from 'react';

const useMedia = (query: string) => {
  const [matches, setMatches] = useState(
    typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const useBreakpoint = () => {
  const tabletMain = useMedia(`(max-width: ${768 - 0.02}px)`);
  const desktopWide = useMedia(`(max-width: ${1280 - 0.02}px)`);

  return {
    tabletMain,
    desktopWide,
  };
}
