/* eslint no-empty: 0 */
import { useState, useEffect, useRef } from "react";

interface UseFetchOptions extends RequestInit {
  dependencies?: React.DependencyList;
}

export const useFetch = <T>(url: string, initial: T, options: UseFetchOptions = {}): T => {
  const [data, setData] = useState<T>(initial);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    (async () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      try {
        const response = await fetch(url, { ...options, signal: abortControllerRef.current.signal });
        if (response.ok) {
          const result = await response.json() as T;
          setData(result);
        }
      } catch {}
    })();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort("re-rendered");
    };
  }, [url, options]);

  return data;
};
