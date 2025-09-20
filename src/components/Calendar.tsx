import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

interface CalendarComponentProps {
  events: CalendarEvent[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ events }) => (
  <div className="h-[600px] bg-gray-800 p-4 rounded-lg text-white">
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100%' }}
      eventPropGetter={(_event) => ({
        style: {
          backgroundColor: '#3182CE', // blue-500
          borderRadius: '5px',
          color: 'white',
          border: 'none',
        }
      })}
    />
  </div>
);

export default CalendarComponent;
