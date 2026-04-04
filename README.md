# Juan Captures - Premium Photography & Videography Website

**Tagline:** "Capturing Moments, Creating Memories"

A full-stack, production-ready photography and videography portfolio website featuring a luxury black & gold design with glassmorphism UI effects.

## Features

### Frontend
- **Cinematic Design**: Luxury black & gold theme with strong glassmorphism effects
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Scroll animations, parallax effects, and page transitions using Framer Motion
- **Custom Fonts**: Playfair Display, Poppins, and Great Vibes
- **SEO Optimized**: Meta tags and semantic HTML

### Pages
1. **Home**: Hero section with CTA, featured work, services, and testimonials
2. **Gallery**: Album-based photo gallery with lightbox viewer
3. **Videos**: Video showcase with modal player
4. **About**: Brand story and company information
5. **Contact**: Contact form with business information
6. **Booking**: Event booking form with database integration

### Admin Panel
- Secure authentication using Supabase Auth
- Dashboard with statistics
- Manage albums and images
- Manage videos
- View and manage bookings
- Manage testimonials

### Additional Features
- Animated loading screen with logo
- Floating Facebook Messenger button
- Glass-morphic navigation bar with mobile menu
- Footer with quick links and contact info

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom glassmorphism utilities
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Database Schema

### Tables
- `albums` - Photo albums with cover images
- `images` - Individual photos within albums
- `videos` - Video content
- `bookings` - Client booking requests
- `testimonials` - Client testimonials
- `admin_users` - Admin authentication

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Color Palette

- **Background**: `#0D0D0D` (dark)
- **Sections/Cards**: `#1A1A1A` (dark-100)
- **Gold Accent**: `#D4AF37` (gold)
- **Gold Light**: `#F0D97C`
- **Gold Dark**: `#B8941F`

## Glassmorphism Classes

- `.glass` - Basic glass effect
- `.glass-strong` - Strong glass effect with more blur and opacity
- `.btn-gold` - Gold button with hover effects
- `.btn-gold-outline` - Outlined gold button

## Security Features

- Row Level Security (RLS) enabled on all database tables
- Protected admin routes
- JWT authentication
- Input validation on all forms
- Secure file upload restrictions

## Performance

- Lazy loading for images
- Optimized assets
- Code splitting with React Router
- Efficient database queries
- Fast loading times

## Admin Access

To create an admin user, you need to:

1. Sign up a user through Supabase Auth
2. Add their user ID to the `admin_users` table manually:

```sql
INSERT INTO admin_users (id, email)
VALUES ('user-uuid-here', 'admin@email.com');
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── LoadingScreen.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── FacebookMessenger.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   └── useAuth.ts
├── lib/                # Libraries and utilities
│   └── supabase.ts
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Gallery.tsx
│   ├── Videos.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Booking.tsx
│   └── admin/          # Admin pages
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── ManageAlbums.tsx
│       ├── ManageVideos.tsx
│       ├── ManageBookings.tsx
│       └── ManageTestimonials.tsx
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   └── animations.ts
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles

## Production Deployment

The application is production-ready and can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

Make sure to set environment variables on your hosting platform.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved - Juan Captures © 2026
