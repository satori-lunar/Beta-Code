# Wellness Dashboard

A comprehensive health and wellness dashboard for tracking your personal health journey - both physical and mental wellbeing.

## Features

### Dashboard
- **Streaks & Badges** - Track your progress with gamified streaks and achievement badges displayed prominently
- **Quick Stats** - Overview of today's habits, water intake, sleep, and weight
- **Course Progress** - See your learning progress at a glance

### Habit Tracker
- Create and manage daily habits
- Visual week view with completion tracking
- Streak counting for motivation
- Custom icons and colors for each habit

### Nutrition Tracker
- Log meals by type (breakfast, lunch, dinner, snacks)
- Track macros: calories, protein, carbs, and fat
- Water intake tracking with visual progress
- Interactive water intake chart

### Weight Log
- Log weight entries with notes
- Visual progress chart with trend lines
- Goal weight tracking
- Weekly and total change calculations

### Journal
- Daily journaling with mood tracking
- Gratitude practice (3 things you're grateful for)
- Tagging system for easy searching
- Rich text entries with search and filters

### Courses
- Browse wellness courses by category
- Track course completion progress
- Filter by status (all, in-progress, completed)
- Grid and list view options

### Calendar
- Monthly calendar view
- Event management (classes, habits, reminders, goals)
- View events by day
- Upcoming classes sidebar

### Live Classes & Recordings
- **Live Classes** - Join live Zoom sessions with instructors
- **Recorded Sessions** - Access recorded class library
- **Favorites** - Save your favorite recordings for easy access
- Filter by category
- View count and session details

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management (with persistence)
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **date-fns** for date manipulation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Layout.tsx    # Main layout with sidebar navigation
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Habits.tsx
│   ├── Nutrition.tsx
│   ├── WeightLog.tsx
│   ├── Journal.tsx
│   ├── Courses.tsx
│   ├── Calendar.tsx
│   ├── Classes.tsx
│   └── Settings.tsx
├── store/            # State management
│   └── useStore.ts   # Zustand store with persistence
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app with routing
├── main.tsx          # Entry point
└── index.css         # Global styles with Tailwind
```

## Design

The dashboard features a modern, calming design with:
- Soft coral and sage color palette
- Card-based layouts with smooth shadows
- Responsive design (mobile-first)
- Sidebar navigation for desktop
- Bottom navigation for mobile
- Smooth transitions and animations

## License

MIT
