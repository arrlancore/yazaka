import { useState, useEffect } from "react";

export const useIsWebKit = (): boolean => {
  const [isWebKit, setIsWebKit] = useState(true);

  useEffect(() => {
    const checkIsWebKit = () => {
      const userAgent = navigator.userAgent;
      return /WebKit/.test(userAgent) && !/Edge/.test(userAgent);
    };

    setIsWebKit(checkIsWebKit());
  }, []);

  return isWebKit;
};
