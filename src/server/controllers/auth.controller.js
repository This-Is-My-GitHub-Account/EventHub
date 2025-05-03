import asyncHandler from 'express-async-handler';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  res.json(user);
});

export const getUserIdByEmail = asyncHandler(async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ message: 'Email query parameter is required.' });
  }

  const user = await authService.getUserIdByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.status(200).json(user);
});

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found.' });
  }
  res.status(200).json(profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateProfile(req.user.id, req.body);
  console.log(req.body);
  res.status(200).json(updatedUser);
});