const supabase = require('../config/supabase.config');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: require('path').resolve(__dirname, '../../../.env') });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const register = async (userData) => {
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (authError) throw new Error(authError.message);
  const userId = authData.user.id;

 
  const { data: user, error } = await supabase
    .from('users')
    .insert([{
      id: userId,
      email: userData.email,
      name: userData.name,
      gender: userData.gender,
      stream: userData.stream,
      date_of_birth: userData.date_of_birth,
      passing_out_year: userData.passing_out_year,
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    ...user,
    token: generateToken(user.id),
  };
};

const login = async (email, password) => {
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new Error('Invalid credentials');
  }

  const userId = authData.user.id;

 
  const { data: userProfile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !userProfile) {
    throw new Error('User profile not found');
  }

  return {
    ...userProfile,
    token: generateToken(userId),
  };
};

const getUserIdByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
};

const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

const updateProfile = async (userId, updateData) => {
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};


module.exports = {
  register,
  login,
  getUserIdByEmail,
  getProfile,
  updateProfile
};