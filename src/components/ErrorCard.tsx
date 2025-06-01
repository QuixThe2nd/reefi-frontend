import { useEffect, ReactElement } from "react";


export const ErrorCard = ({ error, setError }: Readonly<{ error: string; setError: (_error: string) => void }>): ReactElement | undefined => {
  useEffect(() => {
    if (error.length > 0) setTimeout(() => setError(""), 2000);
  }, [error, setError]);
  return error.length > 0 ? <div className="absolute right-2 top-2 z-20">
    <div className="rounded-lg bg-red-700 p-4 text-center">
      <p className="mb-2 text-xl">Error</p>
      <p className="text-sm">{error}</p>
    </div>
  </div> : undefined;
};
