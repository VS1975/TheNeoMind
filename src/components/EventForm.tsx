import { useState } from 'react';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import type { CalendarEvent } from '../types/calendar';

interface EventFormProps {
  event: Partial<CalendarEvent>;
  onClose: () => void;
  onSubmit: (event: Omit<CalendarEvent, 'id' | 'resource'>) => void;
  isSubmitting?: boolean;
}

interface FormData extends Omit<CalendarEvent, 'id' | 'resource' | 'start' | 'end' | 'allDay'> {
  start: string;
  end: string;
  allDay: boolean;
}

const categories = [
  { id: 'work', name: 'Work', color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', color: 'bg-green-500' },
  { id: 'learning', name: 'Learning', color: 'bg-purple-500' },
  { id: 'other', name: 'Other', color: 'bg-gray-500' },
];

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    start: event.start ? format(event.start, "yyyy-MM-dd'T'HH:mm") : '',
    end: event.end ? format(event.end, "yyyy-MM-dd'T'HH:mm") : '',
    allDay: event.allDay || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.start || !formData.end) return;
    
    onSubmit({
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
      allDay: formData.allDay,
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-xl w-full max-w-md relative p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-accent transition-colors"
      >
        <FiX className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {event.id ? 'Edit Event' : 'New Event'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full p-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full p-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiCalendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Start</span>
            </div>
            <input
              type="datetime-local"
              value={formData.start}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              className="w-full p-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiClock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">End</span>
            </div>
            <input
              type="datetime-local"
              value={formData.end}
              onChange={(e) => setFormData({ ...formData, end: e.target.value })}
              className="w-full p-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={event.category || 'personal'}
            className="w-full p-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allDay"
            name="allDay"
            defaultChecked={event.allDay}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50"
          />
          <label htmlFor="allDay" className="ml-2 block text-sm">
            All day event
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-accent transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  );
};
