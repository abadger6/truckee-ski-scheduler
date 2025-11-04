# truckee-ski-scheduler
Website for our friends to view our calendar and schedule time to visit!

# Visit Scheduler - Come Visit Me! 🏔️

A simple, free booking interface for friends to schedule visits. Uses GitHub Pages (free hosting), Google Calendar (backend), and EmailJS (notifications).

## Features

- 📅 Real-time calendar showing your availability
- ✉️ Email notifications when friends request visits
- 📱 Mobile-friendly design
- 🆓 Completely free (no hosting costs!)
- 🔄 Auto-syncs with your Google Calendar

## How It Works

1. **Friends** visit your GitHub Pages site and see your calendar
2. **They** fill out a booking request form
3. **You** get an email with their request
4. **You** approve by adding the event to your Google Calendar (via phone/web)
5. **Calendar** automatically updates and blocks those dates for everyone

## Setup Instructions

### 1. Create a Google Calendar API Key

This allows the website to read your calendar and display availability.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Click "Enable APIs and Services"
4. Search for "Google Calendar API" and enable it
5. Go to "Credentials" → "Create Credentials" → "API Key"
6. Copy your API key
7. Click "Edit API key" and restrict it:
   - Under "API restrictions" → select "Google Calendar API"
   - Under "Website restrictions" → add your GitHub Pages URL (you'll get this later)

### 2. Find Your Google Calendar ID

1. Open [Google Calendar](https://calendar.google.com/)
2. Click the three dots next to your calendar (left sidebar)
3. Select "Settings and sharing"
4. Scroll down to "Integrate calendar"
5. Copy the "Calendar ID" (usually looks like `yourname@gmail.com`)

**Important:** Make sure your calendar is set to public or at least visible to the API:
- In calendar settings → "Access permissions"
- Check "Make available to public" (don't worry, they can only see event times, not details)

### 3. Set Up EmailJS (for form notifications)

EmailJS sends you an email when someone submits a booking request.

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. Click "Add New Service" → Choose your email provider (Gmail is easiest)
3. Follow the setup to connect your email
4. Copy your **Service ID**
5. Go to "Email Templates" → "Create New Template"
6. Use this template:

```
New Visit Request from {{from_name}}!

Email: {{from_email}}
Check-in: {{checkin_date}}
Check-out: {{checkout_date}}
Number of Guests: {{number_of_guests}}

Message:
{{message}}

Reply to approve or decline!
```

7. Save and copy your **Template ID**
8. Go to "Account" → Copy your **Public Key**

### 4. Configure Your Site

1. Open `script.js` in a text editor
2. Replace these values at the top:

```javascript
const CONFIG = {
    googleCalendarApiKey: 'YOUR_GOOGLE_API_KEY_HERE',  // From step 1
    googleCalendarId: 'YOUR_CALENDAR_ID_HERE',          // From step 2
    emailjsPublicKey: 'YOUR_EMAILJS_PUBLIC_KEY',       // From step 3
    emailjsServiceId: 'YOUR_EMAILJS_SERVICE_ID',       // From step 3
    emailjsTemplateId: 'YOUR_EMAILJS_TEMPLATE_ID'      // From step 3
};
```

3. Save the file

### 5. Deploy to GitHub Pages

1. Create a GitHub account at [github.com](https://github.com) (if you don't have one)
2. Create a new repository:
   - Click the "+" in the top right → "New repository"
   - Name it `visit-scheduler` (or whatever you want)
   - Make it **Public**
   - Click "Create repository"

3. Upload your files:
   - Click "uploading an existing file"
   - Drag and drop all 4 files (`index.html`, `styles.css`, `script.js`, `README.md`)
   - Click "Commit changes"

4. Enable GitHub Pages:
   - Go to Settings → Pages
   - Under "Source" select "main" branch
   - Click Save
   - Your site will be live at: `https://yourusername.github.io/visit-scheduler/`

5. **Important:** Go back to Google Cloud Console and add this URL to your API key restrictions!

### 6. Test It Out

1. Visit your GitHub Pages URL
2. You should see sample events on the calendar (these are just for demo)
3. Try filling out the booking form - you should get an email!

## Usage Instructions

### Managing Your Availability

**To block dates (when you're unavailable):**
1. Open Google Calendar on your phone or computer
2. Create an all-day event for the dates you want to block
3. Title it anything (e.g., "Unavailable" or "My Trip")
4. Save it
5. The calendar on your site will update automatically (within a few minutes)

**To approve a booking request:**
1. You'll get an email from a friend's request
2. If you approve, just add an event to your Google Calendar for those dates
3. Title it something like "Sarah's Visit" or "Friends Visiting"
4. The calendar updates automatically - those dates are now blocked!

**To decline a booking:**
- Just reply to their email saying those dates don't work
- Don't add anything to your calendar

### Customization

**Change colors/styling:**
- Edit `styles.css` - colors are in the header section

**Change the title/text:**
- Edit `index.html` - update the header text ("Come Visit Truckee!")

**Change calendar view:**
- In `script.js`, find `initialView` and change to `listMonth` or other views

## Troubleshooting

**Calendar shows "sample events" only:**
- Make sure you've added your Google API key in `script.js`
- Check browser console for errors (F12 → Console tab)

**Form doesn't send emails:**
- Verify EmailJS credentials in `script.js`
- Check EmailJS dashboard to see if emails were sent

**Calendar doesn't update:**
- Make sure your Google Calendar is set to public/visible
- API changes can take a few minutes to propagate

**"API key not valid" error:**
- Double-check your API key in script.js
- Make sure you've restricted it to Google Calendar API only
- Add your GitHub Pages URL to the allowed referrers

## Cost Breakdown

- GitHub Pages: **Free**
- Google Calendar API: **Free** (up to 1,000,000 requests/day)
- EmailJS: **Free** (200 emails/month)
- Domain (optional): ~$10/year if you want a custom domain

**Total: $0** (or $10/year for custom domain)

## Support

Having issues? Check the browser console (F12) for error messages. Most issues are configuration-related:
1. Verify all API keys are correct
2. Check that Google Calendar is public
3. Test EmailJS in their dashboard first

## Next Steps

Want to enhance this?
- Add a custom domain (GitHub Pages supports this)
- Connect to Stripe for collecting deposits
- Add automatic email confirmations to guests
- Connect to a Google Sheet for tracking requests

---

**Happy hosting!** 🎉 Share your GitHub Pages link with friends and make it easy for them to visit!
