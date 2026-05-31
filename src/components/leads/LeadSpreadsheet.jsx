import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Plus, Trash2, Download, Upload, Settings2, X, Check,
  GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, Tag, Search
} from 'lucide-react';
import TopBar from '../layout/TopBar';
import { formatCurrency, getInitials, getAvatarColor, loadState, saveState } from '../../data/store';

// ─── Default column definitions ────────────────────────────────────────────
const DEFAULT_COLUMNS = [
  { id: 'name',      label: 'Name',       type: 'text',     width: 180, required: true,  visible: true },
  { id: 'company',   label: 'Company',    type: 'text',     width: 160, required: false, visible: true },
  { id: 'email',     label: 'Email',      type: 'email',    width: 200, required: false, visible: true },
  { id: 'phone',     label: 'Phone',      type: 'text',     width: 140, required: false, visible: true },
  { id: 'status',    label: 'Status',     type: 'status',   width: 130, required: false, visible: true },
  { id: 'source',    label: 'Source',     type: 'select',   width: 130, required: false, visible: true },
  { id: 'value',     label: 'Value (£)',  type: 'currency', width: 110, required: false, visible: true },
  { id: 'assignee',  label: 'Assignee',   type: 'text',     width: 120, required: false, visible: true },
  { id: 'tags',      label: 'Tags',       type: 'tags',     width: 180, required: false, visible: true },
  { id: 'website',   label: 'Website',    type: 'url',      width: 170, required: false, visible: false },
  { id: 'notes',     label: 'Notes',      type: 'text',     width: 220, required: false, visible: false },
  { id: 'createdAt', label: 'Date Added', type: 'date',     width: 120, required: false, visible: true },
];

const SOURCES = ['LinkedIn', 'Referral', 'Cold Email', 'Website', 'Event', 'Other'];
const COL_TYPES = ['text', 'email', 'url', 'number', 'currency', 'date', 'select', 'status', 'tags'];

// ─── Status badge colours ───────────────────────────────────────────────────
const STATUS_PALETTE = [
  { bg: 'rgba(96,165,250,0.15)',  color: '#60A5FA' },
  { bg: 'rgba(167,139,250,0.15)', color: '#A78BFA' },
  { bg: 'rgba(74,222,128,0.15)',  color: '#4ADE80' },
  { bg: 'rgba(251,191,36,0.15)',  color: '#FBBF24' },
  { bg: 'rgba(248,113,113,0.15)', color: '#F87171' },
  { bg: 'rgba(201,168,76,0.15)',  color: '#C9A84C' },
  { bg: 'rgba(56,189,248,0.15)',  color: '#38BDF8' },
  { bg: 'rgba(251,146,60,0.15)',  color: '#FB923C' },
];

function getStatusStyle(statuses, value) {
  const idx = statuses.indexOf(value);
  const p = STATUS_PALETTE[idx % STATUS_PALETTE.length] || STATUS_PALETTE[0];
  return p;
}

