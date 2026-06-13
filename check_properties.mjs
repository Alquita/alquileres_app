import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lxlxvmmpnqdkdneqtbma.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bHh2bW1wbnFka2RuZXF0Ym1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTEwMTYsImV4cCI6MjA5NjY4NzAxNn0.dg_bNaIuKAG-ZUjkfGB4VvrwCmWqZ0OfONul8G_HGIM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  // 1. List all records with key columns
  const { data: allRecords, error: err1 } = await supabase
    .from('properties')
    .select('id, tipo, propietario, unidad_id')

  if (err1) {
    console.error('Error fetching all records:', err1)
    return
  }

  console.log('=== ALL RECORDS (id, tipo, propietario, unidad_id) ===')
  console.table(allRecords)

  // 2. Query specific records that have problems
  const problemRecords = [
    { tipo: 'departamentos', propietario: 'yani', unidad_id: 'cielos-i' },
    { tipo: 'departamentos', propietario: 'fabian', unidad_id: 'libertador-i' },
    { tipo: 'departamentos', propietario: 'fabian', unidad_id: 'robles-xiv-fabian' },
  ]

  for (const r of problemRecords) {
    const { data, error } = await supabase
      .from('properties')
      .select('id, tipo, propietario, unidad_id, data')
      .match(r)

    if (error) {
      console.error(`\nError fetching ${JSON.stringify(r)}:`, error)
    } else {
      console.log(`\n=== PROBLEM RECORD: ${JSON.stringify(r)} ===`)
      console.log(JSON.stringify(data, null, 2))
    }
  }

  // 3. Query known-good records
  const goodRecords = [
    { tipo: 'departamentos', propietario: 'yani', unidad_id: 'puertas-del-sol' },
    { tipo: 'departamentos', propietario: 'yani', unidad_id: 'robles-viii' },
    { tipo: 'departamentos', propietario: 'fabian', unidad_id: 'jeremias' },
  ]

  for (const r of goodRecords) {
    const { data, error } = await supabase
      .from('properties')
      .select('id, tipo, propietario, unidad_id, data')
      .match(r)

    if (error) {
      console.error(`\nError fetching ${JSON.stringify(r)}:`, error)
    } else {
      console.log(`\n=== GOOD RECORD: ${JSON.stringify(r)} ===`)
      console.log(JSON.stringify(data, null, 2))
    }
  }
}

main()
