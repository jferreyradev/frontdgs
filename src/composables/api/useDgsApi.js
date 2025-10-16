import { useApiFetch } from './useSimpleFetch.js'

/**
 * Composable especializado para la API DGS
 * Proporciona métodos específicos para las consultas más comunes
 */
export function useDgsApi() {
  const { loading, error, result, apiFetch } = useApiFetch()

  // Configuración base de la API
  const API_BASE_URL = '/api'
  const DEFAULT_AUTH_TOKEN = 'Bearer apiDG$prod'

  /**
   * Verifica si el servidor backend está disponible
   */
  async function verificarServidorDisponible() {
    try {
      console.log('🔍 Verificando disponibilidad del servidor...')

      // Intentar conectar a diferentes endpoints posibles
      const endpoints = ['/api/health', '/api/status', '/api/exec', '/health', '/status']

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            signal: AbortSignal.timeout(5000), // 5 segundos timeout
          })

          console.log(`✅ Endpoint ${endpoint} responde:`, {
            status: response.status,
            statusText: response.statusText,
          })

          return {
            disponible: true,
            endpoint: endpoint,
            status: response.status,
          }
        } catch (err) {
          console.log(`❌ Endpoint ${endpoint} no disponible:`, err.message)
        }
      }

      return {
        disponible: false,
        mensaje: 'Ningún endpoint del servidor está disponible',
      }
    } catch (error) {
      console.error('Error verificando servidor:', error)
      return {
        disponible: false,
        mensaje: error.message,
      }
    }
  }

  /**
   * Ejecuta una consulta SQL directa
   * @param {string} query - Consulta SQL a ejecutar
   * @param {string} token - Token de autorización opcional
   */
  async function executeQuery(query, token = DEFAULT_AUTH_TOKEN) {
    try {
      console.log('🔍 Ejecutando consulta SQL:', {
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        endpoint: `${API_BASE_URL}/exec`,
        token: token.substring(0, 20) + '...',
      })

      const url = `${API_BASE_URL}/exec`
      const fullUrl = new URL(url, window.location.origin).href

      console.log('📡 URL completa de la petición:', fullUrl)

      return await apiFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ query }),
      })
    } catch (error) {
      console.error('❌ Error en executeQuery:', {
        query: query.substring(0, 50) + '...',
        error: error.message,
        endpoint: `${API_BASE_URL}/exec`,
      })

      // Si es error de red, sugerir verificación del servidor
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        console.error(
          '💡 Sugerencia: Verificar que el servidor backend esté corriendo en el puerto correcto',
        )
        console.error('🔧 Ejecutar verificarServidorDisponible() para diagnosticar')
      }

      throw error
    }
  }

  async function executeProc(query, token = DEFAULT_AUTH_TOKEN) {
    try {
      return await apiFetch(`${API_BASE_URL}/procedure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ query }),
      })
    } catch (error) {
      console.error('Error en executeProc:', { query, error: error.message })
      throw error
    }
  }
  /**
   * Obtiene datos de períodos activos
   */
  async function getPeriodoActivo() {
    try {
      const result = await executeQuery('SELECT PERIODO FROM usuario.periodo WHERE activo = 1')
      console.log(result)
      return result && result.length > 0 && result[0].PERIODO ? result : []
    } catch (error) {
      console.error('Error en getPeriodoActivo:', error.message)
      throw error
    }
  }

  /**
   * Obtiene todos los tipos de liquidación
   */
  async function getTiposLiquidacion() {
    try {
      return await executeQuery('SELECT * FROM usuario.tabtipoliquidacion ORDER BY 1')
    } catch (error) {
      console.error('Error en getTiposLiquidacion:', error.message)
      throw error
    }
  }

  /**
   * Obtiene todos los grupos de repartición
   */
  async function getGruposReparticion() {
    try {
      return await executeQuery('SELECT * FROM usuario.gruposreparticion ORDER BY 1')
    } catch (error) {
      console.error('Error en getGruposReparticion:', error.message)
      throw error
    }
  }

  /**
   * Obtiene liquidaciones por período
   * @param {string} periodo - Período en formato 'YYYY-MM'
   * @param {number} tipoLiquidacion - ID del tipo de liquidación
   * @param {number} grupoReparticion - ID del grupo de repartición
   */
  async function getLiquidacionesPorPeriodo(
    periodo,
    tipoLiquidacion = null,
    grupoReparticion = null,
  ) {
    try {
      let query = `
        SELECT *
        FROM liquidaciones
        WHERE periodo = '${periodo}'
      `

      if (tipoLiquidacion && tipoLiquidacion !== -1) {
        query += ` AND tipo_liquidacion_id = ${tipoLiquidacion}`
      }

      if (grupoReparticion && grupoReparticion !== -1) {
        query += ` AND grupo_reparticion_id = ${grupoReparticion}`
      }

      query += ' ORDER BY fecha_liquidacion DESC'

      return await executeQuery(query)
    } catch (error) {
      console.error('Error en getLiquidacionesPorPeriodo:', {
        periodo,
        tipoLiquidacion,
        grupoReparticion,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * Obtiene reportes por filtros
   * @param {Object} filtros - Objeto con filtros { periodo, tipoLiquidacion, grupoReparticion }
   */

  async function getReporteProcesos(filtros = {}) {
    try {
      console.log('🔍 Generando reporte de procesos con filtros:', filtros)

      const { periodo, tipoLiquidacion, grupoReparticion } = filtros

      let query = `
        SELECT ec.ID_EJEC_CAB, ec.ID_PROC_CAB, PC.DESCRIPCION,
         ec.PERIODO, ec.IDTIPOLIQ, ec.GRUPOADIC, ec.GRUPOREP, 
         ec.FECHAHORA, ed.ESTADO, ed.NROEJEC, ed.ID_PROC_DET,
         PD.DESCRIPCION as DESC_PROC_DET,
         ed.ID_PROC_DEP, ed.ORDENEJEC, 
         ED.ID_PROC_CAB_DEP, ED.ID_PROC_DET_DEP
        from WORKFLOW.EJEC_DET ed
        inner join WORKFLOW.EJEC_CAB ec on EC.ID_EJEC_CAB = ED.ID_EJEC_CAB
        inner join WORKFLOW.PROC_CAB pc on PC.ID_PROC_CAB = EC.ID_PROC_CAB
        inner join WORKFLOW.PROC_DET pd on PD.ID_PROC_DET = ED.ID_PROC_DET
        inner join WORKFLOW.PROC_CAB_ORDEN o on O.ID_PROC_CAB = PC.ID_PROC_CAB
        where 1=1      
      `

      if (periodo) {
        // El período viene formateado como '01/MM/YYYY', necesitamos convertirlo a TO_DATE
        if (periodo.includes('/')) {
          // Si es formato DD/MM/YYYY, usar TO_DATE
          query += ` AND ec.periodo = TO_DATE('${periodo}', 'DD/MM/YYYY')`
        } else {
          // Si es otro formato (ej: número), usar directamente
          query += ` AND ec.periodo = ${periodo}`
        }
      }

      if (tipoLiquidacion && tipoLiquidacion !== -1) {
        query += ` AND EC.IDTIPOLIQ = ${tipoLiquidacion}`
      }

      if (grupoReparticion && grupoReparticion !== -1) {
        query += ` AND EC.GRUPOREP = ${grupoReparticion}`
      }

      query += ' order by o.orden, ec.fechahora, ED.ORDENEJEC'

      console.log('📝 Consulta SQL final del reporte de procesos:', query)

      const resultado = await executeQuery(query)

      console.log('📥 Resultado de getReporteProcesos:', {
        tipo: typeof resultado,
        esArray: Array.isArray(resultado),
        longitud: Array.isArray(resultado) ? resultado.length : 'N/A',
        primerElemento: Array.isArray(resultado) && resultado.length > 0 ? resultado[0] : null,
      })

      return resultado
    } catch (error) {
      console.error('Error en getReporteProcesos:', { filtros, error: error.message })
      throw error
    }
  }

  /**
   * Verifica la conectividad con la API
   */
  async function verificarConexion() {
    try {
      await executeQuery('SELECT 1 as test from dual')
      return { conectado: true, mensaje: 'Conexión exitosa' }
    } catch (err) {
      return { conectado: false, mensaje: err.message }
    }
  }

  return {
    // Estados reactivos
    loading,
    error,
    result,

    // Funciones base
    executeQuery,
    executeProc,
    verificarConexion,
    verificarServidorDisponible,

    // Funciones específicas
    getPeriodoActivo,
    getTiposLiquidacion,
    getGruposReparticion,
    getLiquidacionesPorPeriodo,
    getReporteProcesos,
  }
}
