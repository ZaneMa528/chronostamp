'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '~/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({ value, onChange, disabled, placeholder }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeValue, setTimeValue] = useState(value ? new Date(value).toTimeString().slice(0, 5) : '09:00');
  const [popupPosition, setPopupPosition] = useState<'bottom' | 'top'>('bottom');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate popup position when opening
  const calculatePopupPosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const popupHeight = 400; // Approximate popup height

    // Check if there's enough space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
      setPopupPosition('top');
    } else {
      setPopupPosition('bottom');
    }
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const [hours, minutes] = timeValue.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours ?? '0'), parseInt(minutes ?? '0'), 0, 0);

    setSelectedDate(newDate);
    // Convert to local datetime-local format (YYYY-MM-DDTHH:mm)
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const hour = String(newDate.getHours()).padStart(2, '0');
    const minute = String(newDate.getMinutes()).padStart(2, '0');
    onChange(`${year}-${month}-${day}T${hour}:${minute}`);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    if (selectedDate) {
      const [hours, minutes] = newTime.split(':');
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours ?? '0'), parseInt(minutes ?? '0'), 0, 0);
      setSelectedDate(newDate);
      // Convert to local datetime-local format (YYYY-MM-DDTHH:mm)
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const day = String(newDate.getDate()).padStart(2, '0');
      const hour = String(newDate.getHours()).padStart(2, '0');
      const minute = String(newDate.getMinutes()).padStart(2, '0');
      onChange(`${year}-${month}-${day}T${hour}:${minute}`);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            if (!isOpen) {
              calculatePopupPosition();
            }
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled}
        className={cn(
          'flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500',
          disabled && 'cursor-not-allowed opacity-50',
          isOpen && 'border-purple-500 ring-2 ring-purple-500',
        )}
      >
        <div className="flex items-center space-x-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className={cn('text-sm', selectedDate ? 'text-gray-900' : 'text-gray-500')}>
            {selectedDate ? formatDisplayDate(selectedDate) : (placeholder ?? 'Select date and time')}
          </span>
        </div>
        <svg
          className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute left-0 z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg',
            popupPosition === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
          )}
        >
          {/* Month Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => navigateMonth('prev')} className="rounded p-1 hover:bg-gray-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </h3>
            <button type="button" onClick={() => navigateMonth('next')} className="rounded p-1 hover:bg-gray-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week Days */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="mb-4 grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => day && handleDateSelect(day)}
                disabled={!day}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors',
                  !day && 'invisible',
                  day && !isSelected(day) && !isToday(day) && 'hover:bg-gray-100',
                  day && isToday(day) && !isSelected(day) && 'bg-blue-50 font-medium text-blue-600',
                  day && isSelected(day) && 'bg-purple-600 font-medium text-white',
                )}
              >
                {day?.getDate()}
              </button>
            ))}
          </div>

          {/* Time Picker */}
          <div className="border-t pt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-2 border-t pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedDate) {
                  const [hours, minutes] = timeValue.split(':');
                  const finalDate = new Date(selectedDate);
                  finalDate.setHours(parseInt(hours ?? '0'), parseInt(minutes ?? '0'), 0, 0);
                  // Convert to local datetime-local format (YYYY-MM-DDTHH:mm)
                  const year = finalDate.getFullYear();
                  const month = String(finalDate.getMonth() + 1).padStart(2, '0');
                  const day = String(finalDate.getDate()).padStart(2, '0');
                  const hour = String(finalDate.getHours()).padStart(2, '0');
                  const minute = String(finalDate.getMinutes()).padStart(2, '0');
                  onChange(`${year}-${month}-${day}T${hour}:${minute}`);
                }
                setIsOpen(false);
              }}
              className="rounded-md bg-purple-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-purple-700"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
