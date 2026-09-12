# TechNova Solutions Landing Page

A professional, modern, and animated landing page for a software development company. Built with Next.js, React, and styled-components.

## Features

- Responsive design that works on all device sizes
- Modern UI with smooth animations powered by Framer Motion
- Interactive components with hover effects and transitions
- Clean, modular component structure
- Optimized for performance

## Sections

- **Hero** - An eye-catching introduction with animated background elements
- **Services** - Comprehensive list of offered services with beautiful cards
- **Team** - Showcase of team members with interactive elements
- **Vision** - Company vision and values with animated illustrations
- **Clients** - Client logos and testimonials
- **Journey** - Client journey visualization with a timeline
- **Contact** - Contact form and company information
- **Footer** - Site navigation and additional information

## Technologies Used

- Next.js - React framework for production
- React - Frontend library
- styled-components - Component-level styling
- Framer Motion - Animation library
- React Intersection Observer - Trigger animations on scroll
- React Scroll - Smooth scrolling to page sections

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

- Colors can be adjusted in `styles/globals.css` by modifying the CSS variables
- Company information can be updated in respective component files
- Service offerings can be modified in the `Services.js` component
- Team member information can be updated in the `Team.js` component

## Deployment

This project can be easily deployed to platforms like Vercel or Netlify:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Internal admin (`/admin`)

A private area for team documents (markdown, with tags and pinning) and file
sharing. It is `noindex`, blocked in `robots.txt`, and every page and API route
requires a signed-in session.

**Sign-in.** Users are defined in env vars, no database:

```bash
ADMIN_USERS=george:secret,anna:another-secret   # name:password pairs
ADMIN_SESSION_SECRET=$(openssl rand -hex 32)     # signs the session cookie
```

Copy `.env.example` to `.env.local` for development. On Vercel add the same
variables under Project → Settings → Environment Variables.

**Storage.**

- Locally, documents and uploads are written to `.admin-data/` (git-ignored).
- In production, attach a Vercel Blob store to the project (Storage → Create →
  Blob). Vercel injects `BLOB_READ_WRITE_TOKEN` and the app switches to Blob
  automatically. Blobs are private; downloads are streamed through
  `/api/admin/files/download/:id` after an auth check, so no storage URL is
  ever exposed. Uploads go browser → Blob directly, so the 4.5 MB Vercel
  request limit does not apply.

Code lives in `pages/admin`, `pages/api/admin`, `components/admin`, `lib/admin`.

## License

MIT

## Acknowledgements

- Design inspired by modern software company websites
- Icons from Feather Icons
- Font from Google Fonts (Inter) 