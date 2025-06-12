// eslint no-empty: 0
import { useState, useEffect, useRef } from "react";

interface UseFetchOptions extends RequestInit {
  dependencies?: React.DependencyList;
}

export const useFetch = <T>(url: string, initial: T, options: UseFetchOptions = {}): T => {
  const [data, setData] = useState<T>(initial);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { dependencies = [], ...fetchOptions } = options;

  const fetchData = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, { ...fetchOptions, signal: abortControllerRef.current.signal });
      if (response.ok) {
        const result = await response.json() as T;
        setData(result);
      }
    } catch {}
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort("re-rendered");
    };
  }, [url, ...dependencies]);

  return data;
};
