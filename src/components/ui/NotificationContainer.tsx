'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { Notification } from './Notification';
import { useNotificationStore } from '~/stores/useNotificationStore';

export function NotificationContainer() {
  const [mounted, setMounted] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const container = (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Mobile positioning - bottom of screen */}
      <div className="absolute right-4 bottom-4 left-4 flex flex-col gap-3 sm:hidden">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification {...notification} onClose={() => removeNotification(notification.id)} />
          </div>
        ))}
      </div>

      {/* Desktop positioning - top right */}
      <div className="absolute top-4 right-4 hidden max-w-md flex-col gap-3 sm:flex">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification {...notification} onClose={() => removeNotification(notification.id)} />
          </div>
        ))}
      </div>
    </div>
  );

  return createPortal(container, document.body);
}
