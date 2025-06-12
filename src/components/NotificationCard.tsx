import { useLoggedEffect } from "..";

import { type ReactElement } from "react";

export const NotificationCard = ({ notification, setNotification }: Readonly<{ notification: string; setNotification: (_error: string) => void }>): ReactElement | undefined => {
  useLoggedEffect(() => {
    if (notification.length > 0) {
      const timeout = setTimeout(() => setNotification(""), 2000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [notification, setNotification], "Notification Card");

  return notification.length > 0 ? <div className="absolute right-2 top-2 z-20">
    <div className="rounded-lg bg-blue-700 p-4 text-center">
      <p className="text-sm text-white">{notification}</p>
    </div>
  </div> : undefined;
};
