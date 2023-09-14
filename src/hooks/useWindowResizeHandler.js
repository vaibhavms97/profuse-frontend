import { useEffect, useState } from "react";

export default function useWindowResizeHandler() {
  const [isValidScreenSize, setIsValidScreenSize] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1350) {
        setIsValidScreenSize(true);
      } else {
        setIsValidScreenSize(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isValidScreenSize;
}
