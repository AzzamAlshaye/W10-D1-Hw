// src/hooks/useTitle.js
import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
