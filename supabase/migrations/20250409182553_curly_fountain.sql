/*
  # Initial Schema Setup

  1. Tables Created
    - users
    - events
    - registrations
    - teams

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  gender VARCHAR(20),
  stream VARCHAR(100),
  date_of_birth DATE,
  passing_out_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_description TEXT NOT NULL,
  event_creator_id UUID REFERENCES users(id),
  important_dates JSONB,
  registration_deadline TIMESTAMP,
  prizes JSONB,
  event_type VARCHAR(20) CHECK (event_type IN ('Online', 'In Person')),
  venue VARCHAR(255),
  contact_info VARCHAR(255),
  participation_type VARCHAR(20) CHECK (participation_type IN ('Solo', 'Team')),
  max_team_size INTEGER,
  department VARCHAR(100),
  category VARCHAR(50),
  registration_fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- Create Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  name VARCHAR(255) NOT NULL,
  leader_id UUID REFERENCES users(id),
  member_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, name)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

  -- Allow users to insert their own data
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Events are readable by all authenticated users"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Events can be created by authenticated users"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = event_creator_id);

CREATE POLICY "Events can be updated by their creators"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = event_creator_id);

CREATE POLICY "Registrations are readable by event creators and registered users"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT event_creator_id FROM events WHERE id = event_id
    ) OR auth.uid() = user_id
  );

CREATE POLICY "Teams are readable by event creators and team members"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT event_creator_id FROM events WHERE id = event_id
    ) OR auth.uid() IN (leader_id, member_id)
  );