// ─── Cell editor ────────────────────────────────────────────────────────────
function CellEditor({ col, value, onSave, onCancel, statuses, sources }) {
  const [val, setVal] = useState(
    col.type === 'tags' ? (Array.isArray(value) ? value.join(', ') : value || '') : (value ?? '')
  );
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); ref.current?.select?.(); }, []);

  const commit = () => {
    let v = val;
    if (col.type === 'currency' || col.type === 'number') v = parseFloat(val) || 0;
    if (col.type === 'tags') v = val.split(',').map(t => t.trim()).filter(Boolean);
    onSave(v);
  };

  const onKey = e => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') onCancel();
  };

  if (col.type === 'status') {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 200, background: 'var(--bg-elevated)', border: '1px solid var(--border-brand)', borderRadius: 8, padding: 6, minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        {statuses.map(s => {
          const { bg, color } = getStatusStyle(statuses, s);
          return (
            <div key={s} onClick={() => onSave(s)} style={{ padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color, background: val === s ? bg : 'transparent', marginBottom: 2 }}
              onMouseEnter={e => e.currentTarget.style.background = bg}
              onMouseLeave={e => e.currentTarget.style.background = val === s ? bg : 'transparent'}
            >{s}</div>
          );
        })}
        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 4, paddingTop: 4 }}>
          <div onClick={onCancel} style={{ padding: '4px 10px', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</div>
        </div>
      </div>
    );
  }

  if (col.type === 'select') {
    const opts = col.id === 'source' ? sources : (col.options || []);
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 200, background: 'var(--bg-elevated)', border: '1px solid var(--border-brand)', borderRadius: 8, padding: 6, minWidth: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        {opts.map(o => (
          <div key={o} onClick={() => onSave(o)} style={{ padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: val === o ? 'var(--brand-primary)' : 'var(--text-primary)', background: val === o ? 'var(--brand-primary-subtle)' : 'transparent', marginBottom: 2 }}>{o}</div>
        ))}
        <div onClick={onCancel} style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 4, paddingTop: 4, padding: '4px 10px', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</div>
      </div>
    );
  }

  return (
    <input
      ref={ref}
      type={col.type === 'email' ? 'email' : col.type === 'date' ? 'date' : col.type === 'url' ? 'url' : col.type === 'currency' || col.type === 'number' ? 'number' : 'text'}
      value={val}
      onChange={e => setVal(e.target.value)}
      onKeyDown={onKey}
      onBlur={commit}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'var(--bg-elevated)',
        border: '2px solid var(--brand-primary)',
        borderRadius: 0, padding: '0 8px',
        color: 'var(--text-primary)', fontSize: 13,
        zIndex: 100, outline: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    />
  );
}

