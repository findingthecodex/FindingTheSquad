# 🎮 FindingTheSquad - Quick Visual Guide

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN / REGISTER PAGE                     │
│                                                               │
│              (Existing authentication flow)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    TABBED LAYOUT (NEW!)                      │
├─────────────────────────────────────────────────────────────┤
│ 🎮 FindingTheSquad │ 🏠 Home │ 📋 LFG Posts │ 👤 My Sessions│
│                    │         │ 🔍 Browse    │ 💬 Chat      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                TAB CONTENT AREA                       │   │
│  │                                                      │   │
│  │  Shows different content based on active tab:       │   │
│  │  • Home → Action cards                             │   │
│  │  • LFG Posts → Browse with filters                 │   │
│  │  • My Sessions → Your posts                        │   │
│  │  • Browse → Game discovery                         │   │
│  │  • Chat → Messaging interface                      │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Tab Navigation Details

### 🏠 **HOME TAB**
```
Welcome to FindingTheSquad
├── Find Teammates (links to LFG Posts)
├── Create a Post (links to My Sessions)
└── Discover Games (links to Browse)

+ Stats Dashboard (Active Sessions, Games, Players)
```

### 📋 **LFG POSTS TAB**
```
Filters:
├── Game Dropdown (All Games / Game List)
├── Console Dropdown (All / PC / PS5 / Xbox / Switch)
└── Reset Filters Button

Results Grid (3 columns):
├── Post Card
│   ├── Game Title + Console Badge
│   ├── Player Name
│   ├── Discord Tag
│   ├── Description
│   └── [Join Session] [Message] buttons
└── ... more posts
```

### 👤 **MY SESSIONS TAB**
```
Header:
├── My LFG Sessions Title
└── [+ Create New Session] Button

Session List:
├── Session Item
│   ├── Game Title + Console Badge
│   ├── Status (Active/Completed)
│   ├── Description
│   ├── Discord Tag
│   ├── Created Date
│   └── [Mark as Completed] [Delete] buttons
└── ... more sessions

Empty State:
└── "No Sessions Yet" + [Create First Session] button
```

### 🔍 **BROWSE TAB**
```
Left Sidebar:
├── Games List (selectable)
└── [Game1] [Game2] [Game3]...

Main Content:
├── Console Selection (when game selected)
│   ├── [PC] [PS5] [Xbox] [Switch]
│   
└── Results (when console selected)
    ├── [Game] on [Console]
    └── Post Results Grid
        ├── Player Name
        ├── Description
        ├── Discord
        └── [Message Player] button
```

### 💬 **CHAT TAB**
```
Left Sidebar:
├── Conversations List
│   ├── User Name
│   ├── Game Name
│   ├── Last Message Preview
│   ├── Timestamp
│   └── Unread Badge (if any)
└── [+] New Message Button

Main Chat Area:
├── Chat Header (User Name + Game)
├── Messages Container
│   ├── Message (Sent - right aligned, blue)
│   ├── Message (Received - left aligned, gray)
│   └── Timestamps
└── Message Input
    ├── Text Input
    └── [Send] Button
```

## State Management Flow

```
┌─────────────────────────────────────┐
│      AuthContext (Existing)         │
│  • User Info                        │
│  • Authentication Token             │
│  • Login/Logout Methods             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│      TabContext (NEW!)              │
│  • activeTab (home/lfg-posts/...)   │
│  • setActiveTab(tabId)              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│      TabbedLayout Component         │
│  Renders active tab based on state  │
└─────────────────────────────────────┘
```

## API Integration

```
Frontend Components              API Endpoints          Backend
─────────────────────────────────────────────────────────────────
HomeTab                    (no API calls)
                          
LfgPostsTab        ─────→  GET /api/lfg         ← LfgController
                  ─────→  GET /api/lfg/filter?gameTitle=&console=
                                                   ↓
                                            GetLfgSessionsQuery
                                            GetFilteredLfgSessionsQuery
                                                   ↓
                                            LfgRepository
                                                   ↓
                                            Database

MySessionsTab      ─────→  GET /api/lfg         ← (filters by username)
                           POST /api/lfg        ← (create, redirects to CreateLFG)

BrowseTab          ─────→  GET /api/lfg         ← (extract unique games)
                  ─────→  GET /api/lfg/filter?gameTitle=&console=

ChatTab                   (no API calls yet - UI scaffold)
                          (WebSocket coming soon)

CreateLFG Form     ─────→  POST /api/lfg        ← CreateLfgSessionCommand
                           with console parameter
```

## Console Platforms Supported

