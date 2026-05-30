import React from 'react';
import { TrendingUp, Users, Calendar, MessageSquare, ArrowRight, Activity } from 'lucide-react';
import { formatCurrency, getInitials, getAvatarColor, STATUS_COLORS } from '../data/store';
import TopBar from './layout/TopBar';

export default function Dashboard({ leads, meetings, followUps, deals, setActive }) {
  const totalPipeline = deals.filter(d => d.stage !== 'Closed Won').reduce((s, d) => s + d.value, 0);
  const closedValue = deals.filter(d => d.stage === 'Closed Won').reduce((s, d) => s + d.value, 0);
  const pendingFollowUps = followUps.filter(f => !f.done).length;
  const todayMeetings = meetings.filter(m => m.date === new Date().toISOString().split('T')[0]).length;

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const upcomingMeetings = [...meetings].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Dashboard" subtitle="Overview" />
      <div className="page-content" style={{ paddingTop: 24 }}>

        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-overlay) 100%)',
          border: '1px solid var(--border-brand)',
          borderRadius: 'var(--radius-xl)',
          padding: '22px 28px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 180, height: 180,
            background: 'var(--brand-primary-subtle)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--brand-primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
              Good morning
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
              Alex Reid
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              You have <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{pendingFollowUps} follow-ups</span> due this week
              {todayMeetings > 0 && <> and <span style={{ color: 'var(--color-info)', fontWeight: 600 }}>{todayMeetings} meetings</span> today</>}.
            </div>
          </div>
          <Activity size={48} style={{ color: 'var(--brand-primary)', opacity: 0.3 }} />
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <StatCard label="Pipeline Value" value={formatCurrency(totalPipeline)} delta="+12% this month" up icon={<TrendingUp size={18} />} />
          <StatCard label="Closed Revenue" value={formatCurrency(closedValue)} delta="+8% vs target" up icon={<TrendingUp size={18} />} />
          <StatCard label="Total Leads" value={leads.length} delta={`${leads.filter(l=>l.status==='New').length} new`} up icon={<Users size={18} />} />
          <StatCard label="Follow-Ups Due" value={pendingFollowUps} delta="This week" icon={<MessageSquare size={18} />} />
          <StatCard label="Meetings Booked" value={meetings.length} delta={`${todayMeetings} today`} up icon={<Calendar size={18} />} />
        </div>

        {/* Bottom grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

          {/* Recent leads */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Recent Leads</span>
              <button
                onClick={() => setActive('leads')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentLeads.map(lead => {
                const [bg, fg] = getAvatarColor(lead.name);
                return (
                  <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ background: bg, color: fg }}>{getInitials(lead.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{lead.company}</div>
                    </div>
                    <span className={`badge ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-primary)', minWidth: 60, textAlign: 'right' }}>
                      {formatCurrency(lead.value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming meetings */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Upcoming Meetings</span>
              <button
                onClick={() => setActive('meetings')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} style={{
                  background: 'var(--bg-overlay)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  borderLeft: '3px solid var(--brand-primary)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{meeting.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{meeting.time}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {meeting.contact} · {meeting.company}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {new Date(meeting.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {meeting.duration}min · {meeting.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, up, icon }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="stat-label">{label}</div>
        <div style={{ color: 'var(--brand-primary)', opacity: 0.6 }}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {delta && (
        <div className={`stat-delta ${up ? 'up' : ''}`}>
          {up ? '↑' : '→'} {delta}
        </div>
      )}
    </div>
  );
}
