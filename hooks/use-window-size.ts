"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "@/lib/utils";
import type { Size } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Window Size Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useWindowSize(): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const update = useCallback(
    debounce(() => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }, 100) as () => void,
    []
  );

  useEffect(() => {
    // Initial value
    setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return size;
}
