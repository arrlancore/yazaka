import { useState, useEffect } from "react";
import { UAParser } from "ua-parser-js";

const useBrowserDetection = () => {
  const [browserInfo, setBrowserInfo] = useState({
    isWebKit: false,
    isSafari: false,
  });

  useEffect(() => {
    const parser = new UAParser();
    const uaResult = parser.getResult();

    const isWebKitBased = uaResult.engine.name === "WebKit";
    const isSafari = uaResult.browser.name === "Safari";

    setBrowserInfo({
      isWebKit: isWebKitBased,
      isSafari,
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  return browserInfo;
};

export default useBrowserDetection;
