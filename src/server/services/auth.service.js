const supabase = require('../config/supabase.config');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (userData) => {
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', userData.email)
    .single();

  if (existingUser) {
    throw new Error('User already exists');
  }

  const { data: user, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;

  return {
    ...user,
    token: generateToken(user.id)
  };
};

const login = async (email, password) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .single();

  if (error || !user) {
    throw new Error('Invalid credentials');
  }

  return {
    ...user,
    token: generateToken(user.id)
  };
};

module.exports = {
  register,
  login
};