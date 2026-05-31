import React from 'react';
import { LayoutDashboard, Users, Table2, Calendar, MessageSquare, Kanban, Settings, ChevronRight, Zap, LogOut } from 'lucide-react';

const ALL_NAV = {
  dashboard:   { label: 'Dashboard',        icon: LayoutDashboard },
  leads:       { label: 'Leads',            icon: Users },
  spreadsheet: { label: 'Lead Spreadsheet', icon: Table2 },
  meetings:    { label: 'Meetings',         icon: Zap },
  calendar:    { label: 'Calendar',         icon: Calendar },
  followups:   { label: 'Follow-Ups',       icon: MessageSquare },
  crm:         { label: 'CRM Pipeline',     icon: Kanban },
};

const DEFAULT_ORDER = ['dashboard','leads','spreadsheet','meetings','calendar','followups','crm'];

export default function Sidebar({ active, setActive, brand, navOrder, hiddenNav = [], user, onLogout }) {
  const order = navOrder || DEFAULT_ORDER;
  const visibleItems = order.filter(id => !hiddenNav.includes(id));

  const agencyName = user?.user_metadata?.agency_name || brand?.name || 'APEX';
  const userEmail = user?.email || '';
  const initials = agencyName.slice(0, 2).toUpperCase();

  return (
    <aside style={{ width: 'var(--sidebar-width)', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        {brand?.logo
          ? <img src={brand.logo} alt="logo" style={{ height: 32, objectFit: 'contain' }} />
          : <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#0A0A0C', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
              {(brand?.name || 'A').charAt(0)}
            </div>
        }
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.2px', color: 'var(--text-primary)' }}>
            {brand?.name || 'APEX'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            {(brand?.tagline || 'CRM PLATFORM').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '8px 10px 6px' }}>Main Menu</div>
        {visibleItems.map(id => {
          const item = ALL_NAV[id];
          if (!item) return null;
          const { label, icon: Icon } = item;
          const isActive = active === id;
          return (
            <button key={id} onClick={() => setActive(id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 10px',
              borderRadius: 'var(--radius-md)',
              background: isActive ? 'var(--brand-primary-subtle)' : 'transparent',
              border: isActive ? '1px solid var(--border-brand)' : '1px solid transparent',
              color: isActive ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: isActive ? 500 : 400, textAlign: 'left', cursor: 'pointer',
              transition: 'all var(--transition-fast)', marginBottom: 2,
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </button>
          );
        })}

        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '16px 10px 6px' }}>Account</div>
        <button onClick={() => setActive('settings')} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 10px',
          borderRadius: 'var(--radius-md)',
          background: active === 'settings' ? 'var(--brand-primary-subtle)' : 'transparent',
          border: active === 'settings' ? '1px solid var(--border-brand)' : '1px solid transparent',
          color: active === 'settings' ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
          fontSize: 13, textAlign: 'left', cursor: 'pointer', transition: 'all var(--transition-fast)',
        }}>
          <Settings size={16} /><span style={{ flex: 1 }}>Settings</span>
        </button>
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--brand-primary-subtle)', border: '1px solid var(--border-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--brand-primary)', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agencyName}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
        </div>
        <button
          onClick={onLogout}
          title="Sign out"
          style={{ background: 'none', padding: 4, color: 'var(--text-muted)', borderRadius: 6, cursor: 'pointer', border: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
