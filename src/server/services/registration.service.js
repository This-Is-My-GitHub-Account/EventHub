const supabase = require('../config/supabase.config');
const emailService = require('./email.service');



const registerTeamForEvent = async ({ event_id, team_name, leader_id, member_ids }) => {
  // Insert into teams table
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert([{ event_id, name: team_name, leader_id }])
    .select()
    .single();

  if (teamError) throw teamError;
  if (!member_ids.includes(leader_id)) {
    member_ids.push(leader_id);
  }
  const team_id = team.id;

  // Insert all members (including leader) into team_members
  const memberRecords = member_ids.map(member_id => ({ team_id, member_id,event_id }));

  const { error: memberError } = await supabase
    .from('team_members')
    .insert(memberRecords);

  if (memberError) throw memberError;

  // Retrieve event details from the events table so we can include them in the confirmation email
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', event_id)
    .single();

  if (eventError) throw eventError;

  // Send registration confirmation email to the team leader
  await emailService.sendRegistrationConfirmation(eventData, leader_id);

  return team;
};

const getUserRegistrations = async (userId) => {
  // Query team_members table joined with events
  // (Assumes that Supabase relationships are set up so that the event_id
  // field in team_members references events.id and the nested alias is “events”)
  const { data, error } = await supabase
    .from('team_members')
    .select('event_id, events(*)')
    .eq('member_id', userId);

  if (error) throw error;

  return data;
};

const getTeamsByEvent = async (eventId) => {
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .eq('event_id', eventId);

  if (error) throw error;

  return teams;
};

module.exports = {
  registerTeamForEvent,
  getUserRegistrations,
  getTeamsByEvent
};