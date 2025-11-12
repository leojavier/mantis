# Mantis

A modern Next.js application built with TypeScript, Tailwind CSS, and Supabase Authentication.

## Features

- ⚡️ **Next.js 15** - The latest version with App Router
- 🔷 **TypeScript** - Type safety and better developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔐 **Supabase Auth** - Secure authentication with email/password
- 🛡️ **Protected Routes** - Middleware-based route protection
- 📸 **Screenshot Tool** - Capture full-page website screenshots with automatic popup & cookie banner removal
- 📏 **ESLint** - Code linting for consistent code style
- 🌙 **Dark Mode** - Automatic dark mode support

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Supabase Credentials

Create a `.env.local` file in the root directory (or update the existing one) with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

To get your credentials:
1. Go to [Supabase](https://supabase.com)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy your Project URL and anon/public key

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
mantis/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/      # Auth callback handler
│   │   ├── dashboard/         # Protected dashboard page
│   │   ├── login/            # Login page
│   │   ├── signup/           # Sign up page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── LogoutButton.tsx  # Logout component
│   ├── lib/
│   │   └── supabase/         # Supabase client utilities
│   │       ├── client.ts     # Browser client
│   │       ├── server.ts     # Server client
│   │       └── middleware.ts # Auth middleware
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static files
├── .env.local                 # Environment variables (not in git)
├── .env.example              # Environment variables template
├── package.json
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── next.config.js            # Next.js configuration
```

## Authentication Features

### Pages

- **Home (`/`)** - Landing page with conditional navigation based on auth state
- **Login (`/login`)** - Email/password login with error handling
- **Sign Up (`/signup`)** - User registration with email confirmation
- **Dashboard (`/dashboard`)** - Protected page showing user information
- **Screenshot Tool (`/dashboard/screenshot`)** - Capture clean screenshots with automatic popup removal
- **Auth Callback (`/auth/callback`)** - Handles OAuth and email confirmation callbacks

### Protected Routes

The middleware automatically protects `/dashboard` routes. Unauthenticated users are redirected to `/login`.

### How It Works

1. **Client-Side Auth** - Uses `@supabase/ssr` for client components
2. **Server-Side Auth** - Uses server components with cookies for SSR
3. **Middleware Protection** - Validates sessions and protects routes
4. **Automatic Redirects** - Logged-in users can't access auth pages

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Supabase Setup

Your Supabase project should have the following enabled:

1. **Email Auth** - Settings > Authentication > Providers > Email
2. **Email Confirmations** (optional) - Settings > Authentication > Email Auth

No additional database setup is required - Supabase handles user tables automatically!

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Supabase Documentation](https://supabase.com/docs) - Learn about Supabase features
- [Tailwind CSS](https://tailwindcss.com/docs) - Learn about Tailwind CSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Remember to add your environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

