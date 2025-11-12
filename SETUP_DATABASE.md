# 🗄️ Database Setup Guide

Quick guide to set up the screenshots table in Supabase.

## 📋 Prerequisites

- Supabase project created
- Admin access to Supabase Dashboard

## 🚀 Setup Steps

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (`Mantis` or your project name)
3. Click **SQL Editor** in the left sidebar

### Step 2: Create New Query

1. Click **New Query** button
2. You'll see an empty SQL editor

### Step 3: Copy Migration SQL

Open the migration file:
```
supabase/migrations/20241112_create_screenshots_table.sql
```

Copy all the contents.

### Step 4: Paste and Execute

1. Paste the SQL into the query editor
2. Click **Run** (or press Cmd/Ctrl + Enter)
3. Wait for "Success" message

### Step 5: Verify Table Creation

1. Go to **Table Editor** in the left sidebar
2. You should see a new table called `screenshots`
3. Click on it to verify columns:
   - ✅ id (UUID, Primary Key)
   - ✅ user_id (UUID, Foreign Key)
   - ✅ url (TEXT)
   - ✅ screenshot_data (TEXT)
   - ✅ page_title (TEXT)
   - ✅ meta_description (TEXT)
   - ✅ body_text (TEXT)
   - ✅ headings (JSONB)
   - ✅ links (JSONB)
   - ✅ word_count (INTEGER)
   - ✅ char_count (INTEGER)
   - ✅ created_at (TIMESTAMPTZ)
   - ✅ updated_at (TIMESTAMPTZ)

### Step 6: Verify RLS (Row Level Security)

1. In **Table Editor**, select `screenshots` table
2. Check that **RLS is enabled** (you'll see a badge/indicator)
3. Click on **Policies** tab
4. You should see 4 policies:
   - ✅ Users can view their own screenshots
   - ✅ Users can insert their own screenshots
   - ✅ Users can update their own screenshots
   - ✅ Users can delete their own screenshots

### Step 7: Test in Your App

1. Make sure your `.env.local` file has the correct Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Start your dev server:
   ```bash
   npm run dev
   ```

3. Take a screenshot at `http://localhost:3000/dashboard/screenshot`

4. Check the browser console for:
   ```
   Screenshot saved to database with ID: 550e8400-...
   ```

5. Visit `http://localhost:3000/dashboard/history` to see your saved screenshot!

## ✅ Success Indicators

You'll know setup is successful when:
- ✅ No errors in SQL execution
- ✅ `screenshots` table appears in Table Editor
- ✅ RLS policies are enabled
- ✅ Taking a screenshot shows "saved to database" in console
- ✅ Screenshot appears in History page

## ❌ Troubleshooting

### Error: "relation screenshots already exists"

**Solution:** Table already exists. You're good to go!

### Error: "permission denied"

**Solution:** Make sure you're logged in as the project owner/admin.

### RLS Policies Not Working

**Solution:**
1. Go to Table Editor > screenshots
2. Click RLS toggle to ensure it's enabled
3. Re-run the policy creation part of the migration

### Screenshots Not Appearing in History

**Checklist:**
1. ✅ Migration ran successfully?
2. ✅ RLS enabled?
3. ✅ Console shows "saved to database"?
4. ✅ Logged in with same user who took the screenshot?
5. ✅ No JavaScript errors in console?

**Debug:**
1. Open browser console (F12)
2. Go to Network tab
3. Take a screenshot
4. Check the `/api/screenshot` request
5. Look for errors in the response

### Database Connection Errors

**Check:**
1. `.env.local` file has correct credentials
2. Supabase project is not paused (free tier)
3. Network connectivity

## 🎯 Quick Verification Query

To manually check if data is saving, run this in SQL Editor:

```sql
-- View all screenshots (as authenticated user)
SELECT id, url, page_title, created_at 
FROM screenshots 
ORDER BY created_at DESC 
LIMIT 10;

-- Count total screenshots
SELECT COUNT(*) as total_screenshots 
FROM screenshots;
```

## 📊 Optional: View Database in CLI

If you have Supabase CLI installed:

```bash
# View table structure
supabase db dump --schema public --table screenshots

# Query data
psql postgresql://your-connection-string -c "SELECT * FROM screenshots LIMIT 5;"
```

## 🔐 Security Notes

### RLS is Critical! ✅

Row Level Security (RLS) ensures:
- Users can ONLY see their own screenshots
- No one can access another user's data
- Even with direct API access

### Test RLS

1. Create two user accounts
2. Take screenshots with each
3. Verify User A cannot see User B's screenshots

## 🎉 You're Done!

Once you see your screenshots appearing in the History page, you're all set!

**Your screenshots are now persistently stored with timestamps! ⏰**

---

## Next Steps

- Take more screenshots! 📸
- Browse your history 📂
- Try the detail view 🔍
- Delete unwanted screenshots 🗑️

Need help? Check the main documentation or console logs for debugging info.

