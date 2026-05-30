// Initial mock data
export const initialLeads = [
  { id: '1', name: 'Sarah Mitchell', company: 'Nexus Digital', email: 'sarah@nexus.io', phone: '+44 7700 900123', status: 'Qualified', source: 'LinkedIn', value: 4500, assignee: 'Alex R', createdAt: '2025-06-01', tags: ['Hot', 'Enterprise'] },
  { id: '2', name: 'James Thornton', company: 'Orbit Media', email: 'j.thornton@orbit.co', phone: '+44 7700 900456', status: 'New', source: 'Referral', value: 2200, assignee: 'Clara M', createdAt: '2025-06-03', tags: ['SMB'] },
  { id: '3', name: 'Priya Sharma', company: 'Luminate Labs', email: 'priya@luminate.ai', phone: '+44 7700 900789', status: 'Contacted', source: 'Cold Email', value: 7800, assignee: 'Alex R', createdAt: '2025-06-04', tags: ['Hot', 'SaaS'] },
  { id: '4', name: 'Tom Adeyemi', company: 'Crest & Co', email: 'tom.a@crestandco.com', phone: '+44 7700 900321', status: 'Proposal', source: 'Website', value: 3300, assignee: 'Clara M', createdAt: '2025-06-06', tags: ['Agency'] },
  { id: '5', name: 'Elena Vasquez', company: 'Strata Ventures', email: 'elena@strata.vc', phone: '+44 7700 900654', status: 'Closed Won', source: 'Event', value: 12000, assignee: 'Alex R', createdAt: '2025-05-28', tags: ['Enterprise', 'VIP'] },
  { id: '6', name: 'Marcus Webb', company: 'Forge Creative', email: 'marcus@forgecreative.io', phone: '+44 7700 900987', status: 'Closed Lost', source: 'LinkedIn', value: 1800, assignee: 'Clara M', createdAt: '2025-05-30', tags: [] },
];

export const initialMeetings = [
  { id: '1', title: 'Discovery Call', contact: 'Sarah Mitchell', company: 'Nexus Digital', date: '2025-06-10', time: '10:00', duration: 30, type: 'Video', status: 'Confirmed', notes: 'Discuss enterprise package options', leadId: '1' },
  { id: '2', title: 'Demo Presentation', contact: 'Priya Sharma', company: 'Luminate Labs', date: '2025-06-11', time: '14:00', duration: 60, type: 'Video', status: 'Confirmed', notes: 'Full platform demo + pricing', leadId: '3' },
  { id: '3', title: 'Proposal Review', contact: 'Tom Adeyemi', company: 'Crest & Co', date: '2025-06-12', time: '11:00', duration: 45, type: 'In-Person', status: 'Pending', notes: '', leadId: '4' },
  { id: '4', title: 'Onboarding Kickoff', contact: 'Elena Vasquez', company: 'Strata Ventures', date: '2025-06-13', time: '09:00', duration: 90, type: 'Video', status: 'Confirmed', notes: 'Set up account, walk through dashboard', leadId: '5' },
  { id: '5', title: 'Follow-up Call', contact: 'James Thornton', company: 'Orbit Media', date: '2025-06-15', time: '15:30', duration: 30, type: 'Phone', status: 'Confirmed', notes: '', leadId: '2' },
];

export const initialFollowUps = [
  { id: '1', contact: 'Sarah Mitchell', company: 'Nexus Digital', note: 'Sent over enterprise pricing PDF. She mentioned budget approval needed from CFO. Follow up next Tuesday.', date: '2025-06-05', dueDate: '2025-06-10', priority: 'High', done: false, leadId: '1' },
  { id: '2', contact: 'James Thornton', company: 'Orbit Media', note: 'First contact via LinkedIn. He seemed interested in the growth package. Need to qualify budget.', date: '2025-06-03', dueDate: '2025-06-08', priority: 'Medium', done: false, leadId: '2' },
  { id: '3', contact: 'Priya Sharma', company: 'Luminate Labs', note: 'Very warm lead. She has budget and authority. Book demo ASAP.', date: '2025-06-04', dueDate: '2025-06-07', priority: 'High', done: true, leadId: '3' },
  { id: '4', contact: 'Tom Adeyemi', company: 'Crest & Co', note: 'Proposal sent. Waiting on feedback from their team. Check in Thursday.', date: '2025-06-06', dueDate: '2025-06-09', priority: 'Medium', done: false, leadId: '4' },
];

export const initialDeals = [
  { id: '1', name: 'Nexus Digital — Growth Pack', contact: 'Sarah Mitchell', value: 4500, stage: 'Discovery', probability: 30, closeDate: '2025-06-30', leadId: '1' },
  { id: '2', name: 'Luminate Labs — Enterprise', contact: 'Priya Sharma', value: 7800, stage: 'Demo', probability: 55, closeDate: '2025-06-25', leadId: '3' },
  { id: '3', name: 'Crest & Co — Agency Suite', contact: 'Tom Adeyemi', value: 3300, stage: 'Proposal', probability: 70, closeDate: '2025-06-20', leadId: '4' },
  { id: '4', name: 'Orbit Media — Starter', contact: 'James Thornton', value: 2200, stage: 'Contacted', probability: 20, closeDate: '2025-07-10', leadId: '2' },
  { id: '5', name: 'Strata Ventures — Pro Plan', contact: 'Elena Vasquez', value: 12000, stage: 'Closed Won', probability: 100, closeDate: '2025-05-28', leadId: '5' },
];

export const CRM_STAGES = ['Contacted', 'Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed Won'];

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed Won', 'Closed Lost'];

export const STATUS_COLORS = {
  'New': 'badge-info',
  'Contacted': 'badge-muted',
  'Qualified': 'badge-gold',
  'Proposal': 'badge-warning',
  'Closed Won': 'badge-success',
  'Closed Lost': 'badge-danger',
};

export const STAGE_COLORS = {
  'Contacted': '#60A5FA',
  'Discovery': '#C9A84C',
  'Demo': '#A78BFA',
  'Proposal': '#FBBF24',
  'Negotiation': '#FB923C',
  'Closed Won': '#4ADE80',
};

// Storage helpers
export function loadState(key, fallback) {
  try {
    const stored = localStorage.getItem(`apex_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

export function saveState(key, value) {
  try { localStorage.setItem(`apex_${key}`, JSON.stringify(value)); } catch {}
}

// Helpers
export function getInitials(name) {
  return name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase();
}

export function formatCurrency(n) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const AVATAR_COLORS = [
  ['#1e3a5f','#60A5FA'], ['#3b1f5e','#A78BFA'], ['#1a3d2e','#4ADE80'],
  ['#3d2a0e','#FBBF24'], ['#3d1818','#F87171'], ['#1a2d3d','#38BDF8'],
];
export function getAvatarColor(name) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}