```
┌────────────────────────────────────────┐
│ Supported Gaming Platforms              │
├────────────────────────────────────────┤
│ • PC (Personal Computer)                │
│ • PS5 (PlayStation 5)                   │
│ • Xbox Series X/S                       │
│ • Nintendo Switch                       │
└────────────────────────────────────────┘
```

## Color Scheme

```
Background:    Dark Gradient (#0f1219 → #1a1d27)
Primary:       Cyan (#00d4ff)
Secondary:     Neon Pink (#ff006e)
Text Primary:  White (#ffffff)
Text Secondary: Light Gray (#a0a0a0)
Borders:       Subtle Blue (rgba(0, 212, 255, 0.2))
Success:       Green (#4caf50)
Error:         Red (#ff6b6b)
```

## File Organization

```
Frontend/
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx (existing)
│   │   └── TabContext.jsx (NEW - manages active tab)
│   │
│   ├── pages/
│   │   ├── TabbedLayout.jsx (NEW - main layout)
│   │   ├── TabbedLayout.css
│   │   ├── tabs/ (NEW FOLDER)
│   │   │   ├── HomeTab.jsx
│   │   │   ├── HomeTab.css
│   │   │   ├── LfgPostsTab.jsx
│   │   │   ├── LfgPostsTab.css
│   │   │   ├── MySessionsTab.jsx
│   │   │   ├── MySessionsTab.css
│   │   │   ├── BrowseTab.jsx
│   │   │   ├── BrowseTab.css
│   │   │   ├── ChatTab.jsx
│   │   │   └── ChatTab.css
│   │   ├── CreateLFG.jsx (MODIFIED - added console)
│   │   ├── Home.jsx (existing - login landing)
│   │   ├── Login.jsx (existing)
│   │   ├── Register.jsx (existing)
│   │   └── ... (other pages)
│   │
│   ├── services/
│   │   └── api.js (MODIFIED - added filter methods)
│   │
│   └── App.jsx (MODIFIED - added TabProvider)

Backend/
├── Domain/
│   └── LfgSession.cs (MODIFIED - added Console property)
│
├── Application/
│   └── LfgSessions/
│       ├── Commands/
│       │   ├── CreateLfgSessionCommand.cs (MODIFIED)
│       │   └── CreateLfgSessionHandler.cs (MODIFIED)
│       └── Queries/
│           ├── GetFilteredLfgSessionsQuery.cs (NEW)
│           └── GetFilteredLfgSessionsHandler.cs (NEW)
│
├── Infrastructure/
│   └── Migrations/
│       ├── 20260326120000_AddConsoleFieldToLfgSession.cs (NEW)
│       └── AppDbContextModelSnapshot.cs (MODIFIED)
│
└── WebApi/
    └── Controllers/
        └── LfgController.cs (MODIFIED - added /filter endpoint)
```

## Getting Started - Step by Step

### Step 1️⃣: Start Backend
```bash
cd src/backend/FindingTheSquad.WebApi
dotnet run
# Backend runs on http://localhost:5121
```

### Step 2️⃣: Start Frontend
```bash
cd src/frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 3️⃣: Open in Browser
```
http://localhost:5173
```

### Step 4️⃣: Login
- Use existing account or create new one
- Dashboard redirects to TabbedLayout

### Step 5️⃣: Test Features
- Click tabs to navigate
- Create a post with console
- Filter by game and console
- View your sessions
- Explore browse functionality

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Cannot find module TabContext" | Import missing | Check import in App.jsx |
| Console dropdown not showing | CSS not loaded | Clear cache, refresh |
| Filter not working | Wrong endpoint | Verify backend URL in .env |
| "isActive is undefined" | Old data structure | Clear localStorage, restart |
| CORS error | Backend not running | Start backend first |
| Tab not changing | Context not wrapped | Check TabProvider in App.jsx |

## Next Development Tasks

### Priority 1 (Immediate)
- [ ] Test all 5 tabs load correctly
- [ ] Verify console field saves to database
- [ ] Test filtering by game and console
- [ ] Ensure responsive design works

### Priority 2 (This Sprint)
- [ ] Implement chat backend (WebSockets)
- [ ] Add session join/accept flow
- [ ] Implement delete session endpoint
- [ ] Add user profiles

### Priority 3 (Next Sprint)
- [ ] Notification system
- [ ] User ratings/reputation
- [ ] Image uploads for clips
- [ ] Search across all platforms
- [ ] Mobile app version

---

**Visual Guide Created: March 26, 2026**
**All systems ready for testing! 🚀**

