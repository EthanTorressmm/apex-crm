# APEX CRM — Marketing Agency Dashboard

A full-stack CRM dashboard built for marketing agencies. Dark theme, gold accents, fully customisable per agency brand.

## Features
- **Dashboard** — Overview stats, recent leads, upcoming meetings
- **Leads** — Full spreadsheet with search, filter, sort, add/edit/delete
- **Meetings** — Grouped timeline view with booking modal
- **Calendar** — Monthly calendar with meeting overlays
- **Follow-Ups** — Note-taking with priority flags and overdue alerts
- **CRM Pipeline** — Drag-and-drop Kanban board (GoHighLevel-style)
- **Settings** — Brand customisation: name, logo, accent colours with live preview

All data persists to `localStorage` automatically.

---

## Quick Start

```bash
cd apex-crm
npm install
npm start
```

Opens at `http://localhost:3000`

---

## Project Structure

```
src/
  components/
    layout/
      Sidebar.jsx       # Left navigation
      TopBar.jsx        # Top header bar
    Dashboard.jsx       # Overview page
    leads/
      Leads.jsx         # Lead spreadsheet
    meetings/
      Meetings.jsx      # Meetings list
    calendar/
      CalendarView.jsx  # Monthly calendar
    followups/
      FollowUps.jsx     # Follow-up notes
    crm/
      CRMPipeline.jsx   # Kanban CRM
    settings/
      Settings.jsx      # Brand customisation
  data/
    store.js            # Mock data + localStorage helpers
  App.jsx               # Root app + state management
  index.css             # Full design system (CSS variables)
```

---

## Customisation Guide

### Change brand colours (in-app)
Go to **Settings** → pick a preset or enter a custom hex code. Changes apply live.

### Change brand colours (in code)
Edit `src/index.css`, update the `:root` CSS variables:
```css
--brand-primary: #C9A84C;      /* Main accent */
--brand-primary-light: #E8C96A;
--brand-primary-dark: #9A7A2E;
```

### Add a new CRM pipeline stage
In `src/data/store.js`, add to `CRM_STAGES` array and `STAGE_COLORS`.

### Add new lead sources or statuses
In `src/data/store.js`, edit `LEAD_STATUSES` and `STATUS_COLORS`.

---

## Next Steps (Phase 2)

### Add a real database (Supabase)
1. `npm install @supabase/supabase-js`
2. Create tables: `leads`, `meetings`, `follow_ups`, `deals`, `agencies`
3. Replace `localStorage` calls in `App.jsx` with Supabase queries
4. Add auth: `supabase.auth.signInWithOAuth({ provider: 'google' })`

### Multi-agency support
- Add an `agency_id` foreign key to all tables
- Wrap the app in an auth gate
- Each agency gets isolated data

### Add CSV import (leads)
In `Leads.jsx`, add a file input that parses CSV rows with `papaparse`:
```bash
npm install papaparse
```

### Email notifications
Use [Resend](https://resend.com) or SendGrid to send follow-up reminders via a serverless function.

### Deploy
```bash
npm run build
# Deploy /build folder to Vercel, Netlify, or Cloudflare Pages
```

---

## Prompts to continue building with Claude

**Add Supabase:**
> "Here is my App.jsx and store.js. Replace all localStorage calls with Supabase. Create the SQL schema too."

**Add CSV import:**
> "Add a CSV import button to my Leads.jsx that parses the file and maps columns to the lead fields."

**Add email reminders:**
> "Create a Supabase Edge Function that sends a daily email digest of overdue follow-ups using Resend."

**Add reporting page:**
> "Add a Reports page to my CRM with bar charts for leads by status, pipeline by stage, and revenue over time using Recharts."
