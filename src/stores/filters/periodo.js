import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useDgsApi } from '@/composables/api/useDgsApi.js'

export const usePeriodoStore = defineStore('periodo', () => {
  // Estado reactivo
  const periodos = ref([])
  const periodoSeleccionado = ref(null)
  const mesSeleccionado = ref(null)
  const añoSeleccionado = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Instancia del composable API
  const { getPeriodoActivo } = useDgsApi()

  // Getters computados
  const periodosActivos = computed(() =>
    periodos.value.filter((periodo) => periodo.activo === true),
  )

  const periodosPorMesAño = computed(() => {
    if (!mesSeleccionado.value || !añoSeleccionado.value) return []

    return periodos.value.filter((periodo) => {
      if (!periodo.fecha) return false

      const fecha = new Date(periodo.fecha)
      const mesPeriodo = fecha.getMonth() + 1
      const añoPeriodo = fecha.getFullYear()

      return (
        mesPeriodo === parseInt(mesSeleccionado.value) &&
        añoPeriodo === parseInt(añoSeleccionado.value)
      )
    })
  })

  const hasPeriodos = computed(() => periodos.value.length > 0)

  const fechaActual = computed(() => {
    if (!mesSeleccionado.value || !añoSeleccionado.value) return null

    return {
      mes: parseInt(mesSeleccionado.value),
      año: parseInt(añoSeleccionado.value),
      fechaInicio: `01/${mesSeleccionado.value.toString().padStart(2, '0')}/${añoSeleccionado.value}`,
      fechaFin: obtenerUltimoDiaMes(
        parseInt(mesSeleccionado.value),
        parseInt(añoSeleccionado.value),
      ),
      fechaInicioISO: `${añoSeleccionado.value}-${mesSeleccionado.value.toString().padStart(2, '0')}-01T00:00:00.000Z`,
      fechaFinISO: obtenerUltimoDiaMesISO(
        parseInt(mesSeleccionado.value),
        parseInt(añoSeleccionado.value),
      ),
    }
  })

  // Acciones
  async function cargarPeriodos() {
    try {
      loading.value = true
      error.value = null

      const resultado = await getPeriodoActivo()
      periodos.value = resultado || []

      // Establecer automáticamente el período activo
      if (periodos.value.length > 0) {
        establecerPeriodoActivo()
      }
    } catch (err) {
      error.value = err.message || 'Error al cargar períodos'
      console.error('Error en cargarPeriodos:', err)
    } finally {
      loading.value = false
    }
  }

  // Nueva función para establecer automáticamente el período activo
  function establecerPeriodoActivo() {
    if (periodos.value.length === 0) return

    // Buscar el período actual (que coincida con el mes/año actual)
    const hoy = new Date()
    const mesActual = hoy.getMonth() + 1
    const añoActual = hoy.getFullYear()

    // Buscar período que coincida con la fecha actual
    let periodoActual = periodos.value.find((periodo) => {
      const fechaPeriodo = periodo.fecha || periodo.PERIODO
      if (!fechaPeriodo) return false

      const fecha = new Date(fechaPeriodo)
      const mesPeriodo = fecha.getMonth() + 1
      const añoPeriodo = fecha.getFullYear()

      return mesPeriodo === mesActual && añoPeriodo === añoActual
    })

    // Si no hay período para el mes actual, tomar el primer período disponible
    if (!periodoActual) {
      periodoActual = periodos.value[0]
      console.log(
        'No se encontró período para el mes actual, usando el primer período disponible:',
        periodoActual,
      )
    }

    // Establecer el período seleccionado
    periodoSeleccionado.value = periodoActual

    // Extraer mes y año del período seleccionado
    if (periodoActual && (periodoActual.fecha || periodoActual.PERIODO)) {
      extraerMesAñoDePeriodo(periodoActual)
    } else {
      // Si el período no tiene fecha, establecer el mes/año actual
      mesSeleccionado.value = mesActual
      añoSeleccionado.value = añoActual
    }

    console.log('Período activo establecido:', {
      periodo: periodoActual,
      mes: mesSeleccionado.value,
      año: añoSeleccionado.value,
    })
  }

  function establecerMesAño(mes, año) {
    mesSeleccionado.value = mes
    añoSeleccionado.value = año

    // Buscar período que coincida con este mes/año
    const periodoEncontrado = periodos.value.find((periodo) => {
      if (!periodo.fecha && !periodo.PERIODO) return false

      const fechaPeriodo = periodo.fecha || periodo.PERIODO
      const fecha = new Date(fechaPeriodo)
      const mesPeriodo = fecha.getMonth() + 1
      const añoPeriodo = fecha.getFullYear()

      return mesPeriodo === parseInt(mes) && añoPeriodo === parseInt(año)
    })

    if (periodoEncontrado) {
      periodoSeleccionado.value = periodoEncontrado
    } else {
      periodoSeleccionado.value = null
    }
  }

  function establecerPeriodo(periodo) {
    periodoSeleccionado.value = periodo

    // Extraer mes y año del período
    if (periodo && (periodo.fecha || periodo.PERIODO)) {
      extraerMesAñoDePeriodo(periodo)
    }
  }

  function extraerMesAñoDePeriodo(periodo) {
    try {
      const fechaPeriodo = periodo.fecha || periodo.PERIODO
      const fecha = new Date(fechaPeriodo)

      if (!isNaN(fecha.getTime())) {
        mesSeleccionado.value = fecha.getMonth() + 1
        añoSeleccionado.value = fecha.getFullYear()
      }
    } catch (error) {
      console.warn('Error al extraer fecha del período:', error)
    }
  }

  function limpiarSeleccion() {
    mesSeleccionado.value = null
    añoSeleccionado.value = null
    periodoSeleccionado.value = null
  }

  function establecerHoy() {
    const hoy = new Date()
    establecerMesAño(hoy.getMonth() + 1, hoy.getFullYear())
  }

  // Funciones auxiliares
  function obtenerUltimoDiaMes(mes, año) {
    const ultimoDia = new Date(año, mes, 0).getDate()
    return `${ultimoDia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`
  }

  function obtenerUltimoDiaMesISO(mes, año) {
    const ultimoDia = new Date(año, mes, 0).getDate()
    return `${año}-${mes.toString().padStart(2, '0')}-${ultimoDia.toString().padStart(2, '0')}T23:59:59.999Z`
  }

  function getPeriodoPorId(id) {
    return periodos.value.find((periodo) => periodo.id === id || periodo.IDPERIODO === id)
  }

  function formatearPeriodo(periodo) {
    if (!periodo) return ''

    const codigo = periodo.codigo || periodo.CODIGO || periodo.PERIODO
    const descripcion = periodo.descripcion || periodo.DESCRIPCION || periodo.nombre

    return `${codigo}${descripcion ? ' - ' + descripcion : ''}`
  }

  // Función para sincronizar con el selector de mes/año externo
  function sincronizarConSelector(datosSelector) {
    if (datosSelector.mes && datosSelector.año) {
      establecerMesAño(datosSelector.mes, datosSelector.año)
    }
  }

  // Función para inicializar automáticamente al cargar la app
  async function inicializarPeriodoActivo() {
    try {
      console.log('Inicializando período activo...')
      await cargarPeriodos()
      return true
    } catch (error) {
      console.error('Error al inicializar período activo:', error)
      return false
    }
  }

  return {
    // Estado
    periodos,
    periodoSeleccionado,
    mesSeleccionado,
    añoSeleccionado,
    loading,
    error,

    // Getters computados
    periodosActivos,
    periodosPorMesAño,
    hasPeriodos,
    fechaActual,

    // Acciones
    cargarPeriodos,
    establecerMesAño,
    establecerPeriodo,
    limpiarSeleccion,
    establecerHoy,
    getPeriodoPorId,
    formatearPeriodo,
    sincronizarConSelector,
    establecerPeriodoActivo,
    inicializarPeriodoActivo,
  }
})
