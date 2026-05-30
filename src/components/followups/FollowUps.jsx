import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle, Circle, Trash2, Edit2, Search, AlertCircle } from 'lucide-react';
import TopBar from '../layout/TopBar';
import { formatDate, getInitials, getAvatarColor } from '../../data/store';

const PRIORITIES = ['High', 'Medium', 'Low'];
const PRIORITY_BADGE = { High: 'badge-danger', Medium: 'badge-warning', Low: 'badge-muted' };
const PRIORITY_COLOR = { High: 'var(--color-danger)', Medium: 'var(--color-warning)', Low: 'var(--text-muted)' };
const EMPTY_FU = { contact: '', company: '', note: '', date: '', dueDate: '', priority: 'Medium', done: false };

export default function FollowUps({ followUps, setFollowUps }) {
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showDone, setShowDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FU);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY_FU, date: new Date().toISOString().split('T')[0] }); setShowModal(true); };
  const openEdit = (fu) => { setEditing(fu.id); setForm({ ...fu }); setShowModal(true); };

  const handleSave = () => {
    if (!form.contact.trim()) return;
    if (editing) {
      setFollowUps(followUps.map(f => f.id === editing ? { ...form, id: editing } : f));
    } else {
      setFollowUps([{ ...form, id: Date.now().toString() }, ...followUps]);
    }
    setShowModal(false);
  };

  const toggleDone = (id) => {
    setFollowUps(followUps.map(f => f.id === id ? { ...f, done: !f.done } : f));
  };
  const handleDelete = (id) => {
    if (window.confirm('Delete this follow-up?')) setFollowUps(followUps.filter(f => f.id !== id));
  };

  const filtered = followUps
    .filter(f => {
      const q = search.toLowerCase();
      return (filterPriority === 'All' || f.priority === filterPriority) &&
        (showDone || !f.done) &&
        (!q || f.contact.toLowerCase().includes(q) || f.company.toLowerCase().includes(q) || f.note.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    });

  const overdueCount = followUps.filter(f => !f.done && f.dueDate && new Date(f.dueDate) < new Date()).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Follow-Ups" subtitle={`${followUps.filter(f => !f.done).length} pending`} onAdd={openAdd} addLabel="Add Note" />
      <div className="page-content">

        {/* Overdue banner */}
        {overdueCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--color-danger-bg)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            marginBottom: 20,
            fontSize: 13,
          }}>
            <AlertCircle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>
              {overdueCount} overdue follow-up{overdueCount !== 1 ? 's' : ''} — take action now
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {PRIORITIES.map(p => (
            <div key={p} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilterPriority(filterPriority === p ? 'All' : p)}>
              <div className="stat-label" style={{ color: PRIORITY_COLOR[p] }}>{p} Priority</div>
              <div className="stat-value" style={{ fontSize: 22 }}>{followUps.filter(f => f.priority === p && !f.done).length}</div>
            </div>
          ))}
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{followUps.filter(f => f.done).length}</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          <div className="search-bar">
            <Search size={14} />
            <input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ width: 150 }}>
            <option value="All">All Priorities</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer',
            marginLeft: 8,
          }}>
            <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)}
              style={{ accentColor: 'var(--brand-primary)' }} />
            Show completed
          </label>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <MessageSquare size={32} />
              <div className="empty-state-title">No follow-ups found</div>
              <div className="empty-state-text">Add follow-up notes to track your conversations</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(fu => {
              const [bg, fg] = getAvatarColor(fu.contact || 'A');
              const isOverdue = !fu.done && fu.dueDate && new Date(fu.dueDate) < new Date();
              return (
                <div
                  key={fu.id}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    opacity: fu.done ? 0.5 : 1,
                    borderColor: isOverdue ? 'rgba(248,113,113,0.35)' : undefined,
                    transition: 'all 120ms',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {/* Done toggle */}
                    <button
                      onClick={() => toggleDone(fu.id)}
                      style={{ background: 'none', padding: 0, marginTop: 2, color: fu.done ? 'var(--color-success)' : 'var(--text-muted)', flexShrink: 0 }}
                    >
                      {fu.done ? <CheckCircle size={18} /> : <Circle size={18} />}
                    </button>

                    {/* Avatar */}
                    <div className="avatar" style={{ background: bg, color: fg, marginTop: 1 }}>
                      {getInitials(fu.contact || '?')}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, textDecoration: fu.done ? 'line-through' : 'none' }}>
                          {fu.contact}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {fu.company}</span>
                        <span className={`badge ${PRIORITY_BADGE[fu.priority]}`}>{fu.priority}</span>
                        {isOverdue && <span className="badge badge-danger">Overdue</span>}
                      </div>

                      <p style={{
                        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
                        textDecoration: fu.done ? 'line-through' : 'none',
                      }}>
                        {fu.note}
                      </p>

                      <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                        {fu.date && <span>Added: {formatDate(fu.date)}</span>}
                        {fu.dueDate && (
                          <span style={{ color: isOverdue ? 'var(--color-danger)' : undefined }}>
                            Due: {formatDate(fu.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost" style={{ padding: '5px 8px' }} onClick={() => openEdit(fu)}>
                        <Edit2 size={12} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '5px 8px' }} onClick={() => handleDelete(fu.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="modal-title">{editing ? 'Edit Follow-Up' : 'Add Follow-Up Note'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="input-label">Contact Name *</label>
                <input className="input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div className="form-group">
                <label className="input-label">Company</label>
                <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc" />
              </div>
              <div className="form-group">
                <label className="input-label">Priority</label>
                <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Due Date</label>
                <input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Note *</label>
                <textarea className="input" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="What happened in this conversation? What's the next action?" rows={4} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
