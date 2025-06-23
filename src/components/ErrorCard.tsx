import type { ReactElement } from "react";

export const ErrorCard = ({ error }: Readonly<{ error: string; setError: (_error: string) => void }>): ReactElement | undefined => error.length > 0 ? <div className="absolute right-2 top-2 z-20">
  <div className="rounded-lg bg-red-700 p-4 text-center">
    <p className="mb-2 text-xl">Error</p>
    <p className="text-sm">{error}</p>
  </div>
</div> : undefined;
