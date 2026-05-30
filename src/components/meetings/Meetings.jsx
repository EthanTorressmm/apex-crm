import React, { useState } from 'react';
import { X, Video, Phone, MapPin, Clock, Edit2, Trash2, Search } from 'lucide-react';
import TopBar from '../layout/TopBar';
import { formatCurrency, getInitials, getAvatarColor } from '../../data/store';

const TYPES = ['Video', 'Phone', 'In-Person'];
const STATUSES = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];
const DURATIONS = [15, 30, 45, 60, 90, 120];
const EMPTY_MEETING = { title: '', contact: '', company: '', date: '', time: '09:00', duration: 30, type: 'Video', status: 'Confirmed', notes: '' };

const TYPE_ICON = { Video: Video, Phone: Phone, 'In-Person': MapPin };
const STATUS_BADGE = {
  Confirmed: 'badge-success', Pending: 'badge-warning',
  Cancelled: 'badge-danger', Completed: 'badge-muted'
};

export default function Meetings({ meetings, setMeetings }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_MEETING);

  const openAdd = () => { setEditing(null); setForm(EMPTY_MEETING); setShowModal(true); };
  const openEdit = (m) => { setEditing(m.id); setForm({ ...m }); setShowModal(true); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setMeetings(meetings.map(m => m.id === editing ? { ...form, id: editing } : m));
    } else {
      setMeetings([{ ...form, id: Date.now().toString() }, ...meetings]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this meeting?')) setMeetings(meetings.filter(m => m.id !== id));
  };

  const filtered = meetings
    .filter(m => {
      const q = search.toLowerCase();
      return (filterStatus === 'All' || m.status === filterStatus) &&
        (!q || m.title.toLowerCase().includes(q) || m.contact.toLowerCase().includes(q) || m.company.toLowerCase().includes(q));
    })
    .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

  // Group by date
  const groups = {};
  filtered.forEach(m => {
    if (!groups[m.date]) groups[m.date] = [];
    groups[m.date].push(m);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Meetings" subtitle={`${meetings.length} booked`} onAdd={openAdd} addLabel="Book Meeting" />
      <div className="page-content">

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {STATUSES.map(s => (
            <div key={s} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}>
              <div className="stat-label">{s}</div>
              <div className="stat-value" style={{ fontSize: 22 }}>{meetings.filter(m => m.status === s).length}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          <div className="search-bar">
            <Search size={14} />
            <input placeholder="Search meetings..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 160 }}>
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Grouped meetings */}
        {Object.keys(groups).length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <Clock size={32} />
              <div className="empty-state-title">No meetings found</div>
              <div className="empty-state-text">Book your first meeting to get started</div>
            </div>
          </div>
        ) : Object.entries(groups).map(([date, dayMeetings]) => {
          const d = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          return (
            <div key={date} style={{ marginBottom: 24 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13, fontWeight: 700,
                  color: isToday ? 'var(--brand-primary)' : 'var(--text-secondary)',
                }}>
                  {isToday ? 'TODAY — ' : ''}{d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dayMeetings.length} meeting{dayMeetings.length !== 1 ? 's' : ''}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dayMeetings.map(meeting => {
                  const Icon = TYPE_ICON[meeting.type] || Video;
                  const [bg, fg] = getAvatarColor(meeting.contact || 'A');
                  return (
                    <div
                      key={meeting.id}
                      className="card"
                      style={{ padding: '16px 18px', cursor: 'pointer', transition: 'border-color 120ms' }}
                      onClick={() => openEdit(meeting)}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-brand)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        {/* Time block */}
                        <div style={{
                          textAlign: 'center',
                          minWidth: 50,
                          borderRight: '1px solid var(--border-subtle)',
                          paddingRight: 14,
                        }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--brand-primary)' }}>
                            {meeting.time}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                            {meeting.duration}min
                          </div>
                        </div>

                        {/* Avatar */}
                        <div className="avatar" style={{ background: bg, color: fg, width: 36, height: 36, fontSize: 13 }}>
                          {getInitials(meeting.contact || '?')}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{meeting.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            {meeting.contact} · {meeting.company}
                          </div>
                          {meeting.notes && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                              "{meeting.notes}"
                            </div>
                          )}
                        </div>

                        {/* Type & status */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                          <span className={`badge ${STATUS_BADGE[meeting.status]}`}>{meeting.status}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                            <Icon size={12} />{meeting.type}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                          <button className="btn btn-ghost" style={{ padding: '5px 8px' }} onClick={() => openEdit(meeting)}>
                            <Edit2 size={12} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '5px 8px' }} onClick={() => handleDelete(meeting.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="modal-title">{editing ? 'Edit Meeting' : 'Book Meeting'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Meeting Title *</label>
                <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Discovery Call" />
              </div>
              <div className="form-group">
                <label className="input-label">Contact Name</label>
                <input className="input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div className="form-group">
                <label className="input-label">Company</label>
                <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc" />
              </div>
              <div className="form-group">
                <label className="input-label">Date</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="input-label">Time</label>
                <input className="input" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="input-label">Duration</label>
                <select className="input" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })}>
                  {DURATIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Notes</label>
                <textarea className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Preparation notes..." rows={3} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? 'Save Changes' : 'Book Meeting'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