// ─── Cell renderer ──────────────────────────────────────────────────────────
function CellValue({ col, value, statuses }) {
  if (value === null || value === undefined || value === '') {
    return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>;
  }
  if (col.type === 'currency') return <span style={{ color: 'var(--brand-primary)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{formatCurrency(value)}</span>;
  if (col.type === 'status') {
    const { bg, color } = getStatusStyle(statuses, value);
    return <span style={{ background: bg, color, borderRadius: 100, padding: '2px 9px', fontSize: 11, fontWeight: 500 }}>{value}</span>;
  }
  if (col.type === 'tags') {
    const arr = Array.isArray(value) ? value : [];
    return <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{arr.map(t => <span key={t} style={{ background: 'var(--brand-primary-subtle)', color: 'var(--brand-primary)', borderRadius: 100, padding: '1px 7px', fontSize: 10, fontWeight: 500 }}>{t}</span>)}</div>;
  }
  if (col.type === 'url') return <a href={value} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--color-info)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{value}</a>;
  if (col.type === 'date') {
    try { return <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>; } catch { return <span>{value}</span>; }
  }
  return <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{String(value)}</span>;
}

// ─── Column manager modal ───────────────────────────────────────────────────
function ColumnManager({ columns, setColumns, statuses, setStatuses, sources, setSources, onClose }) {
  const [cols, setCols] = useState(columns.map(c => ({ ...c })));
  const [stats, setStats] = useState([...statuses]);
  const [srcs, setSrcs] = useState([...sources]);
  const [newCol, setNewCol] = useState({ label: '', type: 'text' });
  const [newStatus, setNewStatus] = useState('');
  const [newSource, setNewSource] = useState('');
  const [tab, setTab] = useState('columns');

  const addCol = () => {
    if (!newCol.label.trim()) return;
    const id = newCol.label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    setCols([...cols, { id, label: newCol.label, type: newCol.type, width: 150, required: false, visible: true, options: [] }]);
    setNewCol({ label: '', type: 'text' });
  };
  const removeCol = (id) => setCols(cols.filter(c => c.id !== id));
  const toggleVisible = (id) => setCols(cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  const renameCol = (id, label) => setCols(cols.map(c => c.id === id ? { ...c, label } : c));

  const save = () => {
    setColumns(cols);
    setStatuses(stats);
    setSources(srcs);
    onClose();
  };

  const tabStyle = active => ({
    padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
    background: active ? 'var(--brand-primary-subtle)' : 'transparent',
    color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
    border: active ? '1px solid var(--border-brand)' : '1px solid transparent',
  });

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 560, maxHeight: '80vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>Customise Spreadsheet</h2>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}><X size={16} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {['columns', 'statuses', 'sources'].map(t => (
            <button key={t} style={tabStyle(tab === t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Columns tab */}
        {tab === 'columns' && (
          <div>
            <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 16 }}>
              {cols.map((col, i) => (
                <div key={col.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <GripVertical size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <button onClick={() => toggleVisible(col.id)} style={{ background: 'none', color: col.visible ? 'var(--brand-primary)' : 'var(--text-muted)', padding: 2 }}>
                    {col.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <input
                    className="input" value={col.label}
                    onChange={e => renameCol(col.id, e.target.value)}
                    style={{ flex: 1, padding: '5px 9px', fontSize: 13 }}
                    disabled={col.required}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 60, textAlign: 'right' }}>{col.type}</span>
                  {!col.required && (
                    <button onClick={() => removeCol(col.id)} style={{ background: 'none', color: 'var(--color-danger)', padding: 2 }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="New column name" value={newCol.label} onChange={e => setNewCol({ ...newCol, label: e.target.value })} style={{ flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && addCol()} />
              <select className="input" value={newCol.type} onChange={e => setNewCol({ ...newCol, type: e.target.value })} style={{ width: 110 }}>
                {COL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <button className="btn btn-primary" onClick={addCol} style={{ padding: '8px 12px' }}><Plus size={14} /></button>
            </div>
          </div>
        )}

        {/* Statuses tab */}
        {tab === 'statuses' && (
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Drag to reorder. Each status gets a unique colour automatically.</p>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              {stats.map((s, i) => {
                const { bg, color } = getStatusStyle(stats, s);
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13 }}>{s}</span>
                    <span style={{ background: bg, color, borderRadius: 100, padding: '2px 9px', fontSize: 11, fontWeight: 500 }}>{s}</span>
                    <button onClick={() => setStats(stats.filter((_, j) => j !== i))} style={{ background: 'none', color: 'var(--color-danger)', padding: 2 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="New status..." value={newStatus} onChange={e => setNewStatus(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newStatus.trim()) { setStats([...stats, newStatus.trim()]); setNewStatus(''); } }} />
              <button className="btn btn-primary" onClick={() => { if (newStatus.trim()) { setStats([...stats, newStatus.trim()]); setNewStatus(''); } }}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Sources tab */}
        {tab === 'sources' && (
          <div>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              {srcs.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ flex: 1, fontSize: 13 }}>{s}</span>
                  <button onClick={() => setSrcs(srcs.filter((_, j) => j !== i))} style={{ background: 'none', color: 'var(--color-danger)', padding: 2 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="New source..." value={newSource} onChange={e => setNewSource(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newSource.trim()) { setSrcs([...srcs, newSource.trim()]); setNewSource(''); } }} />
              <button className="btn btn-primary" onClick={() => { if (newSource.trim()) { setSrcs([...srcs, newSource.trim()]); setNewSource(''); } }}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Spreadsheet Component ─────────────────────────────────────────────
export default function LeadSpreadsheet({ leads, setLeads }) {
  const [columns, setColumns] = useState(() => loadState('lead_columns', DEFAULT_COLUMNS));
  const [statuses, setStatuses] = useState(() => loadState('lead_statuses', ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed Won', 'Closed Lost']));
  const [sources, setSources] = useState(() => loadState('lead_sources', SOURCES));
  const [editCell, setEditCell] = useState(null); // { rowId, colId }
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' });
  const [search, setSearch] = useState('');
  const [showColManager, setShowColManager] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const fileInputRef = useRef();

  // Persist column config
  useEffect(() => { saveState('lead_columns', columns); }, [columns]);
  useEffect(() => { saveState('lead_statuses', statuses); }, [statuses]);
  useEffect(() => { saveState('lead_sources', sources); }, [sources]);

  const visibleCols = columns.filter(c => c.visible);

  // Add empty row
  const addRow = () => {
    const newRow = { id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
    columns.forEach(c => { if (!(c.id in newRow)) newRow[c.id] = c.type === 'tags' ? [] : ''; });
    setLeads([newRow, ...leads]);
  };

  // Update a cell
  const updateCell = (rowId, colId, value) => {
    setLeads(leads.map(r => r.id === rowId ? { ...r, [colId]: value } : r));
    setEditCell(null);
  };

  // Delete selected rows
  const deleteSelected = () => {
    if (!selectedRows.size) return;
    if (window.confirm(`Delete ${selectedRows.size} row(s)?`)) {
      setLeads(leads.filter(r => !selectedRows.has(r.id)));
      setSelectedRows(new Set());
    }
  };

  // Toggle sort
  const toggleSort = col => {
    setSort(s => s.key === col.id ? { key: col.id, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: col.id, dir: 'asc' });
  };

  // Filter + sort
  const filtered = leads
    .filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || visibleCols.some(c => String(r[c.id] ?? '').toLowerCase().includes(q));
      const matchStatus = filterStatus === 'All' || r.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let va = a[sort.key], vb = b[sort.key];
      if (typeof va === 'number' || typeof vb === 'number') { va = +va || 0; vb = +vb || 0; }
      else { va = String(va ?? '').toLowerCase(); vb = String(vb ?? '').toLowerCase(); }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });

  // CSV Export
  const exportCSV = () => {
    const headers = visibleCols.map(c => c.label);
    const rows = filtered.map(r =>
      visibleCols.map(c => {
        const v = r[c.id];
        if (Array.isArray(v)) return v.join('; ');
        return String(v ?? '');
      })
    );
    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // CSV / Excel Import
  const importFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      const lines = text.split('\n').filter(Boolean);
      if (lines.length < 2) return;

      // Parse CSV
      const parseRow = line => {
        const cells = []; let cur = ''; let inQ = false;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') { inQ = !inQ; }
          else if (line[i] === ',' && !inQ) { cells.push(cur.trim()); cur = ''; }
          else cur += line[i];
        }
        cells.push(cur.trim());
        return cells;
      };

      const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      const imported = lines.slice(1).map(line => {
        const cells = parseRow(line);
        const row = { id: Date.now().toString() + Math.random(), createdAt: new Date().toISOString().split('T')[0] };
        headers.forEach((h, i) => {
          // Try to match to existing column ids
          const col = columns.find(c => c.id === h || c.label.toLowerCase().replace(/[^a-z0-9]/g, '_') === h);
          if (col) row[col.id] = cells[i] || '';
          else row[h] = cells[i] || '';
        });
        return row;
      });

      setLeads(prev => [...imported, ...prev]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Row select
  const toggleRow = (id, e) => {
    if (e.shiftKey) {
      // range select
      const ids = filtered.map(r => r.id);
      const last = [...selectedRows].pop();
      const a = ids.indexOf(last), b = ids.indexOf(id);
      const range = ids.slice(Math.min(a, b), Math.max(a, b) + 1);
      setSelectedRows(new Set([...selectedRows, ...range]));
    } else {
      const next = new Set(selectedRows);
      if (next.has(id)) next.delete(id); else next.add(id);
      setSelectedRows(next);
    }
  };
  const toggleAll = () => {
    if (selectedRows.size === filtered.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map(r => r.id)));
  };

  const SortIcon = ({ col }) => {
    if (sort.key !== col.id) return <ChevronDown size={11} style={{ opacity: 0.25 }} />;
    return sort.dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Lead Spreadsheet" subtitle={`${filtered.length} of ${leads.length} leads`} />

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '10px 28px', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)', flexShrink: 0,
      }}>
        {/* Search */}
        <div className="search-bar" style={{ flex: '0 0 auto' }}>
          <Search size={14} />
          <input placeholder="Search all columns..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
        </div>

        {/* Status filter */}
        <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 140 }}>
          <option value="All">All Statuses</option>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>

        <div style={{ flex: 1 }} />

        {/* Actions */}
        {selectedRows.size > 0 && (
          <button className="btn btn-danger" onClick={deleteSelected} style={{ gap: 6 }}>
            <Trash2 size={13} /> Delete {selectedRows.size}
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => setShowColManager(true)} style={{ gap: 6 }}>
          <Settings2 size={14} /> Columns
        </button>
        <button className="btn btn-ghost" onClick={exportCSV} style={{ gap: 6 }}>
          <Download size={13} /> Export CSV
        </button>
        <button className="btn btn-ghost" onClick={() => fileInputRef.current.click()} style={{ gap: 6 }}>
          <Upload size={13} /> Import CSV
        </button>
        <input ref={fileInputRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={importFile} />
        <button className="btn btn-primary" onClick={addRow} style={{ gap: 6 }}>
          <Plus size={14} /> Add Row
        </button>
      </div>

      {/* Spreadsheet */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{
          borderCollapse: 'collapse', fontSize: 13,
          tableLayout: 'fixed',
          minWidth: visibleCols.reduce((s, c) => s + c.width, 60) + 'px',
        }}>
          {/* Col widths */}
          <colgroup>
            <col style={{ width: 40 }} />
            {visibleCols.map(c => <col key={c.id} style={{ width: c.width }} />)}
          </colgroup>

          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              {/* Checkbox header */}
              <th style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)', padding: '9px 0', textAlign: 'center' }}>
                <input type="checkbox"
                  checked={selectedRows.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  style={{ accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
                />
              </th>
              {visibleCols.map(col => (
                <th key={col.id}
                  onClick={() => toggleSort(col)}
                  style={{
                    background: 'var(--bg-elevated)',
                    borderBottom: '1px solid var(--border-default)',
                    padding: '9px 10px',
                    textAlign: 'left',
                    fontSize: 11, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.6px',
                    color: sort.key === col.id ? 'var(--brand-primary)' : 'var(--text-muted)',
                    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                    borderRight: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label} <SortIcon col={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={visibleCols.length + 1}>
                  <div className="empty-state">
                    <Search size={28} />
                    <div className="empty-state-title">No leads found</div>
                    <div className="empty-state-text">Add a row or import a CSV to get started</div>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map((row, ri) => {
              const isSelected = selectedRows.has(row.id);
              return (
                <tr key={row.id} style={{ background: isSelected ? 'var(--brand-primary-subtle)' : ri % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-base)' }}>
                  {/* Checkbox */}
                  <td style={{ textAlign: 'center', padding: '0', borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                    <input type="checkbox" checked={isSelected} onChange={e => toggleRow(row.id, e)}
                      style={{ accentColor: 'var(--brand-primary)', cursor: 'pointer' }} />
                  </td>
                  {visibleCols.map(col => {
                    const isEditing = editCell?.rowId === row.id && editCell?.colId === col.id;
                    return (
                      <td
                        key={col.id}
                        onDoubleClick={() => setEditCell({ rowId: row.id, colId: col.id })}
                        style={{
                          position: 'relative',
                          padding: isEditing ? 0 : '6px 10px',
                          height: 36,
                          borderBottom: '1px solid var(--border-subtle)',
                          borderRight: '1px solid var(--border-subtle)',
                          cursor: 'default',
                          maxWidth: col.width,
                          overflow: isEditing ? 'visible' : 'hidden',
                          verticalAlign: 'middle',
                        }}
                      >
                        {isEditing ? (
                          <CellEditor
                            col={col}
                            value={row[col.id]}
                            statuses={statuses}
                            sources={sources}
                            onSave={v => updateCell(row.id, col.id, v)}
                            onCancel={() => setEditCell(null)}
                          />
                        ) : (
                          <CellValue col={col} value={row[col.id]} statuses={statuses} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex', gap: 20, alignItems: 'center',
        padding: '6px 20px', borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)', fontSize: 11, color: 'var(--text-muted)',
        flexShrink: 0,
      }}>
        <span>{leads.length} total rows</span>
        <span>{filtered.length} shown</span>
        {selectedRows.size > 0 && <span style={{ color: 'var(--brand-primary)' }}>{selectedRows.size} selected</span>}
        <span style={{ marginLeft: 'auto' }}>Double-click any cell to edit · Enter to confirm · Esc to cancel</span>
      </div>

      {/* Column manager */}
      {showColManager && (
        <ColumnManager
          columns={columns} setColumns={setColumns}
          statuses={statuses} setStatuses={setStatuses}
          sources={sources} setSources={setSources}
          onClose={() => setShowColManager(false)}
        />
      )}
    </div>
  );
}
