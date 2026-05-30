import React, { useState } from 'react';
import {
  Palette, Type, Save, RotateCcw, Upload, Layout,
  GripVertical, Eye, EyeOff, ChevronRight, Check
} from 'lucide-react';
import TopBar from '../layout/TopBar';
import { loadState, saveState } from '../../data/store';

const PRESET_THEMES = [
  { name: 'Gold Standard', primary: '#C9A84C', light: '#E8C96A', dark: '#9A7A2E', subtle: 'rgba(201,168,76,0.12)', glow: 'rgba(201,168,76,0.25)', accent: '#F0D080' },
  { name: 'Royal Blue',    primary: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8', subtle: 'rgba(59,130,246,0.12)',  glow: 'rgba(59,130,246,0.25)',  accent: '#93C5FD' },
  { name: 'Emerald',       primary: '#10B981', light: '#34D399', dark: '#059669', subtle: 'rgba(16,185,129,0.12)', glow: 'rgba(16,185,129,0.25)', accent: '#6EE7B7' },
  { name: 'Violet',        primary: '#8B5CF6', light: '#A78BFA', dark: '#6D28D9', subtle: 'rgba(139,92,246,0.12)', glow: 'rgba(139,92,246,0.25)', accent: '#C4B5FD' },
  { name: 'Rose',          primary: '#F43F5E', light: '#FB7185', dark: '#BE123C', subtle: 'rgba(244,63,94,0.12)',  glow: 'rgba(244,63,94,0.25)',  accent: '#FCA5A5' },
  { name: 'Amber',         primary: '#F59E0B', light: '#FCD34D', dark: '#B45309', subtle: 'rgba(245,158,11,0.12)', glow: 'rgba(245,158,11,0.25)', accent: '#FDE68A' },
  { name: 'Cyan',          primary: '#06B6D4', light: '#22D3EE', dark: '#0E7490', subtle: 'rgba(6,182,212,0.12)',  glow: 'rgba(6,182,212,0.25)',  accent: '#67E8F9' },
  { name: 'Orange',        primary: '#F97316', light: '#FB923C', dark: '#C2410C', subtle: 'rgba(249,115,22,0.12)', glow: 'rgba(249,115,22,0.25)', accent: '#FED7AA' },
];

const DEFAULT_NAV_ORDER = ['dashboard', 'leads', 'spreadsheet', 'meetings', 'calendar', 'followups', 'crm'];
const NAV_LABELS = {
  dashboard: 'Dashboard', leads: 'Leads', spreadsheet: 'Lead Spreadsheet',
  meetings: 'Meetings', calendar: 'Calendar', followups: 'Follow-Ups', crm: 'CRM Pipeline'
};

const FONT_OPTIONS = [
  { label: 'Syne + DM Sans (Default)', display: 'Syne', body: 'DM Sans' },
  { label: 'Inter (Clean)',             display: 'Inter', body: 'Inter' },
  { label: 'Space Grotesk (Bold)',      display: 'Space Grotesk', body: 'Space Grotesk' },
  { label: 'Outfit (Rounded)',          display: 'Outfit', body: 'Outfit' },
];

export default function Settings({ brand, setBrand }) {
  const [localBrand, setLocalBrand] = useState({ ...brand });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('identity');
  const [navOrder, setNavOrder] = useState(() => loadState('nav_order', DEFAULT_NAV_ORDER));
  const [hiddenNav, setHiddenNav] = useState(() => loadState('hidden_nav', []));
  const [dragNavIdx, setDragNavIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const applyCSS = (b) => {
    const r = document.documentElement;
    if (b.primary) r.style.setProperty('--brand-primary', b.primary);
    if (b.light)   r.style.setProperty('--brand-primary-light', b.light);
    if (b.dark)    r.style.setProperty('--brand-primary-dark', b.dark);
    if (b.subtle)  r.style.setProperty('--brand-primary-subtle', b.subtle);
    if (b.glow)    r.style.setProperty('--brand-primary-glow', b.glow);
    if (b.accent)  r.style.setProperty('--brand-accent', b.accent);
    if (b.displayFont) r.style.setProperty('--font-display', `'${b.displayFont}', sans-serif`);
    if (b.bodyFont)    r.style.setProperty('--font-body', `'${b.bodyFont}', sans-serif`);
  };

  const handleColor = (key, value) => {
    const updated = { ...localBrand, [key]: value };
    setLocalBrand(updated);
    applyCSS(updated);
  };

  const applyTheme = (theme) => {
    const updated = { ...localBrand, ...theme };
    setLocalBrand(updated);
    applyCSS(updated);
  };

  const handleSave = () => {
    setBrand(localBrand);
    saveState('brand', localBrand);
    saveState('nav_order', navOrder);
    saveState('hidden_nav', hiddenNav);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults = {
      primary: '#C9A84C', light: '#E8C96A', dark: '#9A7A2E',
      subtle: 'rgba(201,168,76,0.12)', glow: 'rgba(201,168,76,0.25)',
      accent: '#F0D080', name: 'APEX', logo: null,
      displayFont: 'Syne', bodyFont: 'DM Sans',
    };
    setLocalBrand(defaults);
    setBrand(defaults);
    applyCSS(defaults);
    setNavOrder(DEFAULT_NAV_ORDER);
    setHiddenNav([]);
  };

  // Nav drag-and-drop
  const navDragStart = (i) => setDragNavIdx(i);
  const navDragOver = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
  const navDrop = (e, i) => {
    e.preventDefault();
    if (dragNavIdx === null) return;
    const updated = [...navOrder];
    const [moved] = updated.splice(dragNavIdx, 1);
    updated.splice(i, 0, moved);
    setNavOrder(updated);
    setDragNavIdx(null);
    setDragOverIdx(null);
  };

  const toggleNavItem = (id) => {
    setHiddenNav(h => h.includes(id) ? h.filter(x => x !== id) : [...h, id]);
  };

  const tabStyle = (t) => ({
    padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
    background: tab === t ? 'var(--brand-primary-subtle)' : 'transparent',
    color: tab === t ? 'var(--brand-primary)' : 'var(--text-secondary)',
    border: tab === t ? '1px solid var(--border-brand)' : '1px solid transparent',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Settings" subtitle="Brand & Customisation" />
      <div className="page-content">
        <div style={{ maxWidth: 700 }}>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { id: 'identity', label: 'Agency Identity' },
              { id: 'colours',  label: 'Colours & Theme' },
              { id: 'layout',   label: 'Dashboard Layout' },
              { id: 'fonts',    label: 'Typography' },
            ].map(({ id, label }) => (
              <button key={id} style={tabStyle(id)} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>

          {/* ── IDENTITY ── */}
          {tab === 'identity' && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Type size={18} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Agency Identity</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="input-label">Agency Name</label>
                  <input className="input" value={localBrand.name || ''} onChange={e => setLocalBrand({ ...localBrand, name: e.target.value })} placeholder="Your Agency Name" />
                </div>
                <div className="form-group">
                  <label className="input-label">Tagline</label>
                  <input className="input" value={localBrand.tagline || ''} onChange={e => setLocalBrand({ ...localBrand, tagline: e.target.value })} placeholder="Growth Agency" />
                </div>
              </div>

              {/* Logo upload */}
              <div className="form-group">
                <label className="input-label">Logo</label>
                <div style={{
                  border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)',
                  padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'border-color 120ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                >
                  {localBrand.logo ? (
                    <div>
                      <img src={localBrand.logo} alt="logo" style={{ maxHeight: 56, maxWidth: 220, borderRadius: 6 }} />
                      <div style={{ marginTop: 10 }}>
                        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setLocalBrand({ ...localBrand, logo: null })}>Remove logo</button>
                      </div>
                    </div>
                  ) : (
                    <label style={{ cursor: 'pointer', display: 'block' }}>
                      <Upload size={22} style={{ color: 'var(--text-muted)', marginBottom: 6 }} />
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Click to upload your logo</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>PNG, SVG or JPG — max 2MB. Will appear in the sidebar.</div>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                        const file = e.target.files[0]; if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setLocalBrand({ ...localBrand, logo: ev.target.result });
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Live preview */}
              <div style={{ background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                {localBrand.logo
                  ? <img src={localBrand.logo} alt="logo" style={{ height: 34, objectFit: 'contain' }} />
                  : <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#0A0A0C', fontFamily: 'var(--font-display)' }}>
                      {(localBrand.name || 'A').charAt(0)}
                    </div>
                }
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}>{localBrand.name || 'Agency Name'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{(localBrand.tagline || 'CRM PLATFORM').toUpperCase()}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── COLOURS ── */}
          {tab === 'colours' && (
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Palette size={18} style={{ color: 'var(--brand-primary)' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Preset Themes</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {PRESET_THEMES.map(theme => {
                    const active = localBrand.primary === theme.primary;
                    return (
                      <button key={theme.name} onClick={() => applyTheme(theme)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        background: active ? theme.subtle : 'var(--bg-overlay)',
                        border: active ? `2px solid ${theme.primary}` : '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)', padding: '10px 8px', cursor: 'pointer',
                        transition: 'all 120ms',
                      }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: theme.primary, border: '3px solid rgba(255,255,255,0.15)' }} />
                        <span style={{ fontSize: 11, color: active ? theme.primary : 'var(--text-secondary)', fontWeight: active ? 600 : 400, textAlign: 'center', lineHeight: 1.3 }}>{theme.name}</span>
                        {active && <Check size={11} style={{ color: theme.primary }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Custom Colours</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  {[
                    { key: 'primary', label: 'Primary Accent' },
                    { key: 'light',   label: 'Light Variant' },
                    { key: 'dark',    label: 'Dark Variant' },
                    { key: 'accent',  label: 'Highlight / Glow' },
                  ].map(({ key, label }) => (
                    <div key={key} className="form-group">
                      <label className="input-label">{label}</label>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="color" value={localBrand[key] || '#C9A84C'} onChange={e => handleColor(key, e.target.value)}
                          style={{ width: 36, height: 36, border: '1px solid var(--border-default)', borderRadius: 8, cursor: 'pointer', background: 'none', padding: 2 }} />
                        <input className="input" value={localBrand[key] || ''} onChange={e => handleColor(key, e.target.value)}
                          style={{ flex: 1, fontFamily: 'monospace', fontSize: 12 }} placeholder="#000000" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live preview */}
              <div className="card">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Live Preview</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
                  <button className="btn btn-primary">Primary Button</button>
                  <button className="btn btn-ghost">Ghost Button</button>
                  <span className="badge badge-gold">Badge</span>
                  <span className="badge badge-success">Success</span>
                  <span className="badge badge-danger">Danger</span>
                </div>
                <div style={{ background: 'var(--brand-primary-subtle)', border: '1px solid var(--border-brand)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13, color: 'var(--brand-primary-light)' }}>
                  Brand-coloured panels will look like this across the dashboard.
                </div>
              </div>
            </div>
          )}

          {/* ── LAYOUT ── */}
          {tab === 'layout' && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Layout size={18} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Sidebar Navigation Order</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 18 }}>
                Drag to reorder menu items. Toggle the eye icon to show or hide a page.
              </p>
              {navOrder.map((id, i) => {
                const hidden = hiddenNav.includes(id);
                const isDraggingOver = dragOverIdx === i;
                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={() => navDragStart(i)}
                    onDragOver={e => navDragOver(e, i)}
                    onDrop={e => navDrop(e, i)}
                    onDragEnd={() => { setDragNavIdx(null); setDragOverIdx(null); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px',
                      marginBottom: 6,
                      borderRadius: 'var(--radius-md)',
                      background: isDraggingOver ? 'var(--brand-primary-subtle)' : 'var(--bg-overlay)',
                      border: isDraggingOver ? '1px solid var(--border-brand)' : '1px solid var(--border-subtle)',
                      cursor: 'grab', opacity: hidden ? 0.45 : 1,
                      transition: 'all 120ms',
                    }}
                  >
                    <GripVertical size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{NAV_LABELS[id]}</span>
                    <button
                      onClick={() => toggleNavItem(id)}
                      style={{ background: 'none', color: hidden ? 'var(--text-muted)' : 'var(--brand-primary)', padding: 4, borderRadius: 6 }}
                    >
                      {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FONTS ── */}
          {tab === 'fonts' && (
            <div className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Typography</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 18 }}>Choose the font pairing for your dashboard.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FONT_OPTIONS.map(font => {
                  const active = (localBrand.displayFont || 'Syne') === font.display;
                  return (
                    <div key={font.label} onClick={() => {
                      const updated = { ...localBrand, displayFont: font.display, bodyFont: font.body };
                      setLocalBrand(updated);
                      applyCSS(updated);
                    }} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: active ? 'var(--brand-primary-subtle)' : 'var(--bg-overlay)',
                      border: active ? '1px solid var(--border-brand)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer', transition: 'all 120ms',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: `'${font.display}', sans-serif`, fontSize: 18, fontWeight: 700, color: active ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                          {font.label}
                        </div>
                        <div style={{ fontFamily: `'${font.body}', sans-serif`, fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                          The quick brown fox jumps over the lazy dog
                        </div>
                      </div>
                      {active && <Check size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save / Reset */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: 140 }}>
              <Save size={14} /> {saved ? '✓ Saved!' : 'Save All Changes'}
            </button>
            <button className="btn btn-ghost" onClick={handleReset}>
              <RotateCcw size={14} /> Reset Defaults
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
