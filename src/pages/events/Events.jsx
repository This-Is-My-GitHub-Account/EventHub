import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import EventCard from '../../components/common/EventCard';
import EventFilters from './components/EventFilters';
import SearchBar from '../../components/common/SearchBar';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filters, searchQuery]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select('*');

      if (filters.eventType) {
        query = query.eq('event_type', filters.eventType);
      }
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      if (filters.participationType) {
        query = query.eq('participation_type', filters.participationType);
      }
      if (searchQuery) {
        query = query.ilike('event_name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <div className="mt-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <EventFilters onFilterChange={handleFilterChange} />
          </div>
          <div className="lg:col-span-3">
            {events.length === 0 ? (
              <p className="text-gray-600">No events found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;