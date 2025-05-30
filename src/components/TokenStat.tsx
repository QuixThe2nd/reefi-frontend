import { memo, type ReactElement } from 'react'

interface Props {
  readonly title: string,
  readonly detail: string
}

export const TokenStat = memo(({ title, detail }: Props): ReactElement => {
  return <div className="bg-gray-700/50 rounded-lg py-1 px-2">
    <p className="text-gray-400 text-xs">{title}</p>
    <p className="font-medium text-xs">{detail}</p>
  </div>
})
TokenStat.displayName = 'TokenStat'
