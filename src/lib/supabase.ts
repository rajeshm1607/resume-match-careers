
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbyiwqrtxmkvaowishxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJieWl3cXJ0eG1rdmFvd2lzaHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODY3MTYsImV4cCI6MjA2MDA2MjcxNn0.rSQbYG8EigZ_C2S3Yrb7yIbHiotyx-XeW_4tc5FA610';

export const supabase = createClient(supabaseUrl, supabaseKey);
