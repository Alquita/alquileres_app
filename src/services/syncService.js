import { supabase } from '../supabase'

// Primer año con datos en la app
export const ANIO_MINIMO = 2026

// Params de la URL inválidos (undefined o literales tipo ':tipo')
export const esParamValido = (p) => typeof p === 'string' && p !== '' && !p.startsWith(':')

// Funciones load*: devuelven null si NO existe la fila (año nuevo)
// y lanzan el error si falla la consulta (red, permisos, etc.)

// ── PROPERTY ────────────────────────────────────────────────

export async function loadProperty(tipo, propietario, unidadId, anio) {
  const { data, error } = await supabase
    .from('properties')
    .select('data')
    .eq('tipo', tipo)
    .eq('propietario', propietario)
    .eq('unidad_id', unidadId)
    .eq('anio', anio)
    .maybeSingle()

  if (error) {
    console.error('Error loading property from Supabase:', error)
    throw error
  }
  return data?.data || null
}

// Fila del año más reciente (opcionalmente anterior a antesDeAnio)
export async function loadPropertyMasReciente(tipo, propietario, unidadId, antesDeAnio = null) {
  let query = supabase
    .from('properties')
    .select('data, anio')
    .eq('tipo', tipo)
    .eq('propietario', propietario)
    .eq('unidad_id', unidadId)

  if (antesDeAnio !== null) query = query.lt('anio', antesDeAnio)

  const { data, error } = await query
    .order('anio', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error loading latest property from Supabase:', error)
    throw error
  }
  return data?.data || null
}

export async function saveProperty(tipo, propietario, unidadId, anio, propertyData) {
  // Nunca guardar con params inválidos ni sin año
  if (![tipo, propietario, unidadId].every(esParamValido) || !Number.isInteger(anio)) {
    console.error('saveProperty cancelado: params inválidos', { tipo, propietario, unidadId, anio })
    return false
  }

  const { error } = await supabase
    .from('properties')
    .upsert(
      {
        tipo,
        propietario,
        unidad_id: unidadId,
        anio,
        data: propertyData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'tipo,propietario,unidad_id,anio' }
    )

  if (error) {
    console.error('Error saving property to Supabase:', error)
    return false
  }
  return true
}

// ── SETTINGS ────────────────────────────────────────────────

export async function loadSettings(anio) {
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .eq('id', anio)
    .maybeSingle()

  if (error) {
    console.error('Error loading settings from Supabase:', error)
    throw error
  }
  return data?.data || null
}

// Settings del año anterior más cercano que tenga fila
export async function loadSettingsMasReciente(antesDeAnio) {
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .lt('id', antesDeAnio)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error loading previous settings from Supabase:', error)
    throw error
  }
  return data?.data || null
}

export async function saveSettings(anio, settingsData) {
  if (!Number.isInteger(anio)) {
    console.error('saveSettings cancelado: año inválido', anio)
    return false
  }

  const { error } = await supabase
    .from('settings')
    .upsert(
      {
        id: anio,
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

export async function loadCampo(anio) {
  const { data, error } = await supabase
    .from('campo')
    .select('data')
    .eq('id', anio)
    .maybeSingle()

  if (error) {
    console.error('Error loading campo from Supabase:', error)
    throw error
  }
  return data?.data || null
}

export async function saveCampo(anio, campoData) {
  if (!Number.isInteger(anio)) {
    console.error('saveCampo cancelado: año inválido', anio)
    return false
  }

  const { error } = await supabase
    .from('campo')
    .upsert(
      {
        id: anio,
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

// ── PAGOS HIJO ──────────────────────────────────────────────

export async function loadPagosHijo(anio) {
  const { data, error } = await supabase
    .from('pagos_hijo')
    .select('data')
    .eq('id', anio)
    .maybeSingle()

  if (error) {
    console.error('Error loading pagos_hijo from Supabase:', error)
    throw error
  }
  return data?.data || null
}

export async function savePagosHijo(anio, pagosData) {
  if (!Number.isInteger(anio)) {
    console.error('savePagosHijo cancelado: año inválido', anio)
    return false
  }

  const { error } = await supabase
    .from('pagos_hijo')
    .upsert(
      {
        id: anio,
        data: pagosData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )

  if (error) {
    console.error('Error saving pagos_hijo to Supabase:', error)
    return false
  }
  return true
}
