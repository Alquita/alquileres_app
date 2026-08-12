import { supabase } from '../supabase'

// ── PROPERTY ────────────────────────────────────────────────

export async function loadProperty(tipo, propietario, unidadId) {
  const { data, error } = await supabase
    .from('properties')
    .select('data')
    .eq('tipo', tipo)
    .eq('propietario', propietario)
    .eq('unidad_id', unidadId)
    .maybeSingle()

  if (error) {
    console.error('Error loading property from Supabase:', error)
    return null
  }
  return data?.data || null
}

export async function saveProperty(tipo, propietario, unidadId, propertyData) {
  const { error } = await supabase
    .from('properties')
    .upsert(
      {
        tipo,
        propietario,
        unidad_id: unidadId,
        data: propertyData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'tipo,propietario,unidad_id' }
    )

  if (error) {
    console.error('Error saving property to Supabase:', error)
    return false
  }
  return true
}

// ── SETTINGS ────────────────────────────────────────────────

export async function loadSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .eq('id', 1)
    .maybeSingle()

  if (error) {
    console.error('Error loading settings from Supabase:', error)
    return null
  }
  return data?.data || null
}

export async function saveSettings(settingsData) {
  const { error } = await supabase
    .from('settings')
    .upsert(
      {
        id: 1,
        data: settingsData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )

  if (error) {
    console.error('Error saving settings to Supabase:', error)
    return false
  }
  return true
}

// ── CAMPO ───────────────────────────────────────────────────

export async function loadCampo() {
  const { data, error } = await supabase
    .from('campo')
    .select('data')
    .eq('id', 1)
    .maybeSingle()

  if (error) {
    console.error('Error loading campo from Supabase:', error)
    throw error
  }
  return data?.data || null
}

export async function saveCampo(campoData) {
  const { error } = await supabase
    .from('campo')
    .upsert(
      {
        id: 1,
        data: campoData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )

  if (error) {
    console.error('Error saving campo to Supabase:', error)
    return false
  }
  return true
}
