import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  showProgress?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }>;
}

interface NotificationState {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Convenience methods
  showSuccess: (message: string, options?: Partial<Omit<NotificationData, 'id' | 'type' | 'message'>>) => void;
  showError: (message: string, options?: Partial<Omit<NotificationData, 'id' | 'type' | 'message'>>) => void;
  showInfo: (message: string, options?: Partial<Omit<NotificationData, 'id' | 'type' | 'message'>>) => void;
  showWarning: (message: string, options?: Partial<Omit<NotificationData, 'id' | 'type' | 'message'>>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools((set, get) => ({
    notifications: [],
    
    addNotification: (notification) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: NotificationData = {
        id,
        duration: 5000,
        showProgress: true,
        ...notification,
      };
      
      set((state) => ({
        notifications: [...state.notifications, newNotification]
      }));
    },
    
    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    },
    
    clearAllNotifications: () => {
      set({ notifications: [] });
    },
    
    showSuccess: (message, options = {}) => {
      get().addNotification({
        type: 'success',
        message,
        ...options,
      });
    },
    
    showError: (message, options = {}) => {
      get().addNotification({
        type: 'error',
        message,
        duration: 7000, // Longer duration for errors
        ...options,
      });
    },
    
    showInfo: (message, options = {}) => {
      get().addNotification({
        type: 'info',
        message,
        ...options,
      });
    },
    
    showWarning: (message, options = {}) => {
      get().addNotification({
        type: 'warning',
        message,
        duration: 6000,
        ...options,
      });
    },
  }))
);