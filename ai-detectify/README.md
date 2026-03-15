# AI Detectify 🔍

> Detect AI-generated content instantly — a modern SaaS-style college project.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Landing page navigation
│   │   └── DashboardLayout.jsx # App sidebar layout
│   └── ui/
│       ├── ThemeToggle.jsx     # Dark/light mode button
│       ├── LoadingSpinner.jsx  # Reusable spinner
│       └── ResultMeter.jsx     # AI probability gauge
├── context/
│   ├── AuthContext.jsx         # Authentication state
│   ├── ThemeContext.jsx        # Dark/light mode state
│   └── HistoryContext.jsx      # Scan history state
├── pages/
│   ├── LandingPage.jsx         # Public homepage
│   ├── LoginPage.jsx           # Authentication
│   ├── RegisterPage.jsx        # Registration
│   ├── DashboardPage.jsx       # App overview
│   ├── DetectionPage.jsx       # Core AI detection
│   ├── HistoryPage.jsx         # Past scans table
│   ├── AboutPage.jsx           # Project info
│   ├── ContactPage.jsx         # Contact form
│   └── SettingsPage.jsx        # Profile & preferences
├── App.jsx                     # Routes configuration
├── main.jsx                    # Entry point
└── index.css                   # Tailwind + custom styles
```

## ✨ Features

- 🔍 **AI Detection** — Paste text or upload files to analyze
- 📊 **Visual Results** — Animated circular meter + probability bars
- 🌓 **Dark/Light Mode** — Persistent theme across sessions
- 📱 **Fully Responsive** — Mobile, tablet, desktop
- 🔐 **Auth Flow** — Login, register, protected routes
- 📜 **Scan History** — Filterable table of past detections
- ⚙️ **Settings** — Profile, theme, notifications
- 🎨 **Glassmorphism UI** — Modern SaaS aesthetic

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router 6 | Client-side routing |
| Tailwind CSS 3 | Styling |
| Vite 5 | Build tool |
| Lucide React | Icons |
| Context API | State management |

## 📄 Pages

| Route | Page |
|---|---|
| `/` | Landing |
| `/login` | Login |
| `/register` | Register |
| `/app` | Dashboard |
| `/app/detect` | AI Detection |
| `/app/history` | History |
| `/app/about` | About |
| `/app/contact` | Contact |
| `/app/settings` | Settings |

---

Built with ❤️ as a Final Year College Project — 2026
