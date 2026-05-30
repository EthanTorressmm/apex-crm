import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, DollarSign } from 'lucide-react';
import TopBar from '../layout/TopBar';
import { CRM_STAGES, STAGE_COLORS, formatCurrency, getInitials, getAvatarColor } from '../../data/store';

const EMPTY_DEAL = { name: '', contact: '', value: '', stage: 'Contacted', probability: 20, closeDate: '' };

export default function CRMPipeline({ deals, setDeals }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_DEAL);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const openAdd = (stage) => {
    setEditing(null);
    setForm({ ...EMPTY_DEAL, stage: stage || 'Contacted' });
    setShowModal(true);
  };
  const openEdit = (deal) => {
    setEditing(deal.id);
    setForm({ ...deal, value: String(deal.value) });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const entry = { ...form, value: parseFloat(form.value) || 0, probability: +form.probability };
    if (editing) {
      setDeals(deals.map(d => d.id === editing ? { ...entry, id: editing } : d));
    } else {
      setDeals([{ ...entry, id: Date.now().toString() }, ...deals]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this deal?')) setDeals(deals.filter(d => d.id !== id));
  };

  // Drag-drop handlers
  const handleDragStart = (e, deal) => {
    setDragging(deal.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, stage) => {
    e.preventDefault();
    setDragOver(stage);
  };
  const handleDrop = (e, stage) => {
    e.preventDefault();
    if (dragging) {
      setDeals(deals.map(d => d.id === dragging ? { ...d, stage } : d));
    }
    setDragging(null);
    setDragOver(null);
  };
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const totalPipeline = deals.filter(d => d.stage !== 'Closed Won').reduce((s, d) => s + d.value, 0);
  const weightedPipeline = deals.filter(d => d.stage !== 'Closed Won').reduce((s, d) => s + (d.value * d.probability / 100), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="CRM Pipeline" subtitle={`${deals.length} deals · ${formatCurrency(totalPipeline)} pipeline`} onAdd={() => openAdd()} addLabel="Add Deal" />
      <div style={{ padding: '16px 32px 0', flexShrink: 0 }}>
        {/* Summary bar */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px 20px' }}>
          {[
            { label: 'Total Pipeline', value: formatCurrency(totalPipeline), color: 'var(--brand-primary)' },
            { label: 'Weighted Value', value: formatCurrency(weightedPipeline), color: 'var(--color-info)' },
            { label: 'Closed Won', value: formatCurrency(deals.filter(d => d.stage === 'Closed Won').reduce((s, d) => s + d.value, 0)), color: 'var(--color-success)' },
            { label: 'Deals', value: deals.length, color: 'var(--text-primary)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 32px 24px' }}>
        <div className="kanban-board">
          {CRM_STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            const accentColor = STAGE_COLORS[stage];
            return (
              <div
                key={stage}
                className="kanban-column"
                style={{
                  borderTop: `3px solid ${accentColor}`,
                  ...(dragOver === stage ? { background: 'var(--bg-hover)', borderColor: accentColor } : {}),
                }}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="kanban-header">
                  <div>
                    <div className="kanban-col-title" style={{ color: accentColor }}>{stage}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {formatCurrency(stageValue)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="kanban-count">{stageDeals.length}</span>
                    <button
                      onClick={() => openAdd(stage)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        cursor: 'pointer', padding: 2, borderRadius: 4,
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="kanban-cards">
                  {stageDeals.length === 0 && (
                    <div style={{
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px 12px',
                      textAlign: 'center',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                    }}>
                      Drop a deal here
                    </div>
                  )}
                  {stageDeals.map(deal => {
                    const [bg, fg] = getAvatarColor(deal.contact || deal.name);
                    return (
                      <div
                        key={deal.id}
                        className="kanban-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal)}
                        onDragEnd={handleDragEnd}
                        style={{
                          opacity: dragging === deal.id ? 0.4 : 1,
                        }}
                        onClick={() => openEdit(deal)}
                      >
                        <div className="kanban-card-name">{deal.name}</div>
                        {deal.contact && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                            <div className="avatar" style={{ background: bg, color: fg, width: 20, height: 20, fontSize: 9 }}>
                              {getInitials(deal.contact)}
                            </div>
                            <span className="kanban-card-meta">{deal.contact}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                          <div className="kanban-card-value">{formatCurrency(deal.value)}</div>
                          <div style={{
                            fontSize: 11, color: 'var(--text-muted)',
                            background: 'var(--bg-overlay)',
                            borderRadius: 100, padding: '2px 7px',
                          }}>
                            {deal.probability}%
                          </div>
                        </div>
                        {deal.closeDate && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            Close: {new Date(deal.closeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </div>
                        )}
                        {/* Progress bar for probability */}
                        <div style={{
                          height: 3, background: 'var(--bg-overlay)', borderRadius: 10, marginTop: 8, overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${deal.probability}%`,
                            height: '100%',
                            background: accentColor,
                            borderRadius: 10,
                            transition: 'width 300ms',
                          }} />
                        </div>
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 4, marginTop: 8 }} onClick={e => e.stopPropagation()}>
                          <button className="btn btn-ghost" style={{ padding: '3px 7px', fontSize: 11 }} onClick={() => openEdit(deal)}>
                            <Edit2 size={11} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '3px 7px', fontSize: 11 }} onClick={() => handleDelete(deal.id)}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="modal-title">{editing ? 'Edit Deal' : 'Add Deal'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Deal Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Acme Inc — Enterprise Plan" />
              </div>
              <div className="form-group">
                <label className="input-label">Contact</label>
                <input className="input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div className="form-group">
                <label className="input-label">Value (£)</label>
                <input className="input" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="input-label">Stage</label>
                <select className="input" value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
                  {CRM_STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Probability (%)</label>
                <input className="input" type="number" min="0" max="100" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Expected Close Date</label>
                <input className="input" type="date" value={form.closeDate} onChange={e => setForm({ ...form, closeDate: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Deal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
