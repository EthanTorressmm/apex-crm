import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';

export default function TopBar({ title, subtitle, onAdd, addLabel }) {
  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 16,
      flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        {title && (
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 15,
              color: 'var(--text-primary)',
              letterSpacing: '-0.2px',
            }}>
              {title}
            </span>
            {subtitle && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={14} />
        <input placeholder="Search anything..." />
      </div>

      {/* Notifications */}
      <button style={{
        position: 'relative',
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '7px 9px',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Bell size={15} />
        <span style={{
          position: 'absolute',
          top: 5, right: 5,
          width: 7, height: 7,
          background: 'var(--brand-primary)',
          borderRadius: '50%',
          border: '1.5px solid var(--bg-surface)',
        }} />
      </button>

      {/* Add button */}
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={14} />
          {addLabel || 'Add'}
        </button>
      )}
    </header>
  );
}
