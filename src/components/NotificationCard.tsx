import { ReactElement, useEffect } from 'react'

export const NotificationCard = ({ notification, setNotification }: { readonly notification: string, readonly setNotification: (_error: string) => void }): ReactElement => {
  useEffect(() => {
    if (notification.length > 0) setTimeout(() => setNotification(''), 2000)
  }, [notification, setNotification])

  return notification.length > 0 ? <div className="absolute z-2 top-2 right-2">
    <div className="bg-blue-700 p-4 rounded-lg text-center">
      <p className="text-sm text-white">{notification}</p>
    </div>
  </div> : <></>
}
