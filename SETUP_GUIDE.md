# 🎮 FindingTheSquad - Setup & Getting Started

## What's New?

You now have a complete **5-tab navigation system** for the LFG platform with:

### 🏠 Home Tab
- Welcome page with quick action cards
- Jump to any other tab from here
- Platform overview stats

### 📋 LFG Posts Tab
- Browse all Looking For Group posts
- Filter by game title and console
- See player info, discord tags, and descriptions
- Join/Message buttons for each post

### 👤 My Sessions Tab
- View all your own LFG sessions
- Create new sessions (redirects to form)
- Mark sessions as completed
- Delete sessions (coming soon with backend)

### 🔍 Browse Tab
- Browse available games in a sidebar
- Select console platform (PC, PS5, Xbox, Switch)
- See all matching LFG posts for that game/console combo
- Contact players directly

### 💬 Chat Tab
- UI scaffold for direct messaging
- See conversations with other players
- Message history and timestamps
- (Backend chat system coming soon)

## Prerequisites

Before running, make sure you have:
- Node.js 18+ installed
- .NET 8+ for backend
- Visual Studio or JetBrains Rider for backend

## Quick Start

### Step 1: Install Frontend Dependencies
```bash
cd src/frontend
npm install
```

### Step 2: Start Frontend Dev Server
```bash
npm run dev
```
The app will be available at: **http://localhost:5173**

### Step 3: Run Backend
Using Visual Studio/Rider or CLI:
```bash
cd src/backend/FindingTheSquad.WebApi
dotnet run
```
Backend will be at: **http://localhost:5121**

## Testing the Features

### 1. Test the Tabbed Navigation
- Login to your account
- Click each tab to navigate
- Notice the active tab indicator
- Watch the content change

### 2. Create an LFG Session
- Go to "My Sessions" tab
- Click "Create New Session"
- Fill in:
  - Player Name: Your nickname
  - Game Title: e.g., "Valorant", "Fortnite"
  - Console: Select from dropdown
  - Discord Tag: Your#1234
  - Description: What you're looking for
- Submit the form

### 3. View Similar Posts
- After creating a post, go to "LFG Posts" tab
- Use the filters to search by game and console
- You should see your own post plus similar ones
- Try the "Browse" tab for game-based discovery

### 4. Filter by Game & Console
- Go to "LFG Posts" tab
- Select a game from dropdown
- Select a console from dropdown
- Posts will auto-filter in real-time
- Click "Reset Filters" to see all posts

## Architecture

### Frontend Structure
```
src/frontend/src/
├── context/
│   ├── AuthContext.jsx       (User authentication)
│   └── TabContext.jsx        (Tab navigation state)
├── pages/
│   ├── TabbedLayout.jsx      (Main layout container)
│   ├── tabs/
│   │   ├── HomeTab.jsx
│   │   ├── LfgPostsTab.jsx
│   │   ├── MySessionsTab.jsx
│   │   ├── BrowseTab.jsx
│   │   └── ChatTab.jsx
│   ├── CreateLFG.jsx         (Updated with console field)
│   └── ...
└── services/
    └── api.js                (Updated with filter methods)
```

### Backend Structure
```
src/backend/
├── FindingTheSquad.Domain/
│   └── LfgSession.cs        (Added Console field)
├── FindingTheSquad.Application/
│   └── LfgSessions/
│       ├── Commands/
│       │   └── CreateLfgSessionCommand.cs (Updated)
│       └── Queries/
│           ├── GetFilteredLfgSessionsQuery.cs (NEW)
│           └── GetFilteredLfgSessionsHandler.cs (NEW)
├── FindingTheSquad.Infrastructure/
│   └── Migrations/
│       └── AddConsoleFieldToLfgSession.cs (NEW)
└── FindingTheSquad.WebApi/
    └── Controllers/
        └── LfgController.cs  (Added /filter endpoint)
```

## API Endpoints

### Create LFG Session
```
POST /api/lfg
{
  "playerName": "string",
  "gameTitle": "string",
  "console": "string",
  "discordTag": "string",
  "description": "string"
}
```

### Get All Sessions
```
GET /api/lfg
```

### Filter Sessions
```
GET /api/lfg/filter?gameTitle=Valorant&console=PC
```

## Database Changes

A new migration `AddConsoleFieldToLfgSession` was created that:
1. Adds a `Console` column to the `LfgSessions` table
2. Handles the migration when backend starts (automatic)
3. Supports reverting if needed

## Troubleshooting

### "vite: command not found"
```bash
cd src/frontend
npm install
```

### Backend shows migration errors
- Delete the `findingthesquad.db*` files in WebApi folder
- Restart backend (it will recreate the database)

### CORS errors
- Make sure backend is running on `http://localhost:5121`
- Check `VITE_API_BASE_URL` in `.env` matches backend port

### Console dropdown not appearing
- Clear browser cache
- Refresh page
- Check browser console for errors (F12)

## Next Steps / TODO

- [ ] Implement real-time chat with WebSockets
- [ ] Add user profiles and reputation system
- [ ] Implement session joining (accept/reject)
- [ ] Add notifications
- [ ] Implement user blocks/reports
- [ ] Add image uploads for gaming clips
- [ ] Create mobile app version

## Questions or Issues?

Check the IMPLEMENTATION_NOTES.md for technical details about the changes made.

