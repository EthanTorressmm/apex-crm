import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import TopBar from '../layout/TopBar';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarView({ meetings, onAddMeeting }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrev = getDaysInMonth(year, month - 1);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  const getMeetingsForDay = (y, m, d) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return meetings.filter(mt => mt.date === dateStr);
  };

  // Build calendar grid
  const cells = [];
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, month: month - 1, year: month === 0 ? year - 1 : year, other: true });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year });
  }
  // Next month
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: month + 1, year: month === 11 ? year + 1 : year, other: true });
  }

  const selectedMeetings = selectedDay
    ? getMeetingsForDay(selectedDay.year, selectedDay.month, selectedDay.day)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Calendar" subtitle={`${MONTHS[month]} ${year}`} />
      <div className="page-content" style={{ display: 'flex', gap: 20 }}>

        {/* Calendar */}
        <div style={{ flex: 1 }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button className="btn btn-ghost" style={{ padding: '7px 10px' }} onClick={prevMonth}>
              <ChevronLeft size={15} />
            </button>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, fontWeight: 800,
              flex: 1, textAlign: 'center',
            }}>
              {MONTHS[month]} {year}
            </h2>
            <button className="btn btn-ghost" style={{ padding: '7px 10px' }} onClick={nextMonth}>
              <ChevronRight size={15} />
            </button>
            <button className="btn btn-ghost" onClick={goToday} style={{ fontSize: 12 }}>Today</button>
          </div>

          {/* Grid */}
          <div className="calendar-grid">
            {DAYS.map(d => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
            {cells.map((cell, i) => {
              const isToday = !cell.other &&
                cell.day === today.getDate() &&
                cell.month === today.getMonth() &&
                cell.year === today.getFullYear();
              const isSelected = selectedDay &&
                selectedDay.day === cell.day &&
                selectedDay.month === cell.month &&
                selectedDay.year === cell.year;
              const dayMeetings = getMeetingsForDay(cell.year, cell.month, cell.day);

              return (
                <div
                  key={i}
                  className={`calendar-day${cell.other ? ' other-month' : ''}`}
                  style={{
                    ...(isSelected ? { background: 'var(--brand-primary-subtle)' } : {}),
                  }}
                  onClick={() => setSelectedDay(cell)}
                >
                  <div className={isToday ? 'day-number today' : 'day-number'}
                    style={{ fontSize: 12 }}>
                    {cell.day}
                  </div>
                  {dayMeetings.slice(0, 3).map(mt => (
                    <div key={mt.id} className="calendar-event" title={`${mt.time} – ${mt.title}`}>
                      {mt.time} {mt.title}
                    </div>
                  ))}
                  {dayMeetings.length > 3 && (
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      +{dayMeetings.length - 3} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13, fontWeight: 700, marginBottom: 12
            }}>
              {selectedDay
                ? `${DAYS[(new Date(selectedDay.year, selectedDay.month, selectedDay.day)).getDay()]}, ${selectedDay.day} ${MONTHS[selectedDay.month]}`
                : 'Select a day'}
            </div>

            {!selectedDay && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Click any day on the calendar to see its meetings.
              </div>
            )}

            {selectedDay && selectedMeetings.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                No meetings scheduled
              </div>
            )}

            {selectedMeetings.map(mt => (
              <div key={mt.id} style={{
                background: 'var(--bg-overlay)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginBottom: 8,
                borderLeft: '3px solid var(--brand-primary)',
              }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{mt.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {mt.contact} · {mt.time}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {mt.duration}min · {mt.type}
                </div>
              </div>
            ))}

            {selectedDay && (
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                onClick={() => onAddMeeting && onAddMeeting()}
              >
                <Plus size={13} /> Add Meeting
              </button>
            )}
          </div>

          {/* Month summary */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              {MONTHS[month]} Summary
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Total meetings:
              <span style={{ color: 'var(--brand-primary)', fontWeight: 700, marginLeft: 6 }}>
                {meetings.filter(m => m.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Confirmed:
              <span style={{ color: 'var(--color-success)', fontWeight: 700, marginLeft: 6 }}>
                {meetings.filter(m => m.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && m.status === 'Confirmed').length}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Pending:
              <span style={{ color: 'var(--color-warning)', fontWeight: 700, marginLeft: 6 }}>
                {meetings.filter(m => m.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && m.status === 'Pending').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
