import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jpwpihrmjotumiznhpyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwd3BpaHJtam90dW1pem5ocHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY4MTEsImV4cCI6MjA5NTczMjgxMX0.RV4ltfR0mqFwXNc1nlGvOKPkTfgTZKQgrKxk37xEVbA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
