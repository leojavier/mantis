# Mantis - Setup Instructions

## 🚀 Quick Start

Your Next.js application with Supabase authentication is ready! Follow these steps to get started:

### Step 1: Add Your Supabase Credentials

Open the `.env.local` file in the root directory and replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find your credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on Settings (⚙️) > API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. (Optional) Configure email templates in **Authentication** > **Email Templates**

### Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Features Implemented

### Authentication Flow
✅ **Sign Up** (`/signup`) - Create new account with email/password  
✅ **Login** (`/login`) - Sign in with existing credentials  
✅ **Dashboard** (`/dashboard`) - Protected page for authenticated users  
✅ **Logout** - Sign out functionality  
✅ **Route Protection** - Middleware automatically protects dashboard routes  
✅ **Auto Redirect** - Logged-in users can't access login/signup pages  

### Pages Created

1. **Home** (`/`) - Landing page with conditional navigation
2. **Login** (`/login`) - Email/password login form
3. **Sign Up** (`/signup`) - Registration form with validation
4. **Dashboard** (`/dashboard`) - Protected user dashboard
5. **Auth Callback** (`/auth/callback`) - Handles email confirmations

### Security Features

- 🔐 Server-side authentication with cookies
- 🛡️ Middleware-based route protection
- 🔄 Automatic session refresh
- ✅ Password validation (min 6 characters)
- 📧 Email confirmation support

## 🧪 Testing the Authentication

### Test the Sign Up Flow:
1. Go to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Enter an email and password (min 6 characters)
3. Check your email for confirmation (if enabled in Supabase)
4. You'll be redirected to login

### Test the Login Flow:
1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your credentials
3. On success, you'll be redirected to `/dashboard`

### Test Protected Routes:
1. While logged out, try to access [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. You should be redirected to `/login`
3. After logging in, you'll be able to access the dashboard

## 📂 Project Structure

```
mantis/
├── src/
│   ├── app/
│   │   ├── auth/callback/     # Auth callback handler
│   │   ├── dashboard/         # Protected dashboard (requires auth)
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── LogoutButton.tsx   # Reusable logout button
│   ├── lib/supabase/
│   │   ├── client.ts          # Browser client (client components)
│   │   ├── server.ts          # Server client (server components)
│   │   └── middleware.ts      # Auth utilities for middleware
│   └── middleware.ts           # Next.js middleware (route protection)
├── .env.local                  # Your environment variables
└── .env.example               # Template for env variables
```

## 🔧 Customization Ideas

- Add OAuth providers (Google, GitHub, etc.)
- Implement password reset functionality
- Add user profile management
- Create additional protected routes
- Add role-based access control (RBAC)
- Implement email verification flow
- Add loading states and animations
- Create a user settings page

## 🐛 Troubleshooting

### "Invalid API credentials" error
- Make sure you've added your Supabase credentials to `.env.local`
- Restart the dev server after adding environment variables

### Email not sending
- Check Supabase email settings in Authentication > Email Templates
- For production, configure a custom SMTP provider

### Route protection not working
- Verify middleware is running (check `src/middleware.ts`)
- Clear browser cookies and try again

## 📚 Learn More

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

## 🎉 You're All Set!

Your authentication system is fully functional. Start building your application features on top of this foundation!

