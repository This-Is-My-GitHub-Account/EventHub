const supabase = require('../config/supabase.config');

const createEvent = async (eventData, userId) => {
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...eventData, event_creator_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getEvents = async (filters = {}) => {
  let query = supabase.from('events').select('*');

  if (filters.type) {
    query = query.eq('event_type', filters.type);
  }
  if (filters.department) {
    query = query.eq('department', filters.department);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const getEventById = async (id) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

const getCurrentUserEvents = async (userId) => {
  const {data, error} = await supabase
    .from("events")
    .select('*')
    .eq('event_creator_id', userId)

    if (error) throw error; 
    return data;
}
const updateEvent = async (id, eventData, userId) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .eq('event_creator_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteEvent = async (id, userId) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('event_creator_id', userId);

  if (error) throw error;
  return { success: true };
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getCurrentUserEvents,
  updateEvent,
  deleteEvent
};