import { supabase } from './supabase';

// ─── LEADS ────────────────────────────────────────────────────────────────
export async function fetchLeads(userId) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(normaliseRow);
}

export async function upsertLead(lead, userId) {
  const row = denormaliseRow(lead, userId);
  const { data, error } = await supabase
    .from('leads')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return normaliseRow(data);
}

export async function deleteLead(id) {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}

// ─── MEETINGS ─────────────────────────────────────────────────────────────
export async function fetchMeetings(userId) {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  if (error) throw error;
  return data.map(normaliseRow);
}

export async function upsertMeeting(meeting, userId) {
  const row = denormaliseRow(meeting, userId);
  const { data, error } = await supabase
    .from('meetings')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return normaliseRow(data);
}

export async function deleteMeeting(id) {
  const { error } = await supabase.from('meetings').delete().eq('id', id);
  if (error) throw error;
}

// ─── FOLLOW-UPS ───────────────────────────────────────────────────────────
export async function fetchFollowUps(userId) {
  const { data, error } = await supabase
    .from('follow_ups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(normaliseRow);
}

export async function upsertFollowUp(followUp, userId) {
  const row = denormaliseRow(followUp, userId);
  const { data, error } = await supabase
    .from('follow_ups')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return normaliseRow(data);
}

export async function deleteFollowUp(id) {
  const { error } = await supabase.from('follow_ups').delete().eq('id', id);
  if (error) throw error;
}

// ─── DEALS ────────────────────────────────────────────────────────────────
export async function fetchDeals(userId) {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(normaliseRow);
}

export async function upsertDeal(deal, userId) {
  const row = denormaliseRow(deal, userId);
  const { data, error } = await supabase
    .from('deals')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return normaliseRow(data);
}

export async function deleteDeal(id) {
  const { error } = await supabase.from('deals').delete().eq('id', id);
  if (error) throw error;
}

// ─── AGENCY SETTINGS ──────────────────────────────────────────────────────
export async function fetchSettings(userId) {
  const { data, error } = await supabase
    .from('agency_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? data.settings : null;
}

export async function saveSettings(userId, settings) {
  const { error } = await supabase
    .from('agency_settings')
    .upsert({ user_id: userId, settings }, { onConflict: 'user_id' });
  if (error) throw error;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
// Convert snake_case DB rows → camelCase app objects
function normaliseRow(row) {
  if (!row) return row;
  const out = { ...row };
  // Map common snake_case fields
  if ('created_at' in out && !('createdAt' in out)) out.createdAt = out.created_at?.split('T')[0];
  if ('due_date' in out) out.dueDate = out.due_date;
  if ('close_date' in out) out.closeDate = out.close_date;
  if ('lead_id' in out) out.leadId = out.lead_id;
  if ('user_id' in out) delete out.user_id;
  // Parse JSON arrays stored as text
  if (typeof out.tags === 'string') {
    try { out.tags = JSON.parse(out.tags); } catch { out.tags = []; }
  }
  return out;
}

// Convert camelCase app objects → snake_case DB rows
function denormaliseRow(obj, userId) {
  const out = { ...obj, user_id: userId };
  if ('createdAt' in out) { out.created_at = out.createdAt; delete out.createdAt; }
  if ('dueDate' in out) { out.due_date = out.dueDate; delete out.dueDate; }
  if ('closeDate' in out) { out.close_date = out.closeDate; delete out.closeDate; }
  if ('leadId' in out) { out.lead_id = out.leadId; delete out.leadId; }
  // Store tags array as JSON
  if (Array.isArray(out.tags)) out.tags = JSON.stringify(out.tags);
  return out;
}
