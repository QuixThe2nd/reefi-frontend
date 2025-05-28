import { ReactElement, useEffect } from 'react'

export const ErrorCard = ({ error, setError }: { readonly error: string, readonly setError: (_error: string) => void }): ReactElement => {
  useEffect(() => {
    if (error.length > 0) setTimeout(() => {setError('')}, 2000)
  }, [error])
  return error.length > 0 ? <div className="absolute z-1 top-2 right-2">
    <div className="bg-red-700 p-4 rounded-lg text-center">
      <p className="text-xl mb-2">Error</p>
      <p className="text-sm">{error}</p>
    </div>
  </div> : <></>
}
