import type { JSX, ReactElement } from "react";

interface Properties {
  readonly text: JSX.Element | readonly JSX.Element[];
}

export const InfoCard = ({ text }: Properties): ReactElement => {
  const lines = Array.isArray(text) ? (text as JSX.Element[]) : [text as JSX.Element];
  return <div className="flex w-full items-start rounded-lg border border-green-800/30 bg-indigo-900/20 p-2 text-sm mt-8 max-w-4wxl">
    <div className="mr-3 mt-0.5 rounded-full bg-indigo-800/30 p-1">
      <svg className="text-indigo-400" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <title>Info</title>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </div>
    <div>
      <span className="text-sm font-medium text-indigo-300">About</span>
      {lines.map(line => <p className="mt-0.5 text-xs text-gray-300" key={line.key}>{line}</p>)}
    </div>
  </div>;
};
