const supabase = require('../config/supabase.config');
const emailService = require('./email.service');



const registerTeamForEvent = async ({ event_id, team_name, leader_id, member_ids }) => {
  // Insert into teams
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert([{ event_id, name: team_name, leader_id }])
    .select()
    .single();

  if (teamError) throw teamError;
  member_ids.push(leader_id);
  const team_id = team.id;

  // Insert all members (including leader) into team_members
  const memberRecords = member_ids.map(member_id => ({ team_id, member_id,event_id }));

  const { error: memberError } = await supabase
    .from('team_members')
    .insert(memberRecords);

  if (memberError) throw memberError;

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


module.exports = {
  registerTeamForEvent,
  getUserRegistrations
};