# EventHub - College Event Management Platform

EventHub is a comprehensive web application designed to streamline the management and participation of college events. Built with React, Tailwind CSS, and Supabase, it provides an intuitive interface for students to discover, create, and participate in various college events.

## Features

- **Event Discovery**: Browse and search through various college events
- **Event Creation**: Create and manage technical and non-technical events
- **Team Management**: Form teams and manage team registrations
- **User Profiles**: Complete profile management with progress tracking
- **Department Filters**: Filter events by different engineering departments
- **Real-time Updates**: Get instant updates on event registrations and team formations

## Tech Stack

- **Frontend**:
  - React
  - Tailwind CSS
  - shadcn/ui Components
  - React Query
  - React Router DOM
  - React Hook Form

- **Backend**:
  - Supabase (Database & Authentication)
  - Node.js
  - Express.js

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eventhub.git
cd eventhub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

```

4. Start the frontend development server and run the express server:
```bash
npm run dev
```

### Setting up Supabase

1. Create a new Supabase project
2. Use the migration files in the `supabase/migrations` folder to set up your database schema
3. Enable Row Level Security (RLS) policies as defined in the migrations

## Features in Detail

### Authentication
- Email and password authentication
- Protected routes
- Profile completion tracking

### Event Management
- Create technical and non-technical events
- Set registration deadlines
- Manage team sizes and requirements
- Upload event images
- Set prizes and important dates

### Team Formation
- Create teams for events
- Search and invite team members
- Manage team registrations
- View team status and members

### User Dashboard
- View registered events
- Track created events
- Monitor registration status
- Update profile information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- [Supabase](https://supabase.io/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [shadcn/ui](https://ui.shadcn.com/) for the component library