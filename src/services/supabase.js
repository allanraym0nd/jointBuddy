import {createClient} from supabase/supabase-js //pre-configured connection 

const supabaseUrl = import.meta.env.VITE.SUPABASE.URL
const supabaseAnonKey = import.meta.env.VITE.SUPABASE.ANON_KEY

export const supabase = createClient(supabaseUrl,supabaseAnonKey)

