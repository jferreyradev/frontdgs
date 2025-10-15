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

  async function getReporteProcesos(filtros = {}) {
    console.log('Generando reporte de procesos con filtros:', filtros)

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
      where WHERE 1=1      
    `

    if (periodo) {
      query += ` AND ec.periodo = ${periodo}`
    }

    if (tipoLiquidacion && tipoLiquidacion !== -1) {
      query += ` AND EC.IDTIPOLIQ = ${tipoLiquidacion}`
    }

    if (grupoReparticion && grupoReparticion !== -1) {
      query += ` AND EC.GRUPOREP = ${grupoReparticion}`
    }

    query += ' order by o.orden, ec.fechahora, ED.ORDENEJEC'

    console.log('Consulta de reporte de procesos:', query)

    //return '12'

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
    getReporteProcesos,
  }
}
