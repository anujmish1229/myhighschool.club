momin shahid

Due to a SupaBase limitation, if you run this locally with Node Package Manager, you **must** run it on port 8080 to allow for SupaBase login as it redirects to localhost:8080 or our main site at myhighschool.club.

============================================
ADMIN INSTRUCTIONS
============================================
To add a manager for a school:
 1. Go to Supabase Dashboard → Table Editor → school_managers
 2. Click "Insert row"
 3. Fill in:
    - high_school_slug: e.g., "pickering-high-school"
    - manager_email: e.g., "manager@example.com"
 4. Save

 Example INSERT query:
 INSERT INTO school_managers (high_school_slug, manager_email)
 VALUES ('pickering-high-school', 'manager@example.com');