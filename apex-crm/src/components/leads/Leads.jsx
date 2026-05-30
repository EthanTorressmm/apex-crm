import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit2, ChevronUp, ChevronDown, X, Download } from 'lucide-react';
import TopBar from '../layout/TopBar';
import {
  LEAD_STATUSES, STATUS_COLORS, formatCurrency, formatDate,
  getInitials, getAvatarColor
} from '../../data/store';

const SOURCES = ['LinkedIn', 'Referral', 'Cold Email', 'Website', 'Event', 'Other'];
const EMPTY_LEAD = { name: '', company: '', email: '', phone: '', status: 'New', source: 'LinkedIn', value: '', assignee: '', tags: '' };

export default function Leads({ leads, setLeads }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_LEAD);

  const openAdd = () => { setEditing(null); setForm(EMPTY_LEAD); setShowModal(true); };
  const openEdit = (lead) => {
    setEditing(lead.id);
    setForm({ ...lead, tags: (lead.tags || []).join(', '), value: String(lead.value) });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const entry = {
      ...form,
      value: parseFloat(form.value) || 0,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      createdAt: editing ? (leads.find(l => l.id === editing)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    };
    if (editing) {
      setLeads(leads.map(l => l.id === editing ? { ...entry, id: editing } : l));
    } else {
      setLeads([{ ...entry, id: Date.now().toString() }, ...leads]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this lead?')) setLeads(leads.filter(l => l.id !== id));
  };

  const toggleSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const filtered = leads
    .filter(l => {
      const q = search.toLowerCase();
      return (filterStatus === 'All' || l.status === filterStatus) &&
        (!q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      let va = a[sort.key], vb = b[sort.key];
      if (sort.key === 'value') { va = +va; vb = +vb; }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });

  const totalValue = filtered.reduce((s, l) => s + l.value, 0);

  const SortIcon = ({ k }) => sort.key === k
    ? (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : <ChevronDown size={12} style={{ opacity: 0.3 }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Leads" subtitle={`${filtered.length} records`} onAdd={openAdd} addLabel="Add Lead" />
      <div className="page-content">

        {/* Summary */}
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {LEAD_STATUSES.map(s => (
            <div key={s}
              className="stat-card"
              style={{ cursor: 'pointer', ...(filterStatus === s ? { borderColor: 'var(--brand-primary)' } : {}) }}
              onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}
            >
              <div className="stat-label">{s}</div>
              <div className="stat-value" style={{ fontSize: 20 }}>{leads.filter(l => l.status === s).length}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
            <Search size={14} />
            <input
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <select
            className="input"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ width: 150 }}
          >
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-secondary)' }}>
            Total value: <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{formatCurrency(totalValue)}</span>
          </div>
          <button className="btn btn-ghost" style={{ gap: 6 }}>
            <Download size={13} /> Export
          </button>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Name <SortIcon k="name" /></div>
                  </th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('status')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Status <SortIcon k="status" /></div>
                  </th>
                  <th>Source</th>
                  <th style={{ cursor: 'pointer', textAlign: 'right' }} onClick={() => toggleSort('value')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>Value <SortIcon k="value" /></div>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('createdAt')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Added <SortIcon k="createdAt" /></div>
                  </th>
                  <th>Assignee</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9}>
                    <div className="empty-state">
                      <Search size={32} />
                      <div className="empty-state-title">No leads found</div>
                      <div className="empty-state-text">Try adjusting your filters or add a new lead</div>
                    </div>
                  </td></tr>
                ) : filtered.map(lead => {
                  const [bg, fg] = getAvatarColor(lead.name);
                  return (
                    <tr key={lead.id} onClick={() => openEdit(lead)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div className="avatar" style={{ background: bg, color: fg }}>{getInitials(lead.name)}</div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{lead.name}</div>
                            {lead.tags?.length > 0 && (
                              <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                                {lead.tags.map(t => (
                                  <span key={t} className="badge badge-gold" style={{ fontSize: 10, padding: '1px 6px' }}>{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{lead.company}</td>
                      <td>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lead.email}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.phone}</div>
                      </td>
                      <td><span className={`badge ${STATUS_COLORS[lead.status]}`}>{lead.status}</span></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{lead.source}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-primary)' }}>
                        {formatCurrency(lead.value)}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(lead.createdAt)}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{lead.assignee}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '5px 8px' }}
                            onClick={() => openEdit(lead)}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 8px' }}
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="modal-title">{editing ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Full Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div className="form-group">
                <label className="input-label">Company</label>
                <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc" />
              </div>
              <div className="form-group">
                <label className="input-label">Deal Value (£)</label>
                <input className="input" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="input-label">Email</label>
                <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@acme.com" />
              </div>
              <div className="form-group">
                <label className="input-label">Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+44 7700..." />
              </div>
              <div className="form-group">
                <label className="input-label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Source</label>
                <select className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Assignee</label>
                <input className="input" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} placeholder="Team member" />
              </div>
              <div className="form-group">
                <label className="input-label">Tags (comma separated)</label>
                <input className="input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Hot, Enterprise, VIP" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
