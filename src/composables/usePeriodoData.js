import { computed } from 'vue'

/**
 * Composable para generar datos de períodos (meses y años)
 * Compatible con ComboSimple
 */
export function usePeriodoData() {
  // Generar meses para combo
  const mesesCombo = computed(() => [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' },
  ])

  // Generar años para combo (configurable)
  const generarAños = (añoMinimo = 2020, añoMaximo = 2030) => {
    const años = []
    for (let año = añoMinimo; año <= añoMaximo; año++) {
      años.push({ id: año, nombre: año.toString() })
    }
    return años
  }

  // Obtener año actual
  const añoActual = new Date().getFullYear()

  // Obtener mes actual
  const mesActual = new Date().getMonth() + 1

  // Obtener nombre del mes por ID
  const obtenerNombreMes = (idMes) => {
    const mes = mesesCombo.value.find((m) => m.id === parseInt(idMes))
    return mes ? mes.nombre : ''
  }

  // Generar fechas ISO a partir de mes y año
  const generarFechasISO = (mes, año) => {
    if (!mes || !año) return { fechaInicioISO: null, fechaFinISO: null }

    const ultimoDia = new Date(año, mes, 0).getDate()

    return {
      fechaInicioISO: `${año}-${mes.toString().padStart(2, '0')}-01T00:00:00.000Z`,
      fechaFinISO: `${año}-${mes.toString().padStart(2, '0')}-${ultimoDia.toString().padStart(2, '0')}T23:59:59.999Z`,
    }
  }

  // Validar período
  const validarPeriodo = (mes, año) => {
    const mesNum = parseInt(mes)
    const añoNum = parseInt(año)

    return {
      mesValido: mesNum >= 1 && mesNum <= 12,
      añoValido: añoNum >= 1900 && añoNum <= 2100,
      periodoCompleto: mesNum && añoNum,
      esFuturo: añoNum > añoActual || (añoNum === añoActual && mesNum > mesActual),
    }
  }

  return {
    // Data para combos
    mesesCombo,
    generarAños,

    // Valores actuales
    añoActual,
    mesActual,

    // Utilidades
    obtenerNombreMes,
    generarFechasISO,
    validarPeriodo,
  }
}
