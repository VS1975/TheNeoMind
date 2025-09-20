import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import type { CalendarEvent } from '../types/calendar';

// Create a strongly typed version of the DragAndDropCalendar
const DragAndDropCalendar = withDragAndDrop(
  Calendar as React.ComponentType<any>
) as React.ComponentType<{
  localizer: any;
  events: CalendarEvent[];
  view?: View;
  defaultView?: View;
  views?: View[];
  step?: number;
  timeslots?: number;
  style?: React.CSSProperties;
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: {
    start: Date;
    end: Date;
    slots: Date[];
    action: 'select' | 'click' | 'doubleClick';
  }) => void;
  onEventDrop?: (args: { event: CalendarEvent; start: Date; end: Date; isAllDay: boolean }) => void;
  onEventResize?: (args: { event: CalendarEvent; start: Date; end: Date; isAllDay: boolean }) => void;
  onView?: (view: View) => void;
  onNavigate?: (date: Date, view: View, action?: 'PUSH' | 'POP') => void;
  components?: any;
  selectable?: boolean | 'ignoreEvents';
  resizable?: boolean;
  min?: Date;
  max?: Date;
  scrollToTime?: Date;
  defaultDate?: Date;
  titleAccessor?: string | ((event: CalendarEvent) => string);
  allDayAccessor?: string | ((event: CalendarEvent) => boolean);
  startAccessor?: string | ((event: CalendarEvent) => Date);
  endAccessor?: string | ((event: CalendarEvent) => Date);
  eventPropGetter?: (event: CalendarEvent) => { className?: string; style?: React.CSSProperties };
  dayPropGetter?: (date: Date) => { className?: string; style?: React.CSSProperties };
  slotPropGetter?: (date: Date) => { className?: string; style?: React.CSSProperties };
  dayLayoutAlgorithm?: 'overlap' | 'no-overlap';
  showMultiDayTimes?: boolean;
  popup?: boolean;
  popupOffset?: number | { x: number; y: number };
  onSelecting?: (range: { start: Date; end: Date }) => boolean;
  onRangeChange?: (range: Date[] | { start: Date; end: Date }, view?: View) => void;
  onDrillDown?: (date: Date, view: View) => void;
  onDoubleClickEvent?: (event: CalendarEvent) => void;
  onKeyPressEvent?: (event: React.KeyboardEvent, eventObj: CalendarEvent) => void;
  onShowMore?: (events: CalendarEvent[], date: Date) => void;
  toolbar?: boolean | React.ComponentType<any>;
  className?: string;
  elementProps?: React.HTMLAttributes<HTMLElement>;
  longPressThreshold?: number;
  getNow?: () => Date;
  rtl?: boolean;
  width?: number | string;
  formats?: any;
  messages?: any;
}>;

type CalendarView = View;

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: {
    'en-US': enUS,
  },
});

// Using the shared CalendarEvent type from types/calendar

interface EnhancedCalendarProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onEventDrop: (event: CalendarEvent) => void;
  onEventResize: (event: CalendarEvent) => void;
  currentView: CalendarView;
  onView: (view: CalendarView) => void;
  onNavigate: (date: Date) => void;
  selectedDate: Date;
}

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  events,
  onSelectEvent,
  onSelectSlot,
  onEventDrop,
  onEventResize,
  currentView,
  onView,
  onNavigate,
  selectedDate,
}) => {
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#3b82f6',
      borderRadius: '4px',
      color: 'white',
      border: 'none',
      padding: '2px 5px',
    },
  });

  const handleEventDrop = (args: {
    event: any;
    start: Date | string;
    end: Date | string;
  }) => {
    onEventDrop({
      ...args.event,
      start: args.start instanceof Date ? args.start : new Date(args.start),
      end: args.end instanceof Date ? args.end : new Date(args.end),
    });
  };

  const handleEventResize = (args: {
    event: any;
    start: Date | string;
    end: Date | string;
  }) => {
    onEventResize({
      ...args.event,
      start: args.start instanceof Date ? args.start : new Date(args.start),
      end: args.end instanceof Date ? args.end : new Date(args.end),
    });
  };

  // Convert string dates to Date objects if needed
  const processedEvents = events.map(event => ({
    ...event,
    start: event.start instanceof Date ? event.start : new Date(event.start),
    end: event.end instanceof Date ? event.end : new Date(event.end),
  }));

  return (
    <div className="h-[600px] w-full">
      <DragAndDropCalendar
        localizer={localizer}
        events={processedEvents}
        startAccessor={(event: CalendarEvent) => new Date(event.start)}
        endAccessor={(event: CalendarEvent) => new Date(event.end)}
        defaultView={currentView}
        view={currentView}
        onView={onView}
        views={['month', 'week', 'day']}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        eventPropGetter={eventStyleGetter}
        popup
        onNavigate={onNavigate}
        defaultDate={selectedDate}
      />
    </div>
  );
};
