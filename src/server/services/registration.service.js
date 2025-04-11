const supabase = require('../config/supabase.config');
const emailService = require('./email.service');

//teams incomplete
const registerForEvent = async (eventId, userId) => {
  

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId);
 
    
  if (!event) throw new Error('Event not found');


  const { data, error } = await supabase
    .from('registrations')
    .insert([{
      event_id: eventId,
      user_id: userId,
    }])
    .select()
    .single();

  if (error) throw error;

  // Send confirmation email
  await emailService.sendRegistrationConfirmation(event, userId);

  return data;
};

const getEventRegistrations = async (eventId, userId) => {
  const { data: event } = await supabase
    .from('events')
    .select('event_creator_id')
    .eq('id', eventId)
    .single();

  if (event.event_creator_id !== userId) {
    throw new Error('Not authorized to view registrations');
  }

  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      users (
        id,
        name,
        email
      )
    `)
    .eq('event_id', eventId);

  if (error) throw error;
  return data;
};

module.exports = {
  registerForEvent,
  getEventRegistrations
};