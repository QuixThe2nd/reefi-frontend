import { memo, type ReactElement } from 'react'

interface Props {
  readonly text: string | readonly string[]
}

export const InfoCard = memo(({ text }: Props): ReactElement => {
  const lines = Array.isArray(text) ? text as string[] : [text]
  return <div className="bg-indigo-900/20 border border-green-800/30 rounded-lg p-2 text-sm flex items-start w-full">
    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
    <div>
      <span className="font-medium text-indigo-300 text-sm">About</span>
      {lines.map((line, idx) => <p key={idx} className="text-gray-300 mt-0.5 text-xs" dangerouslySetInnerHTML={{__html: line}} />)}
    </div>
  </div>
})
InfoCard.displayName = 'InfoCard'
