import { useState, useEffect } from "react";

export const useIsWebKit = (): boolean => {
  const [isWebKit, setIsWebKit] = useState(true);

  useEffect(() => {
    const checkIsWebKitOrSafari = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isWebKit = /webkit/.test(userAgent);
      const isNotEdge = !/edge/.test(userAgent);
      const isSafari = /safari/.test(userAgent);
      const isChrome = /chrome/.test(userAgent);
      const isIOS =
        /ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream;

      // Safari on iOS doesn't include "Safari" in UA string in standalone mode
      return isWebKit && isNotEdge && (isSafari || isChrome || isIOS);
    };

    setIsWebKit(checkIsWebKitOrSafari());
  }, []);

  return isWebKit;
};
