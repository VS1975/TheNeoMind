import type { Event as RBCEvent } from 'react-big-calendar';

export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  category?: string;
  completed?: boolean;
  resource?: any;
  // Add any additional properties that might be needed
  [key: string]: any;
}

export type CalendarView = 'month' | 'week' | 'day';

// Type guard to check if an object is a CalendarEvent
export function isCalendarEvent(event: any): event is CalendarEvent {
  return (
    event &&
    typeof event === 'object' &&
    'title' in event &&
    'start' in event &&
    'end' in event
  );
}
