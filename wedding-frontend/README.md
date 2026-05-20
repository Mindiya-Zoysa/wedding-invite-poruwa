# 💍 Eternal Invite — Interactive React Wedding Invitation

A fully interactive, animated digital wedding invitation built with React and Framer Motion.

This project includes a cinematic heart intro animation, a responsive 3D envelope opening sequence, a beautifully designed invitation page, live countdown timer, RSVP form, animated timeline, tabbed sections, and clipboard-copy honeymoon contribution details — all built without using a CSS framework.

---

# ✨ Features

## 🎬 1. Cinematic Intro

- Animated heart drawing cover screen
- Automatically transitions after 5 seconds
- Smooth fade-out to envelope

## ✉️ 2. Interactive Envelope Animation

- Rustic Kraft paper envelope design
- Fully responsive layout
- Smooth 3D opening animation using Framer Motion
- Seamless transition to main invitation

## 💖 3. Hero / Save The Date Section

- Elegant typography
- Animated entrance effects
- Fully responsive layout
- Custom hero background image support

## ⏳ 4. Live Countdown Timer

- Displays:
  - Days
  - Hours
  - Minutes
  - Seconds
- Auto-updates every second
- Easy to configure target wedding date

## 📍 5. Google Integration

- Embedded Google Maps location
- “Add to Google Calendar” button

## 🗓️ 6. Alternating Wedding Timeline

- Visually alternating left/right layout
- Clean and elegant event breakdown
- Fully responsive for mobile

## 📋 7. Tabbed Information Section

Tabs include:

- Who’s Coming (Guest Info)
- Photo Gallery Link
- Honeymoon Contribution Details

## 📋 8. RSVP Form

- Name input
- Attendance selection
- Guest count
- Special message
- Ready for backend integration (Laravel, Node, etc.)

## 📋 9. Clipboard Copy Feature

- One-click copy for bank account details
- Uses `navigator.clipboard`

## 🎨 10. No CSS Framework

- 100% inline styles
- Fully controlled design system
- No Tailwind / Bootstrap required

---

# 🧱 Tech Stack

- React
- Framer Motion (animations)
- Lucide React (icons)
- JavaScript (ES6)
- Inline CSS styling

---

# 📁 Project Structure

Your `src` folder should look like this:

```
src/
├── assets/
│   ├── hero-bg.jpg
│   ├── yashara.jpg
│   └── anuruddha.jpg
│
├── components/
│   ├── HeartCover.js
│   ├── Envelope.js
│   └── MainPage.js
│
├── App.js
└── index.js
```

---

# 🚀 Installation Guide

## 1️⃣ Prerequisites

Make sure you have installed:

- Node.js (v16+ recommended)
- npm

Download Node.js here:
https://nodejs.org/

---

## 2️⃣ Create React App (If Starting Fresh)

```
npx create-react-app wedding-invite
cd wedding-invite
```

---

## 3️⃣ Install Required Dependencies

```
npm install framer-motion lucide-react
```

---

## 4️⃣ Add Your Project Files

Replace the default `src` folder contents with your:

- `components/`
- `assets/`
- `App.js`
- `index.js`

---

# ⚙️ Customization Guide

Before deployment, update the following inside `MainPage.js`:

---

## 🖼️ 1. Update Images

At the top of the file:

```
const HERO_IMAGE = "/assets/hero-bg.jpg";
const YASHARA_PIC = "/assets/yashara.jpg";
const ANURUDDHA_PIC = "/assets/anuruddha.jpg";
```

Make sure your images exist inside `src/assets/`.

---

## 📅 2. Change Wedding Date

Find:

```
targetDate="2026-04-11T00:00:00"
```

Replace with your actual wedding date and time.

---

## 📍 3. Update Google Maps Embed

Replace the `<iframe src="...">` with your actual Google Maps embed link.

To get it:

- Open Google Maps
- Click "Share"
- Click "Embed a map"
- Copy HTML

---

## 📆 4. Update Google Calendar Link

Replace the `href` on the "Add to Calendar" button.

Use this generator:
https://calendar.google.com/calendar/u/0/r/eventedit

Fill in:

- Event name
- Location
- Date & Time

Copy the final URL.

---

## 🖼️ 5. Update Gallery Link

Inside:

```
activeTab === 'gallery'
```

Replace the placeholder Google Photos link.

---

## 💳 6. Update Honeymoon Bank Details

Update:

```
navigator.clipboard.writeText("YOUR-ACCOUNT-NUMBER")
```

And also update the displayed account number text.

---

# ▶️ Running the Application

Start development server:

```
npm start
```

Your project will open at:

```
http://localhost:3000
```

---

# 🏗️ Production Build

To create optimized production files:

```
npm run build
```

This creates a `build/` folder ready for hosting.

---

# 🌍 Deployment Options

You can deploy this project to:

- Netlify
- Vercel
- Firebase Hosting
- Shared Hosting (upload `build/` folder)
- Laravel public folder

---

# 🛠️ Backend Integration (Optional)

Currently, RSVP form stores data in React state only.

To connect to a backend:

Inside `handleRsvpSubmit`, replace logic with:

```
fetch("https://your-backend-api.com/rsvp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(rsvpData),
});
```

Recommended backend options:

- Laravel API
- Node.js + Express
- Firebase Firestore
- Supabase

---

# 🔒 Recommended Improvements

Future upgrade ideas:

- Admin dashboard to view RSVPs
- Email confirmation on RSVP
- WhatsApp auto message
- Photo gallery auto-sync
- Guest QR check-in system
- Dark mode toggle
- Music background toggle
- Multi-language support

---

# 📱 Mobile Responsiveness

- Fully responsive layout
- Works on all modern browsers
- Optimized for mobile wedding invites

---

# ❤️ Credits

Built with love using:

- React
- Framer Motion
- Lucide Icons

Designed for an elegant, modern digital wedding experience.

---

# 📄 License

This project is open-source and free to customize for personal wedding use.

---

# 🎉 Final Notes

This wedding invitation includes:

✓ Cinematic intro  
✓ 3D animated envelope  
✓ Elegant hero section  
✓ Countdown timer  
✓ Google Maps embed  
✓ Google Calendar link  
✓ Wedding timeline  
✓ RSVP form  
✓ Honeymoon contribution tab  
✓ Clipboard copy feature  
✓ Fully responsive design

You now have a complete, production-ready digital wedding invitation system.

---

If you’d like, I can also provide:

- ✅ A version formatted for GitHub preview (with badges)
- ✅ A Laravel backend README
- ✅ A deployment README (step-by-step hosting guide)
- ✅ A database schema for RSVP
- ✅ An admin dashboard starter

Just tell me what you’d like next 💍✨
