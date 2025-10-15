<template>
  <div class="consultas-view">
    <h1>Consultas SQL</h1>

    <!-- Información de filtros activos -->
    <div v-if="filtrosStore.hayFiltrosActivos" class="filtros-info">
      <h3>🎯 Filtros Activos</h3>
      <div class="filtros-list">
        <span v-for="filtro in filtrosInfo" :key="filtro" class="filtro-badge">
          {{ filtro }}
        </span>
      </div>
      <p class="filtros-help">
        💡 Las consultas con "filtros activos" usarán automáticamente estos filtros en la cláusula
        WHERE
      </p>
    </div>

    <div v-else class="sin-filtros-info">
      <p class="sin-filtros-text">
        ℹ️ No hay filtros activos. Configura filtros en el panel lateral para usar consultas con
        filtros automáticos.
      </p>

      <!-- Panel de configuración rápida de filtros -->
      <div class="config-filtros-rapida">
        <h4>⚡ Configuración Rápida de Filtros</h4>
        <div class="filtros-rapidos">
          <div class="filtro-grupo">
            <label>📅 Período:</label>
            <div class="filtro-controles">
              <select v-model="periodoTemp.mes" class="filtro-select">
                <option value="">Seleccionar mes</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
              <input
                v-model="periodoTemp.año"
                type="number"
                min="2020"
                max="2030"
                class="filtro-input"
                placeholder="Año"
              />
              <button
                @click="aplicarPeriodo"
                class="btn-aplicar"
                :disabled="!periodoTemp.mes || !periodoTemp.año"
              >
                Aplicar
              </button>
            </div>
          </div>

          <div class="filtro-grupo">
            <label>📋 Tipo de Liquidación:</label>
            <div class="filtro-controles">
              <input
                v-model="tipoTemp.codigo"
                class="filtro-input"
                placeholder="Código (ej: HAB)"
              />
              <input
                v-model="tipoTemp.descripcion"
                class="filtro-input"
                placeholder="Descripción (ej: Haberes)"
              />
              <button @click="aplicarTipo" class="btn-aplicar" :disabled="!tipoTemp.codigo">
                Aplicar
              </button>
            </div>
          </div>

          <div class="filtro-grupo">
            <label>🏢 Grupo Repartición:</label>
            <div class="filtro-controles">
              <input
                v-model="grupoTemp.codigo"
                class="filtro-input"
                placeholder="Código (ej: GRP1)"
              />
              <input
                v-model="grupoTemp.descripcion"
                class="filtro-input"
                placeholder="Descripción (ej: Grupo 1)"
              />
              <button @click="aplicarGrupo" class="btn-aplicar" :disabled="!grupoTemp.codigo">
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sql-query-section">
      <div class="query-editor">
        <div class="editor-header">
          <h3>💻 Editor de Consultas SQL</h3>
          <div class="editor-actions">
            <button @click="testConnection" class="btn-test" :disabled="loading">
              🔗 Probar Conexión
            </button>
            <button @click="clearQuery" class="btn-clear" :disabled="loading">🗑️ Limpiar</button>
            <button
              @click="executeQueryHandler"
              class="btn-execute"
              :disabled="loading || !sqlQuery.trim()"
            >
              {{ loading ? '⏳ Ejecutando...' : '▶️ Ejecutar' }}
            </button>
          </div>
        </div>

        <div class="editor-container">
          <div v-if="filtrosStore.hayFiltrosActivos" class="filtros-helper">
            <div class="helper-buttons">
              <button @click="insertWhereClause" class="btn-where" :disabled="loading">
                📝 Insertar WHERE con filtros seleccionados
              </button>
              <button @click="mostrarFormatosFecha" class="btn-formatos" :disabled="loading">
                📅 Ver formatos de fecha
              </button>
              <button
                @click="ejecutarConFiltros"
                class="btn-execute-filters"
                :disabled="loading || !sqlQuery.trim()"
              >
                🎯 Ejecutar con filtros
              </button>
              <button
                @click="ejecutarConsultaPersonalizada"
                class="btn-execute-custom"
                :disabled="loading || !sqlQuery.trim()"
              >
                ⚙️ Ejecutar personalizada
              </button>
            </div>

            <div class="where-preview">
              <strong>Cláusula WHERE generada:</strong>
              <code>{{ whereClause || 'Sin filtros seleccionados' }}</code>
              <small v-if="whereClause" class="filtros-count">
                ({{ Object.values(filtrosSeleccionados).filter(Boolean).length }} filtro(s)
                activo(s))
              </small>
            </div>

            <!-- Sección de depuración (temporal) -->
            <div class="debug-section">
              <details>
                <summary>🔍 Debug: Estado de filtros</summary>
                <div class="debug-content">
                  <div><strong>Filtros seleccionados:</strong></div>
                  <pre>{{ JSON.stringify(filtrosSeleccionados, null, 2) }}</pre>

                  <div><strong>Filtros activos del store:</strong></div>
                  <pre>{{ JSON.stringify(debugFiltros.activos, null, 2) }}</pre>

                  <div><strong>Hay filtros activos:</strong> {{ debugFiltros.hayActivos }}</div>

                  <div><strong>WHERE clause:</strong> {{ whereClause || 'vacío' }}</div>

                  <div class="debug-actions">
                    <button
                      @click="filtrosStore.setPeriodo({ mes: 10, año: 2025, mesNombre: 'Octubre' })"
                      class="btn-debug"
                    >
                      Establecer período prueba
                    </button>
                    <button
                      @click="
                        filtrosStore.setTipoLiquidacion({ codigo: 'HAB', descripcion: 'Haberes' })
                      "
                      class="btn-debug"
                    >
                      Establecer tipo prueba
                    </button>
                    <button
                      @click="
                        filtrosStore.setGrupoReparticion({ codigo: 'GRP1', descripcion: 'Grupo 1' })
                      "
                      class="btn-debug"
                    >
                      Establecer grupo prueba
                    </button>
                    <button @click="filtrosStore.limpiarTodos()" class="btn-debug btn-danger">
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              </details>
            </div>

            <div v-if="mostrarFormatos" class="formatos-fecha">
              <h4>📅 Formatos de fecha disponibles para el período:</h4>
              <div class="formato-item" v-for="(formato, key) in formatosDisponibles" :key="key">
                <strong>{{ key }}:</strong>
                <code @click="copiarFormato(formato)" class="formato-code">{{ formato }}</code>
              </div>
            </div>

            <div v-if="ultimaConsultaConFiltros" class="consulta-ejecutada">
              <h4>🎯 Última consulta ejecutada con filtros:</h4>
              <div class="consulta-info">
                <div class="info-item">
                  <strong>⏰ Ejecutada:</strong>
                  <span>{{ ultimaConsultaConFiltros.timestamp }}</span>
                </div>
                <div class="info-item">
                  <strong>🔍 Filtros aplicados:</strong>
                  <code>{{ ultimaConsultaConFiltros.filtrosAplicados }}</code>
                </div>
                <div class="info-item">
                  <strong>📝 Consulta final:</strong>
                  <code class="consulta-final">{{ ultimaConsultaConFiltros.consultaFinal }}</code>
                </div>
              </div>
            </div>
          </div>

          <textarea
            v-model="sqlQuery"
            class="sql-textarea"
            placeholder="Escribe tu consulta SQL aquí...&#10;&#10;Ejemplos:&#10;SELECT * FROM usuario.liquidacion WHERE rownum <= 10&#10;CREATE TABLE test_tabla (id NUMBER, nombre VARCHAR2(100))&#10;INSERT INTO test_tabla VALUES (1, 'ejemplo')"
            rows="8"
            :disabled="loading"
          ></textarea>

          <!-- Sección de ayuda para funciones genéricas -->
          <div class="helper-section">
            <button @click="mostrarAyudaGenerica = !mostrarAyudaGenerica" class="btn-help-toggle">
              {{ mostrarAyudaGenerica ? '🔽' : '▶️' }} Ayuda: Consultas con Campos Personalizados
            </button>

            <div v-if="mostrarAyudaGenerica" class="ayuda-generica">
              <h4>⚙️ Función Genérica de Consultas</h4>
              <p>
                El botón "Ejecutar personalizada" usa campos estándar para liquidaciones. Para otros
                casos, usa estas funciones en consola:
              </p>

              <div class="ejemplo-codigo">
                <strong>📋 Para liquidaciones (campos estándar):</strong>
                <code>ejecutarConsultaLiquidaciones("SELECT * FROM usuario.liquidacion")</code>
              </div>

              <div class="ejemplo-codigo">
                <strong>👥 Para empleados:</strong>
                <code>ejecutarConsultaEmpleados("SELECT * FROM usuario.empleado")</code>
              </div>

              <div class="ejemplo-codigo">
                <strong>💰 Para nómina (formato YYYYMM):</strong>
                <code>ejecutarConsultaNomina("SELECT * FROM usuario.nomina")</code>
              </div>

              <div class="ejemplo-codigo">
                <strong>🔧 Personalizada completa:</strong>
                <code
                  >ejecutarConsultaConFiltrosPersonalizados("SELECT * FROM mi_tabla", {
                  campoPeriodo: 'MI_FECHA', campoTipo: 'MI_TIPO', campoGrupo: 'MI_GRUPO',
                  formatoPeriodo: 'TO_DATE', operadorPeriodo: '>=' })</code
                >
              </div>

              <div class="formatos-disponibles">
                <strong>📅 Formatos de período disponibles:</strong>
                <ul>
                  <li><code>TO_DATE</code> - TO_DATE('01/MM/YYYY', 'DD/MM/YYYY')</li>
                  <li><code>YYYYMM</code> - '202510'</li>
                  <li><code>YYYY-MM-DD</code> - '2025-10-01'</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="query-examples">
          <div class="examples-header">
            <h4>📝 Consultas Predefinidas</h4>
            <div class="consultas-stats">
              <span class="stat-item">Total: {{ consultasStats.total }}</span>
              <span class="stat-item">Con filtros: {{ consultasStats.conFiltros }}</span>
              <span class="stat-item">Disponibles: {{ consultasStats.disponibles }}</span>
            </div>
          </div>
          <p class="examples-help">
            Selecciona una consulta para cargarla en el editor. Las consultas marcadas con 🎯 usan
            automáticamente los filtros seleccionados.
            <span v-if="!filtrosStore.hayFiltrosActivos" class="no-filters-warning">
              ⚠️ Configura filtros para activar más consultas.
            </span>
          </p>

          <!-- Consultas Básicas -->
          <div class="examples-category">
            <h5>📋 Consultas Básicas</h5>
            <div class="examples-grid">
              <button
                v-for="example in sqlExamples.filter((e) => e.category === 'basicas')"
                :key="example.name"
                @click="loadExample(example.query)"
                class="example-btn"
                :class="{ 'with-filters': example.usaFiltros }"
                :disabled="loading || !getQueryInfo(example).disponible"
                :title="getQueryInfo(example).tooltip"
              >
                {{ example.name }}
                <span v-if="example.usaFiltros" class="filter-indicator">🎯</span>
              </button>
            </div>
          </div>

          <!-- Consultas por Período -->
          <div class="examples-category">
            <h5>📅 Consultas por Período</h5>
            <div class="examples-grid">
              <button
                v-for="example in sqlExamples.filter((e) => e.category === 'periodo')"
                :key="example.name"
                @click="loadExample(example.query)"
                class="example-btn"
                :class="{ 'with-filters': example.usaFiltros }"
                :disabled="loading || !getQueryInfo(example).disponible"
                :title="getQueryInfo(example).tooltip"
              >
                {{ example.name }}
                <span v-if="example.usaFiltros" class="filter-indicator">🎯</span>
              </button>
            </div>
          </div>

          <!-- Consultas Analíticas -->
          <div class="examples-category">
            <h5>📊 Consultas Analíticas</h5>
            <div class="examples-grid">
              <button
                v-for="example in sqlExamples.filter((e) => e.category === 'analiticas')"
                :key="example.name"
                @click="loadExample(example.query)"
                class="example-btn"
                :class="{ 'with-filters': example.usaFiltros }"
                :disabled="loading || !getQueryInfo(example).disponible"
                :title="getQueryInfo(example).tooltip"
              >
                {{ example.name }}
                <span v-if="example.usaFiltros" class="filter-indicator">🎯</span>
              </button>
            </div>
          </div>

          <!-- Consultas de Referencia -->
          <div class="examples-category">
            <h5>⚙️ Consultas de Referencia</h5>
            <div class="examples-grid">
              <button
                v-for="example in sqlExamples.filter((e) => e.category === 'referencia')"
                :key="example.name"
                @click="loadExample(example.query)"
                class="example-btn"
                :disabled="loading"
                :title="getQueryInfo(example).tooltip"
              >
                {{ example.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="results-section">
      <h3>📊 Resultados</h3>
      <DataTable :columns="queryColumns" :rows="queryRows" :loading="loading" :error="error" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDgsApi } from '@/composables/api/useDgsApi.js'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'
import DataTable from '@/components/DataTable.vue'

const { executeQuery, loading, error } = useDgsApi()
const filtrosStore = useFiltrosActivosStore()

const sqlQuery = ref('')
const queryColumns = ref([])
const queryRows = ref([])
const mostrarFormatos = ref(false)
const ultimaConsultaConFiltros = ref(null)
const mostrarAyudaGenerica = ref(false)

// Variables temporales para configuración rápida de filtros
const periodoTemp = ref({ mes: '', año: '' })
const tipoTemp = ref({ codigo: '', descripcion: '' })
const grupoTemp = ref({ codigo: '', descripcion: '' })

// Estados para seleccionar filtros específicos
const filtrosSeleccionados = ref({
  periodo: true,
  tipoLiquidacion: true,
  grupoReparticion: true,
})

// Formatos de fecha computados
const formatosDisponibles = computed(() => {
  const formatos = generarFormatosPeriodo()
  if (!formatos.inicioMes) return {}

  return {
    'Inicio del mes': formatos.inicioMes,
    'Fin del mes': formatos.finMes,
    'Período YYYYMM': formatos.periodoString,
    Año: formatos.año,
    Mes: formatos.mes,
    'Rango completo': `FECHA BETWEEN ${formatos.rangoMes.inicio} AND ${formatos.rangoMes.fin}`,
  }
})

// Construir cláusula WHERE basada en filtros activos y seleccionados
const whereClause = computed(() => {
  const conditions = []

  // Período (mes y año) - formato TO_DATE
  if (
    filtrosSeleccionados.value.periodo &&
    filtrosStore.periodoActivo &&
    filtrosStore.periodoActivo.mes &&
    filtrosStore.periodoActivo.año
  ) {
    const año = filtrosStore.periodoActivo.año
    const mes = filtrosStore.periodoActivo.mes.toString().padStart(2, '0')
    // Generar TO_DATE para el primer día del mes
    const fechaInicio = `TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY')`
    conditions.push(`FECHA_PERIODO >= ${fechaInicio}`)

    // Opcional: también podemos agregar el fin del mes
    // const fechaFin = `LAST_DAY(TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY'))`
    // conditions.push(`FECHA_PERIODO <= ${fechaFin}`)
  }

  // Tipo de liquidación
  if (
    filtrosSeleccionados.value.tipoLiquidacion &&
    filtrosStore.tipoLiquidacionActivo &&
    filtrosStore.tipoLiquidacionActivo.codigo
  ) {
    conditions.push(`TIPO_LIQUIDACION = '${filtrosStore.tipoLiquidacionActivo.codigo}'`)
  }

  // Grupo repartición
  if (
    filtrosSeleccionados.value.grupoReparticion &&
    filtrosStore.grupoReparticionActivo &&
    filtrosStore.grupoReparticionActivo.codigo
  ) {
    conditions.push(`GRUPO_REPARTICION = '${filtrosStore.grupoReparticionActivo.codigo}'`)
  }

  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
})

// Computed de depuración para verificar el estado de los filtros
const debugFiltros = computed(() => {
  console.log('🔍 Debug filtros:', {
    filtrosSeleccionados: filtrosSeleccionados.value,
    periodoActivo: filtrosStore.periodoActivo,
    tipoLiquidacionActivo: filtrosStore.tipoLiquidacionActivo,
    grupoReparticionActivo: filtrosStore.grupoReparticionActivo,
    hayFiltrosActivos: filtrosStore.hayFiltrosActivos,
  })

  return {
    seleccionados: filtrosSeleccionados.value,
    activos: {
      periodo: filtrosStore.periodoActivo,
      tipo: filtrosStore.tipoLiquidacionActivo,
      grupo: filtrosStore.grupoReparticionActivo,
    },
    hayActivos: filtrosStore.hayFiltrosActivos,
  }
})

// Información de filtros activos para mostrar al usuario
const filtrosInfo = computed(() => {
  const filtros = []

  if (
    filtrosStore.periodoActivo &&
    filtrosStore.periodoActivo.mes &&
    filtrosStore.periodoActivo.año
  ) {
    filtros.push(`📅 ${filtrosStore.periodoActivo.mesNombre} ${filtrosStore.periodoActivo.año}`)
  }

  if (filtrosStore.tipoLiquidacionActivo) {
    const desc =
      filtrosStore.tipoLiquidacionActivo.descripcion ||
      filtrosStore.tipoLiquidacionActivo.DESCRIPCION
    filtros.push(`📋 ${desc}`)
  }

  if (filtrosStore.grupoReparticionActivo) {
    const desc =
      filtrosStore.grupoReparticionActivo.descripcion ||
      filtrosStore.grupoReparticionActivo.DESCRIPCION
    filtros.push(`🏢 ${desc}`)
  }

  return filtros
})

// Estadísticas de consultas disponibles
const consultasStats = computed(() => {
  const total = sqlExamples.value.length
  const conFiltros = sqlExamples.value.filter((q) => q.usaFiltros).length
  const sinFiltros = total - conFiltros
  const disponibles = sqlExamples.value.filter(
    (q) => !q.usaFiltros || (q.usaFiltros && filtrosStore.hayFiltrosActivos),
  ).length

  return {
    total,
    conFiltros,
    sinFiltros,
    disponibles,
    categorias: {
      basicas: sqlExamples.value.filter((q) => q.category === 'basicas').length,
      periodo: sqlExamples.value.filter((q) => q.category === 'periodo').length,
      analiticas: sqlExamples.value.filter((q) => q.category === 'analiticas').length,
      referencia: sqlExamples.value.filter((q) => q.category === 'referencia').length,
    },
  }
})

// Funciones helper para generar diferentes formatos de fecha
const generarFormatosPeriodo = () => {
  if (
    !filtrosStore.periodoActivo ||
    !filtrosStore.periodoActivo.mes ||
    !filtrosStore.periodoActivo.año
  ) {
    return {}
  }

  const año = filtrosStore.periodoActivo.año
  const mes = filtrosStore.periodoActivo.mes.toString().padStart(2, '0')

  return {
    // Formato TO_DATE para inicio del mes
    inicioMes: `TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY')`,

    // Formato TO_DATE para fin del mes
    finMes: `LAST_DAY(TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY'))`,

    // Formato periodo como string YYYYMM
    periodoString: `'${año}${mes}'`,

    // Formato año y mes separados
    año: año,
    mes: parseInt(mes),

    // Formato para comparaciones de rango
    rangoMes: {
      inicio: `TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY')`,
      fin: `LAST_DAY(TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY'))`,
    },
  }
}

/**
 * Función utilitaria para generar fechas en formato 01/MM/YYYY
 * @param {number} mes - Número del mes (1-12)
 * @param {number} año - Año (ej: 2025)
 * @returns {string} Fecha formateada como "01/MM/YYYY"
 */
const formatearFechaPrimerDia = (mes, año) => {
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
const generarFormatosFecha = (mes, año, opciones = {}) => {
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

// Consultas predefinidas organizadas por categorías
const sqlExamples = ref([
  // === CONSULTAS BÁSICAS ===
  {
    name: '📋 Liquidaciones (primeras 10)',
    category: 'basicas',
    description: 'Muestra las primeras 10 liquidaciones sin filtros',
    query: 'SELECT * FROM usuario.liquidacion WHERE rownum <= 10',
    usaFiltros: false,
  },
  {
    name: '🎯 Liquidaciones con filtros',
    category: 'basicas',
    description: 'Liquidaciones filtradas por período, tipo y/o grupo seleccionados',
    query: () => {
      const where = whereClause.value
      return `SELECT * FROM usuario.liquidacion${where ? ' ' + where : ''} ORDER BY FECHA_LIQUIDACION DESC${where ? '' : ' FETCH FIRST 20 ROWS ONLY'}`
    },
    usaFiltros: true,
  },

  // === CONSULTAS POR PERÍODO ===
  {
    name: '📅 Liquidaciones del mes actual',
    category: 'periodo',
    description: 'Todas las liquidaciones del período seleccionado',
    query: () => {
      const formatos = generarFormatosPeriodo()
      if (!formatos.inicioMes) return 'SELECT * FROM usuario.liquidacion WHERE rownum <= 20'
      return `SELECT legajo, apellido_nombres, importe_neto, fecha_liquidacion 
              FROM usuario.liquidacion 
              WHERE fecha_liquidacion BETWEEN ${formatos.rangoMes.inicio} AND ${formatos.rangoMes.fin}
              ORDER BY fecha_liquidacion DESC`
    },
    usaFiltros: true,
  },
  {
    name: '📊 Resumen mensual por tipo',
    category: 'periodo',
    description: 'Resumen de liquidaciones agrupadas por tipo en el período',
    query: () => {
      const formatos = generarFormatosPeriodo()
      const tipoCondition =
        filtrosSeleccionados.value.tipoLiquidacion && filtrosStore.tipoLiquidacionActivo
          ? `AND tipo_liquidacion = '${filtrosStore.tipoLiquidacionActivo.codigo || filtrosStore.tipoLiquidacionActivo}'`
          : ''

      if (!formatos.inicioMes)
        return 'SELECT tipo_liquidacion, COUNT(*) as cantidad FROM usuario.liquidacion GROUP BY tipo_liquidacion'

      return `SELECT tipo_liquidacion, 
                     COUNT(*) as cantidad,
                     SUM(importe_neto) as total_neto,
                     AVG(importe_neto) as promedio_neto
              FROM usuario.liquidacion 
              WHERE fecha_liquidacion BETWEEN ${formatos.rangoMes.inicio} AND ${formatos.rangoMes.fin}
              ${tipoCondition}
              GROUP BY tipo_liquidacion 
              ORDER BY cantidad DESC`
    },
    usaFiltros: true,
  },

  // === CONSULTAS ANALÍTICAS ===
  {
    name: '💰 Top 10 liquidaciones más altas',
    category: 'analiticas',
    description: 'Las 10 liquidaciones con mayor importe neto',
    query: () => {
      const where = whereClause.value
      return `SELECT legajo, apellido_nombres, importe_neto, fecha_liquidacion, tipo_liquidacion
              FROM usuario.liquidacion 
              ${where || 'WHERE 1=1'}
              ORDER BY importe_neto DESC 
              FETCH FIRST 10 ROWS ONLY`
    },
    usaFiltros: true,
  },
  {
    name: '📈 Estadísticas generales',
    category: 'analiticas',
    description: 'Estadísticas resumidas del período y filtros seleccionados',
    query: () => {
      const where = whereClause.value
      return `SELECT 
                COUNT(*) as total_liquidaciones,
                SUM(importe_neto) as suma_total,
                AVG(importe_neto) as promedio,
                MIN(importe_neto) as minimo,
                MAX(importe_neto) as maximo,
                COUNT(DISTINCT legajo) as empleados_liquidados
              FROM usuario.liquidacion 
              ${where || 'WHERE 1=1'}`
    },
    usaFiltros: true,
  },
  {
    name: '👥 Liquidaciones por grupo',
    category: 'analiticas',
    description: 'Resumen agrupado por grupo de repartición',
    query: () => {
      const where = whereClause.value
      return `SELECT grupo_reparticion, 
                     COUNT(*) as cantidad,
                     SUM(importe_neto) as total_grupo,
                     AVG(importe_neto) as promedio_grupo
              FROM usuario.liquidacion 
              ${where || 'WHERE 1=1'}
              GROUP BY grupo_reparticion 
              ORDER BY total_grupo DESC`
    },
    usaFiltros: true,
  },

  // === CONSULTAS DE REFERENCIA ===
  {
    name: '⚙️ Tipos de liquidación disponibles',
    category: 'referencia',
    description: 'Lista todos los tipos de liquidación del sistema',
    query: 'SELECT codigo, descripcion FROM usuario.tipo_liquidacion ORDER BY descripcion',
    usaFiltros: false,
  },
  {
    name: '🏢 Grupos de repartición',
    category: 'referencia',
    description: 'Lista todos los grupos de repartición disponibles',
    query: 'SELECT codigo, descripcion FROM usuario.grupo_reparticion ORDER BY descripcion',
    usaFiltros: false,
  },
  {
    name: '📅 Períodos disponibles',
    category: 'referencia',
    description: 'Muestra los períodos disponibles en el sistema',
    query: 'SELECT ano, mes, activo FROM usuario.periodo ORDER BY ano DESC, mes DESC',
    usaFiltros: false,
  },
])

const executeQueryHandler = async () => {
  if (!sqlQuery.value.trim()) {
    return
  }

  try {
    console.log('🔍 Ejecutando consulta SQL:', sqlQuery.value)
    console.log('🔗 URL de destino: /api/exec -> http://10.6.46.114:3013/exec')

    // Limpiar resultados anteriores
    queryColumns.value = []
    queryRows.value = []

    const result = await executeQuery(sqlQuery.value.trim())

    console.log('📥 Respuesta recibida del servidor:', result)

    if (result && Array.isArray(result) && result.length > 0) {
      // Extraer columnas del primer registro
      queryColumns.value = Object.keys(result[0])
      queryRows.value = result

      console.log('✅ Consulta SELECT ejecutada exitosamente:', {
        columns: queryColumns.value,
        rowCount: queryRows.value.length,
      })
    } else if (result && typeof result === 'object' && !Array.isArray(result)) {
      // Operación DDL/DML exitosa (CREATE, INSERT, UPDATE, DELETE)
      queryColumns.value = ['Resultado']
      queryRows.value = [
        {
          Resultado: result.message || result.success || 'Operación ejecutada exitosamente',
        },
      ]

      console.log('✅ Operación DDL/DML ejecutada exitosamente:', result)
    } else if (
      result === null ||
      result === undefined ||
      (Array.isArray(result) && result.length === 0)
    ) {
      // No hay datos pero la consulta fue exitosa
      queryColumns.value = ['Estado']
      queryRows.value = [{ Estado: 'Consulta ejecutada exitosamente - Sin resultados' }]
      console.log('✅ Consulta ejecutada sin resultados')
    } else {
      // Resultado inesperado
      queryColumns.value = ['Resultado']
      queryRows.value = [{ Resultado: JSON.stringify(result) }]
      console.log('✅ Consulta ejecutada con resultado inesperado:', result)
    }
  } catch (err) {
    console.error('❌ Error ejecutando consulta SQL:', err)
    console.error('❌ Detalles del error:', {
      message: err.message,
      status: err.status,
      statusText: err.statusText,
      response: err.response,
    })

    // Mostrar el error en la tabla para mejor debugging
    queryColumns.value = ['Error', 'Detalles']
    queryRows.value = [
      {
        Error: err.message || 'Error desconocido',
        Detalles: `Status: ${err.status || 'N/A'} - ${err.statusText || 'Sin descripción'}`,
      },
    ]
  }
}

const clearQuery = () => {
  sqlQuery.value = ''
  queryColumns.value = []
  queryRows.value = []
  ultimaConsultaConFiltros.value = null
}

// Ejecutar consulta aplicando automáticamente los filtros seleccionados
const ejecutarConFiltros = async () => {
  if (!sqlQuery.value.trim()) {
    return
  }

  // Construir la consulta con filtros automáticamente
  let consultaConFiltros = sqlQuery.value.trim()

  // Verificar si ya tiene WHERE
  const tieneWhere = /\bWHERE\b/i.test(consultaConFiltros)

  // Agregar filtros si están disponibles
  if (whereClause.value) {
    if (tieneWhere) {
      // Si ya tiene WHERE, agregar con AND
      consultaConFiltros = consultaConFiltros.replace(
        /\bWHERE\b/i,
        `WHERE ${whereClause.value.replace('WHERE ', '')} AND`,
      )
    } else {
      // Si no tiene WHERE, agregarlo al final
      consultaConFiltros += ` ${whereClause.value}`
    }
  }

  console.log('🎯 Ejecutando consulta con filtros aplicados:', {
    consultaOriginal: sqlQuery.value,
    consultaConFiltros: consultaConFiltros,
    filtrosAplicados: whereClause.value,
  })

  // Guardar información de la consulta
  ultimaConsultaConFiltros.value = {
    timestamp: new Date().toLocaleString(),
    consultaOriginal: sqlQuery.value.trim(),
    consultaFinal: consultaConFiltros,
    filtrosAplicados: whereClause.value || 'Sin filtros',
    tieneWhere: tieneWhere,
  }

  // Ejecutar la consulta modificada
  try {
    queryColumns.value = []
    queryRows.value = []

    const result = await executeQuery(consultaConFiltros)

    if (result && Array.isArray(result) && result.length > 0) {
      queryColumns.value = Object.keys(result[0])
      queryRows.value = result

      console.log('✅ Consulta con filtros ejecutada exitosamente:', {
        columns: queryColumns.value,
        rowCount: queryRows.value.length,
        filtrosUsados: whereClause.value,
      })
    } else if (result && typeof result === 'object' && !Array.isArray(result)) {
      queryColumns.value = ['Resultado', 'Filtros Aplicados']
      queryRows.value = [
        {
          Resultado: result.message || result.success || 'Operación ejecutada exitosamente',
          'Filtros Aplicados': whereClause.value || 'Sin filtros',
        },
      ]
    } else {
      queryColumns.value = ['Mensaje', 'Filtros Aplicados']
      queryRows.value = [
        {
          Mensaje: 'Consulta ejecutada sin resultados',
          'Filtros Aplicados': whereClause.value || 'Sin filtros',
        },
      ]
    }
  } catch (err) {
    console.error('❌ Error al ejecutar consulta con filtros:', err)

    queryColumns.value = ['Error', 'Consulta', 'Filtros']
    queryRows.value = [
      {
        Error: err.message || 'Error desconocido',
        Consulta: consultaConFiltros,
        Filtros: whereClause.value || 'Sin filtros',
      },
    ]
  }
}

const loadExample = (exampleQuery) => {
  // Si es una función, ejecutarla para obtener la query con filtros
  if (typeof exampleQuery === 'function') {
    const generatedQuery = exampleQuery()
    sqlQuery.value = generatedQuery

    // Mostrar información sobre los filtros aplicados
    if (filtrosStore.hayFiltrosActivos) {
      console.log('🎯 Consulta cargada con filtros activos:', {
        periodo: filtrosStore.periodoActivo,
        tipo: filtrosStore.tipoActivo,
        grupo: filtrosStore.grupoActivo,
        whereClause: whereClause.value,
      })
    }
  } else {
    sqlQuery.value = exampleQuery
    console.log('📋 Consulta básica cargada (sin filtros)')
  }
}

// Obtener información detallada de una consulta
const getQueryInfo = (query) => {
  const info = {
    usaFiltros: query.usaFiltros,
    disponible: !query.usaFiltros || filtrosStore.hayFiltrosActivos,
    requierePeriodo: query.category === 'periodo',
    esAnalitica: query.category === 'analiticas',
  }

  let tooltip = query.description

  if (query.usaFiltros) {
    tooltip += '\n\n🎯 Esta consulta usa filtros activos:'
    if (filtrosStore.periodoActivo) {
      tooltip += `\n📅 Período: ${filtrosStore.periodoActivo.mesNombre} ${filtrosStore.periodoActivo.año}`
    }
    if (filtrosStore.tipoLiquidacionActivo) {
      const desc =
        filtrosStore.tipoLiquidacionActivo.descripcion ||
        filtrosStore.tipoLiquidacionActivo.DESCRIPCION
      tooltip += `\n📋 Tipo: ${desc}`
    }
    if (filtrosStore.grupoReparticionActivo) {
      const desc =
        filtrosStore.grupoReparticionActivo.descripcion ||
        filtrosStore.grupoReparticionActivo.DESCRIPCION
      tooltip += `\n🏢 Grupo: ${desc}`
    }

    if (!filtrosStore.hayFiltrosActivos) {
      tooltip += '\n\n⚠️ Configure filtros para usar esta consulta'
    }
  }

  return { ...info, tooltip }
}

const insertWhereClause = () => {
  if (!whereClause.value) {
    return
  }

  // Insertar la cláusula WHERE al final del texto actual
  const currentQuery = sqlQuery.value.trim()
  if (currentQuery) {
    // Si ya hay texto, agregar la cláusula WHERE con un salto de línea
    sqlQuery.value = currentQuery + '\n' + whereClause.value
  } else {
    // Si no hay texto, solo agregar la cláusula WHERE
    sqlQuery.value = whereClause.value
  }
}

const testConnection = async () => {
  try {
    console.log('🔗 Probando conexión con el servidor...')
    console.log('🎯 Target: http://10.6.46.114:3013/exec')

    // Limpiar resultados anteriores
    queryColumns.value = []
    queryRows.value = []

    // Ejecutar una consulta simple para probar la conexión
    const result = await executeQuery('SELECT 1 as TEST_CONNECTION FROM DUAL')

    console.log('✅ Conexión exitosa!', result)

    queryColumns.value = ['Estado', 'Servidor', 'Respuesta']
    queryRows.value = [
      {
        Estado: '✅ Conexión exitosa',
        Servidor: 'http://10.6.46.114:3013',
        Respuesta: JSON.stringify(result),
      },
    ]
  } catch (err) {
    console.error('❌ Error de conexión:', err)

    queryColumns.value = ['Estado', 'Error', 'Servidor', 'Detalles']
    queryRows.value = [
      {
        Estado: '❌ Error de conexión',
        Error: err.message || 'Error desconocido',
        Servidor: 'http://10.6.46.114:3013',
        Detalles: `HTTP ${err.status || '500'}: ${err.statusText || 'Internal Server Error'}`,
      },
    ]
  }
}

// Mostrar/ocultar formatos de fecha
const mostrarFormatosFecha = () => {
  mostrarFormatos.value = !mostrarFormatos.value
}

// Copiar formato al portapapeles
const copiarFormato = async (formato) => {
  try {
    await navigator.clipboard.writeText(formato)
    console.log('✅ Formato copiado al portapapeles:', formato)
    // Opcional: mostrar notificación temporal
  } catch (err) {
    console.error('❌ Error al copiar al portapapeles:', err)
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = formato
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    console.log('✅ Formato copiado usando fallback:', formato)
  }
}

// Seleccionar/deseleccionar todos los filtros
const toggleTodosFiltros = () => {
  const algunoSeleccionado = Object.values(filtrosSeleccionados.value).some(Boolean)
  const nuevoValor = !algunoSeleccionado

  Object.keys(filtrosSeleccionados.value).forEach((key) => {
    filtrosSeleccionados.value[key] = nuevoValor
  })
}

// Verificar si hay filtros disponibles
const hayFiltrosDisponibles = computed(() => {
  return (
    (filtrosStore.periodoActivo &&
      filtrosStore.periodoActivo.mes &&
      filtrosStore.periodoActivo.año) ||
    filtrosStore.tipoLiquidacionActivo ||
    filtrosStore.grupoReparticionActivo
  )
})

// Funciones para aplicar filtros desde configuración rápida
const aplicarPeriodo = () => {
  const mesNombres = [
    '',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const periodo = {
    mes: parseInt(periodoTemp.value.mes),
    año: parseInt(periodoTemp.value.año),
    mesNombre: mesNombres[parseInt(periodoTemp.value.mes)],
  }

  filtrosStore.setPeriodo(periodo)
  console.log('✅ Período aplicado:', periodo)
}

const aplicarTipo = () => {
  const tipo = {
    codigo: tipoTemp.value.codigo.toUpperCase(),
    descripcion: tipoTemp.value.descripcion,
  }

  filtrosStore.setTipoLiquidacion(tipo)
  console.log('✅ Tipo aplicado:', tipo)
}

const aplicarGrupo = () => {
  const grupo = {
    codigo: grupoTemp.value.codigo.toUpperCase(),
    descripcion: grupoTemp.value.descripcion,
  }

  filtrosStore.setGrupoReparticion(grupo)
  console.log('✅ Grupo aplicado:', grupo)
}

/**
 * Función genérica para ejecutar consultas con filtros personalizados
 * @param {string} baseQuery - La consulta SQL base
 * @param {Object} camposFiltros - Mapeo de filtros a campos de BD
 * @param {Object} opciones - Opciones adicionales para la ejecución
 */
const ejecutarConsultaConFiltrosPersonalizados = async (
  baseQuery,
  camposFiltros = {},
  opciones = {},
) => {
  if (!baseQuery || !baseQuery.trim()) {
    console.error('❌ Se requiere una consulta base')
    return
  }

  const {
    // Campos de la base de datos para cada filtro
    campoPeriodo = 'FECHA_PERIODO', // Campo de fecha para período
    campoTipo = 'TIPO_LIQUIDACION', // Campo para tipo de liquidación
    campoGrupo = 'GRUPO_REPARTICION', // Campo para grupo de repartición
    // Opciones de formato
    formatoPeriodo = 'TO_DATE', // 'TO_DATE' o 'YYYYMM' o 'YYYY-MM-DD'
    operadorPeriodo = '>=', // Operador para comparación de período
    // Opciones de ejecución
    mostrarConsultaFinal = true, // Mostrar la consulta generada
    guardarHistorial = true, // Guardar en historial de consultas
  } = camposFiltros

  try {
    console.log('🔧 Generando consulta con filtros personalizados:', {
      baseQuery,
      camposFiltros,
      opciones,
    })

    let consultaFinal = baseQuery.trim()
    const condiciones = []
    const filtrosAplicados = []

    // === FILTRO DE PERÍODO ===
    if (
      filtrosSeleccionados.value.periodo &&
      filtrosStore.periodoActivo &&
      filtrosStore.periodoActivo.mes &&
      filtrosStore.periodoActivo.año
    ) {
      const año = filtrosStore.periodoActivo.año
      const mes = filtrosStore.periodoActivo.mes.toString().padStart(2, '0')

      let condicionPeriodo
      switch (formatoPeriodo) {
        case 'TO_DATE':
          condicionPeriodo = `${campoPeriodo} ${operadorPeriodo} TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY')`
          break
        case 'YYYYMM':
          condicionPeriodo = `${campoPeriodo} = '${año}${mes}'`
          break
        case 'YYYY-MM-DD':
          condicionPeriodo = `${campoPeriodo} ${operadorPeriodo} '${año}-${mes}-01'`
          break
        default:
          condicionPeriodo = `${campoPeriodo} ${operadorPeriodo} TO_DATE('01/${mes}/${año}', 'DD/MM/YYYY')`
      }

      condiciones.push(condicionPeriodo)
      filtrosAplicados.push(
        `📅 Período: ${filtrosStore.periodoActivo.mesNombre} ${año} (${campoPeriodo})`,
      )
    }

    // === FILTRO DE TIPO ===
    if (filtrosSeleccionados.value.tipoLiquidacion && filtrosStore.tipoLiquidacionActivo) {
      const tipoValor =
        filtrosStore.tipoLiquidacionActivo.codigo ||
        filtrosStore.tipoLiquidacionActivo.CODIGO ||
        filtrosStore.tipoLiquidacionActivo
      condiciones.push(`${campoTipo} = '${tipoValor}'`)

      const tipoDesc =
        filtrosStore.tipoLiquidacionActivo.descripcion ||
        filtrosStore.tipoLiquidacionActivo.DESCRIPCION ||
        tipoValor
      filtrosAplicados.push(`📋 Tipo: ${tipoDesc} (${campoTipo})`)
    }

    // === FILTRO DE GRUPO ===
    if (filtrosSeleccionados.value.grupoReparticion && filtrosStore.grupoReparticionActivo) {
      const grupoValor =
        filtrosStore.grupoReparticionActivo.codigo ||
        filtrosStore.grupoReparticionActivo.CODIGO ||
        filtrosStore.grupoReparticionActivo
      condiciones.push(`${campoGrupo} = '${grupoValor}'`)

      const grupoDesc =
        filtrosStore.grupoReparticionActivo.descripcion ||
        filtrosStore.grupoReparticionActivo.DESCRIPCION ||
        grupoValor
      filtrosAplicados.push(`🏢 Grupo: ${grupoDesc} (${campoGrupo})`)
    }

    // === CONSTRUIR CONSULTA FINAL ===
    if (condiciones.length > 0) {
      const clausulaWhere = condiciones.join(' AND ')
      const tieneWhere = /\bWHERE\b/i.test(consultaFinal)

      if (tieneWhere) {
        // Si ya tiene WHERE, agregar con AND
        consultaFinal = consultaFinal.replace(/\bWHERE\b/i, `WHERE (${clausulaWhere}) AND`)
      } else {
        // Si no tiene WHERE, agregarlo al final
        consultaFinal += ` WHERE ${clausulaWhere}`
      }
    }

    // === EJECUTAR CONSULTA ===
    if (mostrarConsultaFinal) {
      console.log('🎯 Consulta generada:', {
        original: baseQuery,
        final: consultaFinal,
        filtrosAplicados: filtrosAplicados,
        condiciones: condiciones,
      })
    }

    // Guardar información si está habilitado
    if (guardarHistorial) {
      ultimaConsultaConFiltros.value = {
        timestamp: new Date().toLocaleString(),
        consultaOriginal: baseQuery,
        consultaFinal: consultaFinal,
        filtrosAplicados: filtrosAplicados.join(', ') || 'Sin filtros',
        camposUsados: { campoPeriodo, campoTipo, campoGrupo },
        formatoPeriodo: formatoPeriodo,
      }
    }

    // Limpiar resultados anteriores
    queryColumns.value = []
    queryRows.value = []

    // Ejecutar la consulta
    const result = await executeQuery(consultaFinal)

    if (result && Array.isArray(result) && result.length > 0) {
      queryColumns.value = Object.keys(result[0])
      queryRows.value = result

      console.log('✅ Consulta personalizada ejecutada exitosamente:', {
        columns: queryColumns.value,
        rowCount: queryRows.value.length,
        filtrosUsados: filtrosAplicados,
      })
    } else if (result && typeof result === 'object' && !Array.isArray(result)) {
      queryColumns.value = ['Resultado', 'Filtros Aplicados', 'Campos Usados']
      queryRows.value = [
        {
          Resultado: result.message || result.success || 'Operación ejecutada exitosamente',
          'Filtros Aplicados': filtrosAplicados.join(', ') || 'Sin filtros',
          'Campos Usados': `Período: ${campoPeriodo}, Tipo: ${campoTipo}, Grupo: ${campoGrupo}`,
        },
      ]
    } else {
      queryColumns.value = ['Mensaje', 'Filtros Aplicados']
      queryRows.value = [
        {
          Mensaje: 'Consulta ejecutada sin resultados',
          'Filtros Aplicados': filtrosAplicados.join(', ') || 'Sin filtros',
        },
      ]
    }

    return {
      success: true,
      consultaFinal,
      filtrosAplicados,
      resultado: result,
    }
  } catch (err) {
    console.error('❌ Error al ejecutar consulta personalizada:', err)

    queryColumns.value = ['Error', 'Consulta', 'Filtros', 'Campos']
    queryRows.value = [
      {
        Error: err.message || 'Error desconocido',
        Consulta: consultaFinal || baseQuery,
        Filtros: filtrosAplicados.join(', ') || 'Sin filtros',
        Campos: `Período: ${campoPeriodo}, Tipo: ${campoTipo}, Grupo: ${campoGrupo}`,
      },
    ]

    return {
      success: false,
      error: err.message,
      consultaFinal: consultaFinal || baseQuery,
    }
  }
}

// === FUNCIONES DE CONVENIENCIA ===

/**
 * Ejecutar consulta con campos estándar de liquidaciones
 */
const ejecutarConsultaLiquidaciones = async (consulta) => {
  return await ejecutarConsultaConFiltrosPersonalizados(consulta, {
    campoPeriodo: 'FECHA_LIQUIDACION',
    campoTipo: 'TIPO_LIQUIDACION',
    campoGrupo: 'GRUPO_REPARTICION',
    formatoPeriodo: 'TO_DATE',
    operadorPeriodo: '>=',
  })
}

/**
 * Ejecutar consulta con campos de empleados
 */
const ejecutarConsultaEmpleados = async (consulta) => {
  return await ejecutarConsultaConFiltrosPersonalizados(consulta, {
    campoPeriodo: 'FECHA_INGRESO',
    campoTipo: 'CATEGORIA',
    campoGrupo: 'DEPENDENCIA',
    formatoPeriodo: 'TO_DATE',
    operadorPeriodo: '<=',
  })
}

/**
 * Ejecutar consulta con campos de nómina histórica
 */
const ejecutarConsultaNomina = async (consulta) => {
  return await ejecutarConsultaConFiltrosPersonalizados(consulta, {
    campoPeriodo: 'PERIODO',
    campoTipo: 'TIPO_NOMINA',
    campoGrupo: 'GRUPO',
    formatoPeriodo: 'YYYYMM',
    operadorPeriodo: '=',
  })
}

/**
 * Ejecutar consulta personalizada desde el editor
 */
const ejecutarConsultaPersonalizada = async () => {
  if (!sqlQuery.value.trim()) {
    return
  }

  // Usar la función genérica con campos estándar
  return await ejecutarConsultaLiquidaciones(sqlQuery.value)
}

// Exponer funciones en el contexto global para uso desde consola
if (typeof window !== 'undefined') {
  window.consultasAPI = {
    ejecutarConsultaConFiltrosPersonalizados,
    ejecutarConsultaLiquidaciones,
    ejecutarConsultaEmpleados,
    ejecutarConsultaNomina,
    ejecutarConsultaPersonalizada,
    // Funciones de fecha
    formatearFechaPrimerDia,
    generarFormatosFecha,
    generarFormatosPeriodo,
    // Funciones de depuración
    debug: {
      getFiltrosSeleccionados: () => filtrosSeleccionados.value,
      getFiltrosStore: () => ({
        periodoActivo: filtrosStore.periodoActivo,
        tipoLiquidacionActivo: filtrosStore.tipoLiquidacionActivo,
        grupoReparticionActivo: filtrosStore.grupoReparticionActivo,
        hayFiltrosActivos: filtrosStore.hayFiltrosActivos,
      }),
      getWhereClause: () => whereClause.value,
      setFiltrosPrueba: () => {
        // Establecer filtros de prueba con fecha actual
        filtrosStore.setPeriodo({ mes: 10, año: 2025, mesNombre: 'Octubre' })
        filtrosStore.setTipoLiquidacion({ codigo: 'HAB', descripcion: 'Haberes' })
        filtrosStore.setGrupoReparticion({ codigo: 'GRP1', descripcion: 'Grupo 1' })
        console.log('✅ Filtros de prueba establecidos')

        // También llenar los campos temporales
        periodoTemp.value = { mes: '10', año: '2025' }
        tipoTemp.value = { codigo: 'HAB', descripcion: 'Haberes' }
        grupoTemp.value = { codigo: 'GRP1', descripcion: 'Grupo 1' }
      },
      limpiarFiltros: () => {
        filtrosStore.limpiarTodos()
        console.log('🧹 Filtros limpiados')
      },
    },
  }
  console.log(
    '🔧 Funciones de consulta disponibles en window.consultasAPI:',
    Object.keys(window.consultasAPI),
  )
  console.log(
    '🔍 Funciones de debug disponibles en window.consultasAPI.debug:',
    Object.keys(window.consultasAPI.debug),
  )
}
</script>

<style scoped>
.consultas-view {
  padding: 1.5rem;
  max-width: 100%;
}

.consultas-view h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* Información de filtros activos */
.filtros-info {
  background: linear-gradient(135deg, #e3f2fd, #f8f9fa);
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.filtros-info h3 {
  margin: 0 0 1rem 0;
  color: #1976d2;
  font-size: 1rem;
}

.filtros-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filtro-badge {
  background-color: #1976d2;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.filtros-help {
  margin: 0;
  font-size: 0.875rem;
  color: #455a64;
  font-style: italic;
}

.sin-filtros-info {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.sin-filtros-text {
  margin: 0 0 1rem 0;
  color: #856404;
  font-size: 0.875rem;
}

/* Panel de configuración rápida de filtros */
.config-filtros-rapida {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.config-filtros-rapida h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 0.95rem;
}

.filtros-rapidos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filtro-grupo label {
  font-weight: 500;
  color: #495057;
  font-size: 0.875rem;
}

.filtro-controles {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.filtro-select,
.filtro-input {
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #495057;
  background-color: #fff;
  transition: border-color 0.2s ease;
}

.filtro-select {
  min-width: 120px;
}

.filtro-input {
  flex: 1;
  min-width: 100px;
}

.filtro-select:focus,
.filtro-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 0.2rem rgba(25, 118, 210, 0.25);
}

.btn-aplicar {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.btn-aplicar:hover:not(:disabled) {
  background-color: #218838;
}

.btn-aplicar:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filtro-controles {
    flex-direction: column;
    align-items: stretch;
  }

  .filtro-select,
  .filtro-input {
    width: 100%;
  }
}

/* Helper de filtros en el editor */
.filtros-helper {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.helper-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-where {
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.btn-where:hover:not(:disabled) {
  background-color: #138496;
}

.btn-where:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.where-preview {
  font-size: 0.875rem;
  color: #495057;
}

.where-preview code {
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', Consolas, monospace;
  color: #495057;
}

.filtros-count {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
  font-style: italic;
  font-size: 0.75rem;
}

/* Sección de depuración */
.debug-section {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
}

.debug-section details summary {
  cursor: pointer;
  font-weight: 500;
  color: #856404;
  font-size: 0.875rem;
}

.debug-content {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.debug-content strong {
  color: #856404;
  display: block;
  margin: 0.5rem 0 0.25rem 0;
}

.debug-content pre {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 0.75rem;
  color: #495057;
  margin: 0.25rem 0 0.5rem 0;
}

.debug-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-debug {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s ease;
}

.btn-debug:hover {
  background-color: #5a6268;
}

.btn-debug.btn-danger {
  background-color: #dc3545;
}

.btn-debug.btn-danger:hover {
  background-color: #c82333;
}

/* Estilos para formatos de fecha */
.formatos-fecha {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.formatos-fecha h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: #495057;
}

.formato-item {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.formato-item strong {
  font-size: 0.875rem;
  color: #343a40;
}

.formato-code {
  background-color: #e9ecef;
  padding: 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', Consolas, monospace;
  color: #495057;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid transparent;
  word-break: break-all;
}

.formato-code:hover {
  background-color: #dfe4ea;
  border-color: #6c757d;
}

/* Estilos para consulta ejecutada con filtros */
.consulta-ejecutada {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e8f5e8;
  border-radius: 6px;
  border: 1px solid #c3e6cb;
}

.consulta-ejecutada h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: #155724;
}

.consulta-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item strong {
  font-size: 0.875rem;
  color: #155724;
}

.info-item span {
  font-size: 0.875rem;
  color: #495057;
}

.info-item code {
  background-color: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', Consolas, monospace;
  color: #495057;
  font-size: 0.8rem;
}

.consulta-final {
  max-height: 100px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Estilos para ayuda de función genérica */
.helper-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.btn-help-toggle {
  background: none;
  border: none;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0;
  width: 100%;
  text-align: left;
  transition: color 0.2s ease;
}

.btn-help-toggle:hover {
  color: #007bff;
}

.ayuda-generica {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.ayuda-generica h4 {
  margin: 0 0 0.75rem 0;
  color: #495057;
  font-size: 0.95rem;
}

.ayuda-generica p {
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 0.875rem;
}

.ejemplo-codigo {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.ejemplo-codigo strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #495057;
}

.ejemplo-codigo code {
  display: block;
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', Consolas, monospace;
  color: #495057;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.formatos-disponibles {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.formatos-disponibles strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
}

.formatos-disponibles ul {
  margin: 0;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.formatos-disponibles li {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.formatos-disponibles li code {
  background-color: #f8f9fa;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: 'Courier New', Consolas, monospace;
  color: #495057;
  font-size: 0.8rem;
}

/* Estilos para selector de filtros */
.filtros-selector {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.filtros-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.filtros-selector h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #495057;
}

.btn-toggle-filtros {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-toggle-filtros:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-toggle-filtros:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filtros-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filtro-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.filtro-checkbox:hover {
  background-color: #f8f9fa;
}

.filtro-checkbox input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.filtro-checkbox input[type='checkbox']:checked + .checkbox-label {
  color: #2c3e50;
  font-weight: 500;
}

/* Responsivo para selector de filtros */
@media (max-width: 768px) {
  .filtros-selector-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .btn-toggle-filtros {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.85rem;
  }
}

.btn-formatos {
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.btn-formatos:hover {
  background-color: #138496;
}

.btn-formatos:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-execute-filters {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-execute-filters:hover:not(:disabled) {
  background-color: #218838;
}

.btn-execute-filters:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-execute-custom {
  background-color: #6f42c1;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-execute-custom:hover:not(:disabled) {
  background-color: #5a359a;
}

.btn-execute-custom:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sql-query-section {
  margin-bottom: 2rem;
}

.query-editor {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.editor-header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3 {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-clear,
.btn-execute,
.btn-test {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-test {
  background-color: #17a2b8;
  color: white;
}

.btn-test:hover:not(:disabled) {
  background-color: #138496;
}

.btn-clear {
  background-color: #6c757d;
  color: white;
}

.btn-clear:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-execute {
  background-color: #28a745;
  color: white;
}

.btn-execute:hover:not(:disabled) {
  background-color: #218838;
}

.btn-clear:disabled,
.btn-execute:disabled,
.btn-test:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.editor-container {
  padding: 1rem;
}

.sql-textarea {
  width: 100%;
  min-height: 200px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  background-color: #f8f9fa;
  color: #495057;
  transition: border-color 0.2s ease;
}

.sql-textarea:focus {
  outline: none;
  border-color: #1976d2;
  background-color: white;
}

.sql-textarea::placeholder {
  color: #6c757d;
  font-style: italic;
}

.sql-textarea:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.query-examples {
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.query-examples h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 0.9rem;
}

.examples-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.consultas-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #495057;
  font-weight: 500;
}

.examples-help {
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  font-size: 0.85rem;
  font-style: italic;
}

.no-filters-warning {
  color: #dc3545;
  font-weight: 500;
}

/* Categorías de ejemplos */
.examples-category {
  margin-bottom: 1.5rem;
}

.examples-category h5 {
  margin: 0 0 0.75rem 0;
  color: #343a40;
  font-size: 0.875rem;
  font-weight: 600;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e9ecef;
}

.examples-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example-btn {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d2;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.example-btn.with-filters {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.example-btn.with-filters:hover:not(:disabled) {
  background-color: #ffc107;
  color: #212529;
}

.example-btn:hover:not(:disabled) {
  background-color: #1976d2;
  color: white;
}

.example-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filter-indicator {
  font-size: 0.7rem;
  font-weight: bold;
}

.results-section {
  margin-top: 2rem;
}

.results-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .consultas-view {
    padding: 1rem;
  }

  .consultas-view h1 {
    font-size: 1.5rem;
  }

  .editor-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .editor-actions {
    justify-content: center;
  }

  .examples-header {
    flex-direction: column;
    align-items: stretch;
  }

  .consultas-stats {
    justify-content: center;
  }

  .sql-textarea {
    min-height: 150px;
    font-size: 0.8rem;
  }

  .examples-grid {
    justify-content: center;
  }

  .example-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .editor-actions {
    flex-direction: column;
  }

  .examples-grid {
    flex-direction: column;
  }

  .example-btn {
    text-align: center;
  }
}
</style>
