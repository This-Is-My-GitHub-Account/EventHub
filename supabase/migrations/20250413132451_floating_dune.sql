/*
  # Initial Schema Setup

  1. Tables Created:
    - users: User profiles and authentication
    - events: Event details and configuration
    - teams: Team management
    - team_members: Team membership tracking

  2. Security:
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name character varying(255) NOT NULL,
  email character varying(255) UNIQUE NOT NULL,
  gender character varying(20),
  stream character varying(100),
  date_of_birth date,
  passing_out_year integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name character varying(255) NOT NULL,
  event_description text NOT NULL,
  event_creator_id uuid REFERENCES users(id),
  important_dates jsonb,
  registration_deadline timestamp without time zone,
  prizes jsonb,
  event_type character varying(20) CHECK (event_type IN ('Online', 'In Person')),
  venue character varying(255),
  contact_info character varying(255),
  participation_type character varying(20) CHECK (participation_type IN ('Solo', 'Team')),
  max_team_size integer,
  department character varying(100),
  category character varying(50),
  registration_fee numeric(10,2),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  image_url text
);

-- Create Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id),
  name character varying(255) NOT NULL,
  leader_id uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, name)
);

-- Create Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  member_id uuid REFERENCES users(id),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, member_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create Policies for Users Table
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create Policies for Events Table
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

CREATE POLICY "Enable delete for users based on user_id"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = event_creator_id);

-- Create Policies for Teams Table
CREATE POLICY "Enable insert for authenticated users only"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Teams are readable by event creators and team members"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() IN (
      SELECT events.event_creator_id
      FROM events
      WHERE events.id = teams.event_id
    )) OR
    (auth.uid() = leader_id) OR
    (EXISTS (
      SELECT 1
      FROM team_members tm
      WHERE tm.team_id = teams.id AND tm.member_id = auth.uid()
    ))
  );

-- Create Policies for Team Members Table
CREATE POLICY "Enable insert for authenticated users only"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

-- Create Triggers for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();