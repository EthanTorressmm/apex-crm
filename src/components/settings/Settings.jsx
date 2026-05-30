import React, { useState } from 'react';
import { Palette, Type, Save, RotateCcw, Upload } from 'lucide-react';
import TopBar from '../layout/TopBar';

const PRESET_THEMES = [
  { name: 'Gold Standard', primary: '#C9A84C', light: '#E8C96A', dark: '#9A7A2E', subtle: 'rgba(201,168,76,0.12)', glow: 'rgba(201,168,76,0.25)', accent: '#F0D080' },
  { name: 'Royal Blue', primary: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8', subtle: 'rgba(59,130,246,0.12)', glow: 'rgba(59,130,246,0.25)', accent: '#93C5FD' },
  { name: 'Emerald', primary: '#10B981', light: '#34D399', dark: '#059669', subtle: 'rgba(16,185,129,0.12)', glow: 'rgba(16,185,129,0.25)', accent: '#6EE7B7' },
  { name: 'Violet', primary: '#8B5CF6', light: '#A78BFA', dark: '#6D28D9', subtle: 'rgba(139,92,246,0.12)', glow: 'rgba(139,92,246,0.25)', accent: '#C4B5FD' },
  { name: 'Rose', primary: '#F43F5E', light: '#FB7185', dark: '#BE123C', subtle: 'rgba(244,63,94,0.12)', glow: 'rgba(244,63,94,0.25)', accent: '#FCA5A5' },
  { name: 'Amber', primary: '#F59E0B', light: '#FCD34D', dark: '#B45309', subtle: 'rgba(245,158,11,0.12)', glow: 'rgba(245,158,11,0.25)', accent: '#FDE68A' },
];

export default function Settings({ brand, setBrand }) {
  const [localBrand, setLocalBrand] = useState({ ...brand });
  const [saved, setSaved] = useState(false);

  const applyTheme = (theme) => {
    const updated = { ...localBrand, ...theme };
    setLocalBrand(updated);
    applyCSS(updated);
  };

  const applyCSS = (b) => {
    const root = document.documentElement;
    if (b.primary) root.style.setProperty('--brand-primary', b.primary);
    if (b.light) root.style.setProperty('--brand-primary-light', b.light);
    if (b.dark) root.style.setProperty('--brand-primary-dark', b.dark);
    if (b.subtle) root.style.setProperty('--brand-primary-subtle', b.subtle);
    if (b.glow) root.style.setProperty('--brand-primary-glow', b.glow);
    if (b.accent) root.style.setProperty('--brand-accent', b.accent);
  };

  const handleColorChange = (key, value) => {
    const updated = { ...localBrand, [key]: value };
    setLocalBrand(updated);
    applyCSS(updated);
  };

  const handleSave = () => {
    setBrand(localBrand);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults = {
      primary: '#C9A84C', light: '#E8C96A', dark: '#9A7A2E',
      subtle: 'rgba(201,168,76,0.12)', glow: 'rgba(201,168,76,0.25)',
      accent: '#F0D080', name: 'APEX', logo: null,
    };
    setLocalBrand(defaults);
    setBrand(defaults);
    applyCSS(defaults);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Settings" subtitle="Brand & Customisation" />
      <div className="page-content">
        <div style={{ maxWidth: 680 }}>

          {/* Agency Identity */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Type size={18} style={{ color: 'var(--brand-primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Agency Identity</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="input-label">Agency Name</label>
                <input
                  className="input"
                  value={localBrand.name || ''}
                  onChange={e => setLocalBrand({ ...localBrand, name: e.target.value })}
                  placeholder="Your Agency Name"
                />
              </div>
              <div className="form-group">
                <label className="input-label">Tagline / Sub-label</label>
                <input
                  className="input"
                  value={localBrand.tagline || ''}
                  onChange={e => setLocalBrand({ ...localBrand, tagline: e.target.value })}
                  placeholder="Growth Agency"
                />
              </div>
            </div>

            {/* Logo upload */}
            <div>
              <label className="input-label">Logo</label>
              <div style={{
                border: '1px dashed var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 120ms',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              >
                {localBrand.logo ? (
                  <div>
                    <img src={localBrand.logo} alt="logo preview" style={{ maxHeight: 50, maxWidth: 200 }} />
                    <button
                      className="btn btn-ghost"
                      style={{ marginTop: 8, display: 'block', margin: '8px auto 0' }}
                      onClick={() => setLocalBrand({ ...localBrand, logo: null })}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <Upload size={20} style={{ color: 'var(--text-muted)', marginBottom: 6 }} />
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Click to upload logo</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>PNG, SVG or JPG — max 2MB</div>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => setLocalBrand({ ...localBrand, logo: ev.target.result });
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Colour Theme */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Palette size={18} style={{ color: 'var(--brand-primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Colour Theme</span>
            </div>

            {/* Preset swatches */}
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Preset Themes</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                {PRESET_THEMES.map(theme => (
                  <button
                    key={theme.name}
                    onClick={() => applyTheme(theme)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      background: 'var(--bg-overlay)',
                      border: localBrand.primary === theme.primary ? `2px solid ${theme.primary}` : '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      padding: '7px 12px',
                      cursor: 'pointer',
                      transition: 'all 120ms',
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: theme.primary,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom colors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { key: 'primary', label: 'Primary Colour' },
                { key: 'light', label: 'Light Variant' },
                { key: 'dark', label: 'Dark Variant' },
                { key: 'accent', label: 'Accent / Glow' },
              ].map(({ key, label }) => (
                <div key={key} className="form-group">
                  <label className="input-label">{label}</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={localBrand[key] || '#C9A84C'}
                      onChange={e => handleColorChange(key, e.target.value)}
                      style={{
                        width: 36, height: 36,
                        border: '1px solid var(--border-default)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: 'none',
                        padding: 2,
                      }}
                    />
                    <input
                      className="input"
                      value={localBrand[key] || ''}
                      onChange={e => handleColorChange(key, e.target.value)}
                      style={{ flex: 1, fontFamily: 'monospace', fontSize: 12 }}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
              Preview
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-ghost">Ghost Button</button>
              <span className="badge badge-gold">Gold Badge</span>
              <span className="badge badge-success">Success</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--brand-primary)' }}>
                {localBrand.name || 'AGENCY NAME'}
              </span>
            </div>
            <div style={{
              marginTop: 14,
              background: 'var(--brand-primary-subtle)',
              border: '1px solid var(--border-brand)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: 13,
              color: 'var(--brand-primary-light)',
            }}>
              This is how brand-coloured panels will appear across the dashboard.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: 130 }}>
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Changes'}
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
