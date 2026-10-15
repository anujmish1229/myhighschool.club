# Administration

## Roles

| Role | Who | Can do |
|---|---|---|
| Visitor | Anyone | View approved club sites and school pages |
| Club owner | Any signed-in Google user | Create clubs (they start as `pending`), edit and delete their own clubs |
| School manager | Emails listed in `school_managers` | Approve, reject and delete any club at their school, via `/manager-dashboard` |

Permissions are enforced in the database by Row Level Security
([`supabase/policies.sql`](../supabase/policies.sql)), not by the UI.

## Adding a school manager

Managers are added from the Supabase dashboard only. The app has no UI for this,
and browser clients cannot write to `school_managers`.

1. Go to **Supabase Dashboard → Table Editor → `school_managers`**.
2. Click **Insert row**.
3. Fill in:
   - `high_school_slug`: the school's slug, e.g. `pickering-high-school`
     (slugs are listed in [`src/data/ontarioSchools.ts`](../src/data/ontarioSchools.ts))
   - `manager_email`: the manager's Google account email
4. Save.

Or with SQL:

```sql
insert into school_managers (high_school_slug, manager_email)
values ('pickering-high-school', 'manager@example.com');
```

The manager sees a **Manager Dashboard** button the next time they open `/dashboard`.

## Approving clubs

New clubs are created with `status = 'pending'` and are hidden from the public
until a manager for that school approves them at `/manager-dashboard`.
Rejecting a club deletes it.

## Adding a high school

Schools are a static list in [`src/data/ontarioSchools.ts`](../src/data/ontarioSchools.ts).
Add an entry there with a unique `slug` and open a pull request.
