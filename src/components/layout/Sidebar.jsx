import React from 'react';
import {
  LayoutDashboard, Users, Calendar, MessageSquare,
  Kanban, Settings, ChevronRight, Zap, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads',     label: 'Leads',     icon: Users },
  { id: 'meetings',  label: 'Meetings',  icon: Zap },
  { id: 'calendar',  label: 'Calendar',  icon: Calendar },
  { id: 'followups', label: 'Follow-Ups',icon: MessageSquare },
  { id: 'crm',       label: 'CRM Pipeline', icon: Kanban },
];

export default function Sidebar({ active, setActive, brand }) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        {brand.logo ? (
          <img src={brand.logo} alt="logo" style={{ height: 32, objectFit: 'contain' }} />
        ) : (
          <div style={{
            width: 34, height: 34,
            borderRadius: 8,
            background: 'var(--brand-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800,
            color: '#0A0A0C',
            fontFamily: 'var(--font-display)',
            flexShrink: 0,
          }}>
            {(brand.name || 'A').charAt(0)}
          </div>
        )}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '-0.2px',
            color: 'var(--text-primary)',
          }}>
            {brand.name || 'APEX'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            CRM PLATFORM
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '1px',
          color: 'var(--text-muted)', textTransform: 'uppercase',
          padding: '8px 10px 6px',
        }}>
          Main Menu
        </div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 10px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--brand-primary-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--border-brand)' : '1px solid transparent',
                color: isActive ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                marginBottom: 2,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </button>
          );
        })}

        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '1px',
          color: 'var(--text-muted)', textTransform: 'uppercase',
          padding: '16px 10px 6px',
        }}>
          Account
        </div>
        <button
          onClick={() => setActive('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '9px 10px',
            borderRadius: 'var(--radius-md)',
            background: active === 'settings' ? 'var(--brand-primary-subtle)' : 'transparent',
            border: active === 'settings' ? '1px solid var(--border-brand)' : '1px solid transparent',
            color: active === 'settings' ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
            fontSize: 13,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Settings size={16} />
          <span style={{ flex: 1 }}>Settings</span>
        </button>
      </nav>

      {/* User */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 30, height: 30,
          borderRadius: '50%',
          background: 'var(--brand-primary-subtle)',
          border: '1px solid var(--border-brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)',
          flexShrink: 0,
        }}>
          AR
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Alex Reid</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            admin
          </div>
        </div>
        <button style={{ background: 'none', padding: 4, color: 'var(--text-muted)', borderRadius: 6 }}>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
