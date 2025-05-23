import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid('male', 'female', 'other'),
  stream: Joi.string(),
  date_of_birth: Joi.date(),
  passing_out_year: Joi.number().integer()
});

export const eventSchema = Joi.object({
  image_url: Joi.string(),
  event_name: Joi.string().required(),
  rules:Joi.string(),
  organizer:Joi.string(),
  max_participants:Joi.number(),
  event_description: Joi.string().required(),
  important_dates: Joi.object(),
  registration_deadline: Joi.date(),
  prizes: Joi.object(),
  event_type: Joi.string().valid('Online', 'In Person').required(),
  venue: Joi.string(),
  contact_info: Joi.string(),
  participation_type: Joi.string().valid('Solo', 'Team').required(),
  max_team_size: Joi.number().integer(),
  department: Joi.string(),
  category: Joi.string(),
  registration_fee: Joi.number().precision(2)
});

export const teamSchema = Joi.object({
  event_id: Joi.string().uuid().required(),
  team_name: Joi.string().required(),
  member_ids: Joi.array().items(Joi.string().uuid())
});