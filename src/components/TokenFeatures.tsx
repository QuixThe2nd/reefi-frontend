import { memo, type ReactElement } from 'react'

interface Props {
  readonly features: Readonly<Record<string, string>>,
}

export const TokenFeatures = memo(({ features }: Props): ReactElement => {
  return <ul className="list-disc list-inside text-gray-300 text-xs mt-2">
    {Object.entries(features).map((feature: readonly [string, string]) => <li key={feature[0]}><strong>{feature[0]}</strong>: {feature[1]}</li>)}
  </ul>
})
TokenFeatures.displayName = 'TokenFeatures'
