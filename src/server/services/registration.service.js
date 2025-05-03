import supabase from '../config/supabase.config.js';
import { sendRegistrationConfirmation } from './email.service.js';

export const registerTeamForEvent = async ({ event_id, team_name, leader_id, member_ids }) => {
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

  const memberRecords = member_ids.map(member_id => ({ team_id, member_id, event_id }));

  const { error: memberError } = await supabase
    .from('team_members')
    .insert(memberRecords);

  if (memberError) throw memberError;

  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', event_id)
    .single();

  if (eventError) throw eventError;

  await sendRegistrationConfirmation(eventData, leader_id);

  return team;
};

export const getUserRegistrations = async (userId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('event_id, events(*)')
    .eq('member_id', userId);

  if (error) throw error;

  return data;
};

export const getTeamsByEvent = async (eventId) => {
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .eq('event_id', eventId);

  if (error) throw error;

  return teams;
};