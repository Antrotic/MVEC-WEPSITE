import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function RiveResult({ id = "noresult", text = "" }) {
  const { t: tl } = useTranslation();
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Check if the component is still mounted before updating the state
  if (!isMounted) {
    return null;
  }

  return (
    <div className="animation-canvas">
      <Image width={120} height={120} src="/searching.svg" />
      <div className="text">{tl(text)}</div>
    </div>
  );
}

export default RiveResult;
