import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://caaxvyqzksxnlpjjioyg.supabase.co"
const supabaseAnonKey = "sb_publishable_cPIp-JBqclDfO47pHBH-8g_Lz-CzIko"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)