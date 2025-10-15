/**
 * Composable para utilidades de fecha
 * Funciones para formatear y manipular fechas en diferentes formatos
 */

/**
 * Función utilitaria para generar fechas en formato 01/MM/YYYY
 * @param {number} mes - Número del mes (1-12)
 * @param {number} año - Año (ej: 2025)
 * @returns {string} Fecha formateada como "01/MM/YYYY"
 */
export const formatearFechaPrimerDia = (mes, año) => {
  // Validar parámetros
  if (!mes || !año) {
    console.error('❌ formatearFechaPrimerDia: Se requieren mes y año')
    return null
  }

  if (mes < 1 || mes > 12) {
    console.error('❌ formatearFechaPrimerDia: El mes debe estar entre 1 y 12')
    return null
  }

  if (año < 1900 || año > 2100) {
    console.error('❌ formatearFechaPrimerDia: El año debe estar entre 1900 y 2100')
    return null
  }

  // Convertir mes a string con padding de ceros
  const mesFormateado = mes.toString().padStart(2, '0')

  // Generar fecha en formato 01/MM/YYYY
  const fechaFormateada = `01/${mesFormateado}/${año}`

  console.log(`📅 formatearFechaPrimerDia(${mes}, ${año}) -> ${fechaFormateada}`)

  return fechaFormateada
}

/**
 * Función utilitaria extendida para generar diferentes formatos de fecha
 * @param {number} mes - Número del mes (1-12)
 * @param {number} año - Año (ej: 2025)
 * @param {Object} opciones - Opciones de formato
 * @returns {Object} Objeto con diferentes formatos de fecha
 */
export const generarFormatosFecha = (mes, año, opciones = {}) => {
  const {
    incluirToDate = true, // Incluir formato TO_DATE de Oracle
    incluirISO = false, // Incluir formato ISO (YYYY-MM-DD)
    incluirPeriodo = false, // Incluir formato YYYYMM
    dia = 1, // Día del mes (por defecto 1)
  } = opciones

  // Validar parámetros
  if (!mes || !año) {
    console.error('❌ generarFormatosFecha: Se requieren mes y año')
    return {}
  }

  if (mes < 1 || mes > 12) {
    console.error('❌ generarFormatosFecha: El mes debe estar entre 1 y 12')
    return {}
  }

  // Formatear componentes
  const mesFormateado = mes.toString().padStart(2, '0')
  const diaFormateado = dia.toString().padStart(2, '0')

  const formatos = {
    // Formato básico DD/MM/YYYY
    ddmmyyyy: `${diaFormateado}/${mesFormateado}/${año}`,

    // Componentes separados
    año: año,
    mes: parseInt(mes),
    dia: parseInt(dia),
    mesFormateado: mesFormateado,
    diaFormateado: diaFormateado,
  }

  // Agregar formato TO_DATE si se solicita
  if (incluirToDate) {
    formatos.toDate = `TO_DATE('${diaFormateado}/${mesFormateado}/${año}', 'DD/MM/YYYY')`
  }

  // Agregar formato ISO si se solicita
  if (incluirISO) {
    formatos.iso = `${año}-${mesFormateado}-${diaFormateado}`
  }

  // Agregar formato período si se solicita
  if (incluirPeriodo) {
    formatos.periodo = `${año}${mesFormateado}`
  }

  console.log(`📅 generarFormatosFecha(${mes}, ${año}) ->`, formatos)

  return formatos
}

/**
 * Función para formatear fechas con diferentes estilos predefinidos
 * @param {number} mes - Número del mes (1-12)
 * @param {number} año - Año (ej: 2025)
 * @param {number} dia - Día del mes (opcional, por defecto 1)
 * @param {string} estilo - Estilo de formato ('oracle', 'iso', 'ddmm', 'periodo')
 * @returns {string} Fecha formateada según el estilo
 */
export const formatearFecha = (mes, año, dia = 1, estilo = 'ddmm') => {
  // Validar parámetros
  if (!mes || !año) {
    console.error('❌ formatearFecha: Se requieren mes y año')
    return null
  }

  const formatos = generarFormatosFecha(mes, año, {
    dia,
    incluirToDate: true,
    incluirISO: true,
    incluirPeriodo: true,
  })

  switch (estilo.toLowerCase()) {
    case 'oracle':
    case 'to_date':
      return formatos.toDate
    case 'iso':
      return formatos.iso
    case 'ddmm':
    case 'ddmmyyyy':
      return formatos.ddmmyyyy
    case 'periodo':
    case 'yyyymm':
      return formatos.periodo
    default:
      console.warn(`⚠️ formatearFecha: Estilo '${estilo}' no reconocido, usando 'ddmm'`)
      return formatos.ddmmyyyy
  }
}

/**
 * Función para obtener nombres de meses
 * @param {number} mes - Número del mes (1-12)
 * @returns {Object} Objeto con nombre corto y largo del mes
 */
export const obtenerNombreMes = (mes) => {
  const meses = [
    { corto: '', largo: '' }, // índice 0 (no usado)
    { corto: 'Ene', largo: 'Enero' },
    { corto: 'Feb', largo: 'Febrero' },
    { corto: 'Mar', largo: 'Marzo' },
    { corto: 'Abr', largo: 'Abril' },
    { corto: 'May', largo: 'Mayo' },
    { corto: 'Jun', largo: 'Junio' },
    { corto: 'Jul', largo: 'Julio' },
    { corto: 'Ago', largo: 'Agosto' },
    { corto: 'Sep', largo: 'Septiembre' },
    { corto: 'Oct', largo: 'Octubre' },
    { corto: 'Nov', largo: 'Noviembre' },
    { corto: 'Dic', largo: 'Diciembre' },
  ]

  if (mes < 1 || mes > 12) {
    console.error('❌ obtenerNombreMes: El mes debe estar entre 1 y 12')
    return { corto: '', largo: '' }
  }

  return meses[mes]
}

/**
 * Función para obtener el rango de fechas de un mes completo
 * @param {number} mes - Número del mes (1-12)
 * @param {number} año - Año (ej: 2025)
 * @param {string} formato - Formato de salida ('oracle', 'iso', 'ddmm')
 * @returns {Object} Objeto con fechas de inicio y fin del mes
 */
export const obtenerRangoMes = (mes, año, formato = 'oracle') => {
  // Validar parámetros
  if (!mes || !año) {
    console.error('❌ obtenerRangoMes: Se requieren mes y año')
    return {}
  }

  const inicio = formatearFecha(mes, año, 1, formato)

  // Calcular último día del mes
  const ultimoDia = new Date(año, mes, 0).getDate()
  const fin = formatearFecha(mes, año, ultimoDia, formato)

  const resultado = { inicio, fin }

  // Para Oracle, agregar formato especial con LAST_DAY
  if (formato === 'oracle') {
    const mesFormateado = mes.toString().padStart(2, '0')
    resultado.finConLastDay = `LAST_DAY(TO_DATE('01/${mesFormateado}/${año}', 'DD/MM/YYYY'))`
  }

  console.log(`📅 obtenerRangoMes(${mes}, ${año}, ${formato}) ->`, resultado)

  return resultado
}

/**
 * Hook composable principal
 * @returns {Object} Objeto con todas las funciones de utilidades de fecha
 */
export const useFechaUtils = () => {
  return {
    formatearFechaPrimerDia,
    generarFormatosFecha,
    formatearFecha,
    obtenerNombreMes,
    obtenerRangoMes,
  }
}
