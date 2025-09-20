import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiCalendar } from 'react-icons/fi';
import { format, isSameDay, startOfToday, addHours } from 'date-fns';
import { collection, addDoc, onSnapshot, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import type { CalendarEvent, CalendarView } from '../types/calendar';
import { EnhancedCalendar } from '../components/EnhancedCalendar';
import { EventForm } from '../components/EventForm';

const Scheduler = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentView, setCurrentView] = useState<CalendarView>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch events from Firestore
  useEffect(() => {
    if (!currentUser) return;
    
    const eventsCollection = collection(db, 'users', currentUser.uid, 'events');
    const q = query(eventsCollection, orderBy('start', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        start: doc.data().start?.toDate(),
        end: doc.data().end?.toDate(),
      } as CalendarEvent));
      
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching events:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Save event to Firestore
  const saveEvent = async (event: Omit<CalendarEvent, 'id' | 'resource'>) => {
    if (!currentUser) return;
    
    try {
      const eventData = {
        ...event,
        userId: currentUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (editingEvent?.id) {
        // Update existing event
        const eventDoc = doc(db, 'users', currentUser.uid, 'events', editingEvent.id);
        await updateDoc(eventDoc, eventData);
      } else {
        // Add new event
        await addDoc(collection(db, 'users', currentUser.uid, 'events'), { 
          ...eventData,
          createdAt: serverTimestamp(),
        });
      }
      
      setEditingEvent(null);
      setShowEventForm(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  // Delete event handler is now part of the EventForm component

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, categoryFilter]);

  // Get today's events
  const todaysEvents = useMemo(() => {
    return filteredEvents.filter(event => 
      isSameDay(event.start, startOfToday()) || 
      (event.end && isSameDay(event.end, startOfToday()))
    );
  }, [filteredEvents]);

  // Handle event selection from calendar
  const handleSelectEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  // Handle slot selection (for creating new events)
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setEditingEvent({
      title: '',
      description: '',
      start,
      end: end || addHours(start, 1),
      allDay: false,
    });
    setShowEventForm(true);
  };

  // Handle event drop or resize
  const handleEventDrop = (event: CalendarEvent) => {
    // Clone the event to avoid mutating the original
    const updatedEvent = { ...event };
    saveEvent(updatedEvent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Scheduler</h1>
          <p className="text-muted-foreground">
            {format(selectedDate, 'MMMM yyyy')} • {currentView} view
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-card focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-lg bg-card focus:ring-2 focus:ring-primary/50 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="learning">Learning</option>
            <option value="other">Other</option>
          </select>
          
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowEventForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            <FiPlus className="-ml-1 mr-2 h-4 w-4" />
            New Event
          </button>
        </div>
      </div>

      {/* Today's Events */}
      {todaysEvents.length > 0 && (
        <div className="bg-card rounded-xl border p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <FiCalendar className="mr-2 h-4 w-4 text-primary" />
            Today's Events
          </h3>
          <div className="space-y-2">
            {todaysEvents.map(event => (
              <div 
                key={event.id} 
                className="p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleSelectEvent(event)}
              >
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-card rounded-xl border p-4">
        <EnhancedCalendar
          events={filteredEvents}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventDrop}
          currentView={currentView}
          onView={(view) => setCurrentView(view as CalendarView)}
          onNavigate={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showEventForm && editingEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div 
              className="fixed inset-0"
              onClick={() => setShowEventForm(false)}
            />
            <EventForm
              event={editingEvent}
              onClose={() => setShowEventForm(false)}
              onSubmit={saveEvent}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scheduler;
