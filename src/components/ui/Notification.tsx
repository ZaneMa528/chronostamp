'use client';

import { forwardRef, useEffect, useState, useCallback } from 'react';
import { cn } from '~/lib/utils';

export interface NotificationProps {
  id?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  showProgress?: boolean;
  className?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }>;
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ 
    type = 'info', 
    title, 
    message, 
    duration = 5000, 
    onClose,
    showProgress = true,
    actions,
    className,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    const handleClose = useCallback(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Match exit animation duration
    }, [onClose]);

    useEffect(() => {
      // Slide in animation
      setTimeout(() => setIsVisible(true), 50);

      if (duration && duration > 0) {
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
          setProgress(remaining);
          
          if (remaining <= 0) {
            clearInterval(interval);
            handleClose();
          }
        }, 16); // ~60fps

        return () => clearInterval(interval);
      }
    }, [duration, handleClose]);

    const getIcon = () => {
      switch (type) {
        case 'success':
          return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case 'error':
          return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        case 'warning':
          return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        default:
          return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };

    const getColorClasses = () => {
      switch (type) {
        case 'success':
          return {
            container: 'bg-green-50 border-green-200 text-green-900',
            icon: 'text-green-600 bg-green-100',
            progress: 'bg-green-500',
          };
        case 'error':
          return {
            container: 'bg-red-50 border-red-200 text-red-900',
            icon: 'text-red-600 bg-red-100',
            progress: 'bg-red-500',
          };
        case 'warning':
          return {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
            icon: 'text-yellow-600 bg-yellow-100',
            progress: 'bg-yellow-500',
          };
        default:
          return {
            container: 'bg-blue-50 border-blue-200 text-blue-900',
            icon: 'text-blue-600 bg-blue-100',
            progress: 'bg-blue-500',
          };
      }
    };

    const colors = getColorClasses();

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm',
          'transition-all duration-300 ease-out',
          'max-w-sm w-full mx-auto',
          'sm:max-w-md',
          colors.container,
          isVisible 
            ? 'transform translate-y-0 opacity-100 scale-100' 
            : 'transform translate-y-2 opacity-0 scale-95',
          className
        )}
        {...props}
      >
        {/* Progress bar */}
        {showProgress && duration && duration > 0 && (
          <div className="absolute top-0 left-0 h-1 w-full bg-black/10">
            <div 
              className={cn('h-full transition-all duration-100 ease-linear', colors.progress)}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              colors.icon
            )}>
              {getIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="text-sm font-semibold mb-1 leading-tight">
                  {title}
                </h4>
              )}
              <p className="text-sm leading-relaxed break-words">
                {message}
              </p>

              {/* Actions */}
              {actions && actions.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-offset-1',
                        action.variant === 'outline'
                          ? 'border border-current bg-transparent hover:bg-current/10'
                          : 'bg-current/10 hover:bg-current/20'
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Notification.displayName = 'Notification';

export { Notification };