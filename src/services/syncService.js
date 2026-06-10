import { supabase } from '../supabase'

function getKey(tipo, propietario, unidadId) {
  return `${tipo}-${propietario}-${unidadId}`
}

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
    .upsert({
      tipo,
      propietario,
      unidad_id: unidadId,
      data: propertyData,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error saving property to Supabase:', error)
    return false
  }
  return true
}

export async function migratePropertyFromLocalStorage(tipo, propietario, unidadId) {
  const key = getKey(tipo, propietario, unidadId)

  const dataPrincipal = localStorage.getItem(`alquiler-${key}`)
  const dataCochera = localStorage.getItem(`alquiler-${key}-cochera`)
  const dataDepto3C = localStorage.getItem(`alquiler-${key}-depto3c`)
  const contratoPrincipal = localStorage.getItem(`contrato-${key}-principal`)
  const contratoCochera = localStorage.getItem(`contrato-${key}-cochera`)
  const contratoDepto3C = localStorage.getItem(`contrato-${key}-depto3c`)
  const notasPrincipal = localStorage.getItem(`notas-gastos-${key}`)
  const notasCochera = localStorage.getItem(`notas-gastos-${key}-cochera`)
  const notasDepto3C = localStorage.getItem(`notas-gastos-${key}-depto3c`)
  const lockPrincipal = localStorage.getItem(`lock-${key}-principal`)
  const lockCochera = localStorage.getItem(`lock-${key}-cochera`)
  const lockDepto3C = localStorage.getItem(`lock-${key}-depto3c`)

  const propertyData = {}

  if (dataPrincipal) propertyData.principal = JSON.parse(dataPrincipal)
  if (dataCochera) propertyData.cochera = JSON.parse(dataCochera)
  if (dataDepto3C) propertyData.depto3c = JSON.parse(dataDepto3C)
  if (contratoPrincipal !== null) propertyData.contrato_principal = contratoPrincipal
  if (contratoCochera !== null) propertyData.contrato_cochera = contratoCochera
  if (contratoDepto3C !== null) propertyData.contrato_depto3c = contratoDepto3C
  if (notasPrincipal) propertyData.notas_principal = JSON.parse(notasPrincipal)
  if (notasCochera) propertyData.notas_cochera = JSON.parse(notasCochera)
  if (notasDepto3C) propertyData.notas_depto3c = JSON.parse(notasDepto3C)
  if (lockPrincipal) propertyData.lock_principal = JSON.parse(lockPrincipal)
  if (lockCochera) propertyData.lock_cochera = JSON.parse(lockCochera)
  if (lockDepto3C) propertyData.lock_depto3c = JSON.parse(lockDepto3C)

  if (Object.keys(propertyData).length === 0) return false

  return await saveProperty(tipo, propietario, unidadId, propertyData)
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
    .upsert({
      id: 1,
      data: settingsData,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error saving settings to Supabase:', error)
    return false
  }
  return true
}

export async function migrateSettingsFromLocalStorage() {
  const primerSem = localStorage.getItem('porcentaje-comision-primer-semestre')
  const segundoSem = localStorage.getItem('porcentaje-comision-segundo-semestre')
  const condiciones = localStorage.getItem('total-mensual-condiciones-v2')

  const settingsData = {}
  if (primerSem !== null) settingsData.comision_1er_semestre = parseFloat(primerSem)
  if (segundoSem !== null) settingsData.comision_2do_semestre = parseFloat(segundoSem)
  if (condiciones) settingsData.condiciones = JSON.parse(condiciones)

  if (Object.keys(settingsData).length === 0) return false

  return await saveSettings(settingsData)
}

// ── CAMPO (sueldos) ─────────────────────────────────────────

export async function migrateCampoFromLocalStorage(key) {
  const saved = localStorage.getItem(key)
  if (!saved) return false

  const data = JSON.parse(saved)
  // Campo data goes into settings as well, under "campo"
  const settings = (await loadSettings()) || {}
  settings.campo = {}
  settings.campo[key] = data
  return await saveSettings(settings)
}
