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
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Mobile positioning - bottom of screen */}
      <div className="sm:hidden absolute bottom-4 left-4 right-4 flex flex-col gap-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>

      {/* Desktop positioning - top right */}
      <div className="hidden sm:flex absolute top-4 right-4 flex-col gap-3 max-w-md">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return createPortal(container, document.body);
}