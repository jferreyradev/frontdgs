import { useApiFetch } from './useSimpleFetch.js'

/**
 * Composable especializado para la API DGS
 * Proporciona métodos específicos para las consultas más comunes
 */
export function useDgsApi() {
  const { loading, error, result, apiFetch } = useApiFetch()

  // Configuración base de la API
  const API_BASE_URL = '/api'
  const DEFAULT_AUTH_TOKEN = 'Bearer apiDG$test'

  /**
   * Ejecuta una consulta SQL directa
   * @param {string} query - Consulta SQL a ejecutar
   * @param {string} token - Token de autorización opcional
   */
  async function executeQuery(query, token = DEFAULT_AUTH_TOKEN) {
    return await apiFetch(`${API_BASE_URL}/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ query }),
    })
  }

  async function executeProc(query, token = DEFAULT_AUTH_TOKEN) {
    return await apiFetch(`${API_BASE_URL}/procedure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ query }),
    })
  }
  /**
   * Obtiene datos de períodos activos
   */
  async function getPeriodoActivo() {
    const result = await executeQuery('SELECT PERIODO FROM usuario.periodo WHERE activo = 1')
    console.log(result)
    return result[0].PERIODO ? result : []
  }

  /**
   * Obtiene todos los tipos de liquidación
   */
  async function getTiposLiquidacion() {
    return await executeQuery('SELECT * FROM usuario.tabtipoliquidacion ORDER BY 1')
  }

  /**
   * Obtiene todos los grupos de repartición
   */
  async function getGruposReparticion() {
    return await executeQuery('SELECT * FROM usuario.gruposreparticion ORDER BY 1')
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
  }

  /**
   * Obtiene reportes por filtros
   * @param {Object} filtros - Objeto con filtros { periodo, tipoLiquidacion, grupoReparticion }
   */
  async function getReportes(filtros = {}) {
    const { periodo, tipoLiquidacion, grupoReparticion } = filtros

    let query = `
      SELECT
        r.*,
        tl.descripcion as tipo_liquidacion_desc,
        gr.nombre as grupo_reparticion_nombre
      FROM reportes r
      LEFT JOIN usuario.tabtipoliquidacion tl ON r.tipo_liquidacion_id = tl.idtipoliquidacion
      LEFT JOIN usuario.gruposreparticion gr ON r.grupo_reparticion_id = gr.id
      WHERE 1=1
    `

    if (periodo) {
      query += ` AND r.periodo = '${periodo}'`
    }

    if (tipoLiquidacion && tipoLiquidacion !== -1) {
      query += ` AND r.tipo_liquidacion_id = ${tipoLiquidacion}`
    }

    if (grupoReparticion && grupoReparticion !== -1) {
      query += ` AND r.grupo_reparticion_id = ${grupoReparticion}`
    }

    query += ' ORDER BY r.fecha_creacion DESC'

    return await executeQuery(query)
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

    // Funciones específicas
    getPeriodoActivo,
    getTiposLiquidacion,
    getGruposReparticion,
    getLiquidacionesPorPeriodo,
    getReportes,
  }
}
