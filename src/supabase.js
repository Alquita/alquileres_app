import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lxlxvmmpnqdkdneqtbma.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bHh2bW1wbnFka2RuZXF0Ym1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTEwMTYsImV4cCI6MjA5NjY4NzAxNn0.dg_bNaIuKAG-ZUjkfGB4VvrwCmWqZ0OfONul8G_HGIM'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
