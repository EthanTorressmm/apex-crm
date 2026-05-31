import React, { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './lib/supabase';
import * as db from './lib/db';

import AuthScreen from './components/auth/AuthScreen';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/leads/Leads';
import LeadSpreadsheet from './components/leads/LeadSpreadsheet';
import Meetings from './components/meetings/Meetings';
import CalendarView from './components/calendar/CalendarView';
import FollowUps from './components/followups/FollowUps';
import CRMPipeline from './components/crm/CRMPipeline';
import Settings from './components/settings/Settings';

import { initialLeads, initialMeetings, initialFollowUps, initialDeals, loadState, saveState } from './data/store';

const DEFAULT_BRAND = {
  name: 'APEX', tagline: 'CRM Platform', logo: null,
  primary: '#C9A84C', light: '#E8C96A', dark: '#9A7A2E',
  subtle: 'rgba(201,168,76,0.12)', glow: 'rgba(201,168,76,0.25)', accent: '#F0D080',
  displayFont: 'Syne', bodyFont: 'DM Sans',
};

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const [activePage, setActivePage] = useState('dashboard');
  const [leads, setLeadsState] = useState([]);
  const [meetings, setMeetingsState] = useState([]);
  const [followUps, setFollowUpsState] = useState([]);
  const [deals, setDealsState] = useState([]);
  const [brand, setBrandState] = useState(() => loadState('brand', DEFAULT_BRAND));
  const [navOrder, setNavOrder] = useState(() => loadState('nav_order', ['dashboard','leads','spreadsheet','meetings','calendar','followups','crm']));
  const [hiddenNav, setHiddenNav] = useState(() => loadState('hidden_nav', []));

  // ── Auth listener ──────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load data when logged in ───────────────────────────────────────────
  useEffect(() => {
    if (!session?.user) return;
    const userId = session.user.id;
    setDataLoading(true);

    Promise.all([
      db.fetchLeads(userId).catch(() => initialLeads),
      db.fetchMeetings(userId).catch(() => initialMeetings),
      db.fetchFollowUps(userId).catch(() => initialFollowUps),
      db.fetchDeals(userId).catch(() => initialDeals),
      db.fetchSettings(userId).catch(() => null),
    ]).then(([leads, meetings, followUps, deals, settings]) => {
      setLeadsState(leads?.length ? leads : []);
      setMeetingsState(meetings?.length ? meetings : []);
      setFollowUpsState(followUps?.length ? followUps : []);
      setDealsState(deals?.length ? deals : []);
      if (settings) {
        setBrandState(settings.brand || DEFAULT_BRAND);
        setNavOrder(settings.navOrder || navOrder);
        setHiddenNav(settings.hiddenNav || []);
      }
      setDataLoading(false);
    });
  }, [session]);

  // ── Apply brand CSS ────────────────────────────────────────────────────
  useEffect(() => {
    const r = document.documentElement;
    if (brand.primary) r.style.setProperty('--brand-primary', brand.primary);
    if (brand.light)   r.style.setProperty('--brand-primary-light', brand.light);
    if (brand.dark)    r.style.setProperty('--brand-primary-dark', brand.dark);
    if (brand.subtle)  r.style.setProperty('--brand-primary-subtle', brand.subtle);
    if (brand.glow)    r.style.setProperty('--brand-primary-glow', brand.glow);
    if (brand.accent)  r.style.setProperty('--brand-accent', brand.accent);
    if (brand.displayFont) r.style.setProperty('--font-display', `'${brand.displayFont}', sans-serif`);
    if (brand.bodyFont)    r.style.setProperty('--font-body', `'${brand.bodyFont}', sans-serif`);
  }, [brand]);

  // ── Wrapped setters that also sync to Supabase ─────────────────────────
  const userId = session?.user?.id;

  const setLeads = async (updater) => {
    const next = typeof updater === 'function' ? updater(leads) : updater;
    setLeadsState(next);
    // Upsert changed rows
    if (userId) {
      const prev = leads;
      const changed = next.filter(n => {
        const old = prev.find(p => p.id === n.id);
        return !old || JSON.stringify(old) !== JSON.stringify(n);
      });
      const deleted = prev.filter(p => !next.find(n => n.id === p.id));
      for (const row of changed) await db.upsertLead(row, userId).catch(console.error);
      for (const row of deleted) await db.deleteLead(row.id).catch(console.error);
    }
  };

  const setMeetings = async (updater) => {
    const next = typeof updater === 'function' ? updater(meetings) : updater;
    setMeetingsState(next);
    if (userId) {
      const prev = meetings;
      const changed = next.filter(n => { const old = prev.find(p => p.id === n.id); return !old || JSON.stringify(old) !== JSON.stringify(n); });
      const deleted = prev.filter(p => !next.find(n => n.id === p.id));
      for (const row of changed) await db.upsertMeeting(row, userId).catch(console.error);
      for (const row of deleted) await db.deleteMeeting(row.id).catch(console.error);
    }
  };

  const setFollowUps = async (updater) => {
    const next = typeof updater === 'function' ? updater(followUps) : updater;
    setFollowUpsState(next);
    if (userId) {
      const prev = followUps;
      const changed = next.filter(n => { const old = prev.find(p => p.id === n.id); return !old || JSON.stringify(old) !== JSON.stringify(n); });
      const deleted = prev.filter(p => !next.find(n => n.id === p.id));
      for (const row of changed) await db.upsertFollowUp(row, userId).catch(console.error);
      for (const row of deleted) await db.deleteFollowUp(row.id).catch(console.error);
    }
  };

  const setDeals = async (updater) => {
    const next = typeof updater === 'function' ? updater(deals) : updater;
    setDealsState(next);
    if (userId) {
      const prev = deals;
      const changed = next.filter(n => { const old = prev.find(p => p.id === n.id); return !old || JSON.stringify(old) !== JSON.stringify(n); });
      const deleted = prev.filter(p => !next.find(n => n.id === p.id));
      for (const row of changed) await db.upsertDeal(row, userId).catch(console.error);
      for (const row of deleted) await db.deleteDeal(row.id).catch(console.error);
    }
  };

  const setBrand = async (newBrand) => {
    setBrandState(newBrand);
    saveState('brand', newBrand);
    if (userId) {
      await db.saveSettings(userId, { brand: newBrand, navOrder, hiddenNav }).catch(console.error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLeadsState([]);
    setMeetingsState([]);
    setFollowUpsState([]);
    setDealsState([]);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-primary)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#0A0A0C', fontFamily: 'var(--font-display)' }}>A</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  if (dataLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-primary)', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading your data...</div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':   return <Dashboard leads={leads} meetings={meetings} followUps={followUps} deals={deals} setActive={setActivePage} />;
      case 'leads':       return <Leads leads={leads} setLeads={setLeads} />;
      case 'spreadsheet': return <LeadSpreadsheet leads={leads} setLeads={setLeads} />;
      case 'meetings':    return <Meetings meetings={meetings} setMeetings={setMeetings} />;
      case 'calendar':    return <CalendarView meetings={meetings} onAddMeeting={() => setActivePage('meetings')} />;
      case 'followups':   return <FollowUps followUps={followUps} setFollowUps={setFollowUps} />;
      case 'crm':         return <CRMPipeline deals={deals} setDeals={setDeals} />;
      case 'settings':    return <Settings brand={brand} setBrand={setBrand} />;
      default:            return null;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        active={activePage} setActive={setActivePage}
        brand={brand} navOrder={navOrder} hiddenNav={hiddenNav}
        user={session.user} onLogout={handleLogout}
      />
      <div className="main-area">{renderPage()}</div>
    </div>
  );
}
