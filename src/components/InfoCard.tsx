import type { ReactElement } from 'react'

export const InfoCard = ({ text }: { text: string | string[] }): ReactElement => {
  if (!Array.isArray(text)) text = [text]
  return <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm flex items-start">
    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
    <div>
      <span className="font-medium text-indigo-300">About</span>
      {text.map((line, idx) => <p key={idx} className="text-gray-300 mt-1" dangerouslySetInnerHTML={{__html: line}} />)}
    </div>
  </div>
}
