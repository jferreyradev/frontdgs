/**
 * Composable para manejo y formateo de fechas
 * Proporciona funciones útiles para trabajar con fechas en diferentes formatos
 */
export function useFechas() {
  /**
   * Transforma fecha de formato ISO (2025-09-01T00:00:00Z) a formato DD/MM/YYYY (01/09/2025)
   * @param {string} fechaISO - Fecha en formato ISO string
   * @returns {string} - Fecha en formato DD/MM/YYYY
   */
  function formatearFecha(fechaISO) {
    if (!fechaISO) return ''

    try {
      const fecha = new Date(fechaISO)

      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida:', fechaISO)
        return fechaISO // Retorna el valor original si no es válida
      }

      const dia = fecha.getDate().toString().padStart(2, '0')
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0') // Los meses son 0-indexados
      const año = fecha.getFullYear()

      return `${dia}/${mes}/${año}`
    } catch (error) {
      console.error('Error al formatear fecha:', error, fechaISO)
      return fechaISO // Retorna el valor original en caso de error
    }
  }

  /**
   * Transforma fecha de formato DD/MM/YYYY a formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
   * @param {string} fechaDDMMYYYY - Fecha en formato DD/MM/YYYY
   * @param {string} hora - Hora opcional en formato HH:mm:ss (default: '00:00:00')
   * @returns {string} - Fecha en formato ISO
   */
  function fechaAISO(fechaDDMMYYYY, hora = '00:00:00') {
    if (!fechaDDMMYYYY) return ''

    try {
      const partes = fechaDDMMYYYY.split('/')
      if (partes.length !== 3) {
        console.warn('Formato de fecha inválido. Esperado DD/MM/YYYY:', fechaDDMMYYYY)
        return fechaDDMMYYYY
      }

      const [dia, mes, año] = partes
      const fecha = new Date(`${año}-${mes}-${dia}T${hora}.000Z`)

      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida:', fechaDDMMYYYY)
        return fechaDDMMYYYY
      }

      return fecha.toISOString()
    } catch (error) {
      console.error('Error al convertir fecha a ISO:', error, fechaDDMMYYYY)
      return fechaDDMMYYYY
    }
  }

  /**
   * Formatea fecha con hora completa
   * @param {string} fechaISO - Fecha en formato ISO
   * @returns {string} - Fecha en formato DD/MM/YYYY HH:mm:ss
   */
  function formatearFechaConHora(fechaISO) {
    if (!fechaISO) return ''

    try {
      const fecha = new Date(fechaISO)

      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida:', fechaISO)
        return fechaISO
      }

      const dia = fecha.getDate().toString().padStart(2, '0')
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
      const año = fecha.getFullYear()
      const horas = fecha.getHours().toString().padStart(2, '0')
      const minutos = fecha.getMinutes().toString().padStart(2, '0')
      const segundos = fecha.getSeconds().toString().padStart(2, '0')

      return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`
    } catch (error) {
      console.error('Error al formatear fecha con hora:', error, fechaISO)
      return fechaISO
    }
  }

  /**
   * Obtiene la fecha actual en formato DD/MM/YYYY
   * @returns {string} - Fecha actual en formato DD/MM/YYYY
   */
  function fechaHoy() {
    return formatearFecha(new Date().toISOString())
  }

  /**
   * Verifica si una fecha es válida
   * @param {string} fecha - Fecha a validar
   * @returns {boolean} - true si es válida, false si no
   */
  function esFechaValida(fecha) {
    if (!fecha) return false
    const fechaObj = new Date(fecha)
    return !isNaN(fechaObj.getTime())
  }

  /**
   * Calcula la diferencia en días entre dos fechas
   * @param {string} fecha1 - Primera fecha (ISO o DD/MM/YYYY)
   * @param {string} fecha2 - Segunda fecha (ISO o DD/MM/YYYY)
   * @returns {number} - Diferencia en días
   */
  function diferenciaDias(fecha1, fecha2) {
    try {
      const f1 = new Date(fecha1.includes('/') ? fechaAISO(fecha1) : fecha1)
      const f2 = new Date(fecha2.includes('/') ? fechaAISO(fecha2) : fecha2)

      if (isNaN(f1.getTime()) || isNaN(f2.getTime())) {
        console.warn('Una de las fechas es inválida:', fecha1, fecha2)
        return 0
      }

      const diferencia = f2.getTime() - f1.getTime()
      return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
    } catch (error) {
      console.error('Error al calcular diferencia de días:', error)
      return 0
    }
  }

  return {
    formatearFecha,
    fechaAISO,
    formatearFechaConHora,
    fechaHoy,
    esFechaValida,
    diferenciaDias,
  }
}
