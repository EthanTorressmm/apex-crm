import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/leads/Leads';
import Meetings from './components/meetings/Meetings';
import CalendarView from './components/calendar/CalendarView';
import FollowUps from './components/followups/FollowUps';
import CRMPipeline from './components/crm/CRMPipeline';
import Settings from './components/settings/Settings';

import {
  initialLeads, initialMeetings, initialFollowUps, initialDeals,
  loadState, saveState
} from './data/store';

const DEFAULT_BRAND = {
  name: 'APEX',
  tagline: 'CRM Platform',
  logo: null,
  primary: '#C9A84C',
  light: '#E8C96A',
  dark: '#9A7A2E',
  subtle: 'rgba(201,168,76,0.12)',
  glow: 'rgba(201,168,76,0.25)',
  accent: '#F0D080',
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const [leads, setLeads] = useState(() => loadState('leads', initialLeads));
  const [meetings, setMeetings] = useState(() => loadState('meetings', initialMeetings));
  const [followUps, setFollowUps] = useState(() => loadState('followups', initialFollowUps));
  const [deals, setDeals] = useState(() => loadState('deals', initialDeals));
  const [brand, setBrand] = useState(() => loadState('brand', DEFAULT_BRAND));

  // Persist state
  useEffect(() => { saveState('leads', leads); }, [leads]);
  useEffect(() => { saveState('meetings', meetings); }, [meetings]);
  useEffect(() => { saveState('followups', followUps); }, [followUps]);
  useEffect(() => { saveState('deals', deals); }, [deals]);
  useEffect(() => {
    saveState('brand', brand);
    // Apply CSS variables
    const root = document.documentElement;
    if (brand.primary) root.style.setProperty('--brand-primary', brand.primary);
    if (brand.light) root.style.setProperty('--brand-primary-light', brand.light);
    if (brand.dark) root.style.setProperty('--brand-primary-dark', brand.dark);
    if (brand.subtle) root.style.setProperty('--brand-primary-subtle', brand.subtle);
    if (brand.glow) root.style.setProperty('--brand-primary-glow', brand.glow);
    if (brand.accent) root.style.setProperty('--brand-accent', brand.accent);
  }, [brand]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard leads={leads} meetings={meetings} followUps={followUps} deals={deals} setActive={setActivePage} />;
      case 'leads':
        return <Leads leads={leads} setLeads={setLeads} />;
      case 'meetings':
        return <Meetings meetings={meetings} setMeetings={setMeetings} />;
      case 'calendar':
        return <CalendarView meetings={meetings} onAddMeeting={() => setActivePage('meetings')} />;
      case 'followups':
        return <FollowUps followUps={followUps} setFollowUps={setFollowUps} />;
      case 'crm':
        return <CRMPipeline deals={deals} setDeals={setDeals} />;
      case 'settings':
        return <Settings brand={brand} setBrand={setBrand} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar active={activePage} setActive={setActivePage} brand={brand} />
      <div className="main-area">
        {renderPage()}
      </div>
    </div>
  );
}
