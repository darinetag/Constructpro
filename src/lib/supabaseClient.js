import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://icocnyglhtmyqaziersm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2NueWdsaHRteXFhemllcnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODMxMzEsImV4cCI6MjA2NTA1OTEzMX0.WMG-kPwuzycvlZClDr1fTRmZWlo2VV1l7y506lCzqV8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);