# Admin Panel Setup Guide

## Quick Start

### Step 1: Access the Admin Login Page
Visit: `https://yourwebsite.com/admin/login`

### Step 2: Create Your First Admin User

You need to add your email to the `admin_users` table in Supabase. Follow these steps:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create a new query with this SQL:

```sql
-- First, sign up for a regular Supabase auth account
-- Then run this to make yourself an admin

-- Get your user ID from the auth.users table
SELECT id, email FROM auth.users;

-- Then insert your user ID into admin_users
INSERT INTO admin_users (id, email)
VALUES ('your-user-id-here', 'your-email@example.com')
ON CONFLICT (email) DO NOTHING;
```

### Step 3: Sign Up & Login

1. At the admin login page, you'll need to sign up first or use existing credentials
2. Use the email and password you added to admin_users
3. Once authenticated and your email is in admin_users, you'll be granted admin access

## Admin Dashboard Features

### Main Dashboard
- View counts of Albums, Videos, Bookings, and Testimonials
- Quick action buttons for creating content
- Navigation to all management sections

### Manage Bookings
- View all client booking requests
- See client details (name, email, phone, event info)
- Update booking status (Pending → Confirmed → Cancelled)
- Send confirmation emails to clients
- Delete booking requests
- View submission timestamps

### Manage Albums
- View all photo albums
- Edit album details
- Delete albums (cascades to delete all images)
- Add new albums (UI placeholder - implement as needed)

### Manage Videos
- View all videos
- Edit video details
- Delete videos
- Add new videos (UI placeholder - implement as needed)

### Manage Testimonials
- View all client testimonials
- Mark testimonials as featured
- Edit testimonial details
- Delete testimonials

## Key Admin Functions

### Confirming a Booking
1. Click on a booking to view details
2. Change status from "Pending" to "Confirmed"
3. Click "Send Email" to notify the client
4. Client receives confirmation email automatically

### Viewing Booking Details
- **Client Name**: Who made the booking
- **Email**: Client's email address (clickable to send email)
- **Phone**: Optional phone number
- **Event Type**: Wedding, Birthday, Corporate, etc.
- **Event Date**: When the event will take place
- **Message**: Client's special requests or notes

### Deleting Bookings
- Click the trash icon on a booking
- Confirm deletion in the popup
- Booking will be removed from the system

## Email Notifications

### Automatic Emails
- Client receives email when booking is submitted
- Admin receives notification of new booking
- Client receives confirmation when status changes to "Confirmed"

### Manual Email Sending
- For confirmed bookings, use "Send Email" button
- Useful if client didn't receive the email
- Resends the same confirmation message

## Dashboard Statistics

The main dashboard shows real-time counts of:
- **Albums**: Number of photo albums
- **Videos**: Number of video entries
- **Bookings**: Total booking requests
- **Testimonials**: Total client testimonials

Statistics update automatically when you make changes.

## Sign Out

Click the "Sign Out" button in the top-right corner of the dashboard. You'll be logged out and redirected to the login page.

## Troubleshooting

### "Access Denied" Error
**Problem**: You see "Access Denied" even after login
**Solution**:
- Make sure your email is added to the `admin_users` table
- Check that the email exactly matches what's in Supabase auth
- Refresh the page after adding to admin_users

### "Login Failed" Error
**Problem**: Cannot log in with email/password
**Solution**:
- Verify email is correct
- Check password is correct
- Make sure you've signed up in Supabase auth first
- Clear browser cache and try again

### Not Redirecting to Dashboard After Login
**Problem**: Stuck on login page after entering credentials
**Solution**:
- Wait a moment for authentication to complete
- Check browser console for errors (F12)
- Try clearing cookies and logging in again
- Ensure email is in admin_users table

### Emails Not Sending
**Problem**: Clients not receiving confirmation emails
**Solution**:
- Check Supabase Edge Functions deployment
- Verify Resend API key is configured (if using email service)
- Check spam/junk folder
- Review error logs in Supabase

## Security Best Practices

1. **Strong Passwords**: Use secure, unique passwords
2. **Admin Email**: Keep admin email confidential
3. **Logout**: Always logout when done
4. **Browser Security**: Use HTTPS only
5. **Two-Factor Authentication**: Enable in Supabase if available

## Advanced Configuration

### Adding More Admins
To add another admin user:

```sql
INSERT INTO admin_users (id, email)
VALUES ('another-user-id', 'another-admin@example.com');
```

### Removing an Admin
```sql
DELETE FROM admin_users
WHERE email = 'admin-to-remove@example.com';
```

### Viewing All Admins
```sql
SELECT id, email, created_at FROM admin_users;
```

## API Integration

The admin panel communicates with Supabase through:
- **Database**: PostgreSQL via Supabase JS client
- **Edge Functions**: Serverless functions for email notifications
- **Authentication**: Supabase Auth with JWT tokens

## Performance Tips

1. **Dashboard Loading**: Be patient on first load (1-2 seconds)
2. **Large Datasets**: Bookings list optimizes after 50+ entries
3. **Image Loading**: Album thumbnails load lazily
4. **Network**: Works best on broadband connections

## Need Help?

### Common Tasks
- **Reset Password**: Use Supabase "Forgot Password" link
- **Update Email**: Not available - contact Supabase directly
- **View Logs**: Check Supabase SQL Editor history

### Contact Support
If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check browser console (F12) for error messages
4. Contact your development team

---

**Admin Panel Version**: 2.0
**Last Updated**: 2026-04-05
