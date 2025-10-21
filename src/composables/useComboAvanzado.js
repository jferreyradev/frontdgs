import { ref, computed, onMounted } from 'vue'
import { useDgsApi } from '@/composables/api/useDgsApi.js'

/**
 * 🚀 Composable avanzado para combos con cache, retry y búsqueda
 */
export function useCombo(storeName, apiMethod, options = {}) {
  // ✨ Configuración extendida
  const config = {
    autoLoad: true,
    valueKey: 'id',
    labelKey: 'nombre',
    cacheTime: 5 * 60 * 1000, // 5 minutos
    retryAttempts: 3,
    retryDelay: 1000,
    searchFields: ['nombre', 'descripcion'],
    caseSensitive: false,
    ...options,
  }

  // 📊 Estados mejorados
  const items = ref([])
  const selectedItem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)
  const initialized = ref(false)
  const retryCount = ref(0)

  // 🔌 API
  const api = useDgsApi()

  // 💡 Computadas avanzadas
  const hasItems = computed(() => items.value.length > 0)

  const isEmpty = computed(() => !hasItems.value && !loading.value && initialized.value)

  const needsRefresh = computed(() => {
    if (!lastFetch.value) return true
    return Date.now() - lastFetch.value > config.cacheTime
  })

  const itemsOrdenados = computed(() => {
    return items.value.slice().sort((a, b) => {
      const aValue = a[config.labelKey] || ''
      const bValue = b[config.labelKey] || ''
      return aValue.localeCompare(bValue, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    })
  })

  const opcionesSelect = computed(() => [
    {
      [config.valueKey]: '',
      [config.labelKey]: `Seleccionar ${storeName}...`,
      disabled: true,
    },
    ...itemsOrdenados.value.map((item) => ({
      [config.valueKey]: item[config.valueKey],
      [config.labelKey]: item[config.labelKey],
      ...item,
    })),
  ])

  const estadisticas = computed(() => ({
    total: items.value.length,
    cacheValido: !needsRefresh.value,
    ultimaActualizacion: lastFetch.value,
    tiempoCache: config.cacheTime,
    reintentos: retryCount.value,
    inicializado: initialized.value,
  }))

  // 🔄 Funciones principales mejoradas
  async function cargar(force = false) {
    // Cache inteligente
    if (!force && !needsRefresh.value && hasItems.value) {
      console.log(`🚀 Cache hit para ${storeName}`)
      return items.value
    }

    // Reset retry counter
    retryCount.value = 0

    while (retryCount.value < config.retryAttempts) {
      try {
        loading.value = true
        error.value = null

        console.log(
          `🔄 Cargando ${storeName}... (intento ${retryCount.value + 1}/${config.retryAttempts})`,
        )

        // Validar método API
        if (!api[apiMethod]) {
          throw new Error(`Método ${apiMethod} no existe en la API`)
        }

        // Ejecutar petición
        const resultado = await api[apiMethod]()

        // Validar resultado
        if (!Array.isArray(resultado)) {
          throw new Error('La respuesta de la API no es un array válido')
        }

        // Actualizar estado
        items.value = resultado
        lastFetch.value = Date.now()
        initialized.value = true

        console.log(`✅ ${items.value.length} ${storeName} cargados exitosamente`)
        return items.value
      } catch (err) {
        retryCount.value++
        const isLastAttempt = retryCount.value >= config.retryAttempts

        console.warn(`⚠️ Error cargando ${storeName} (intento ${retryCount.value}):`, err.message)

        if (isLastAttempt) {
          error.value = err.message || `Error al cargar ${storeName}`
          console.error(`❌ Error final cargando ${storeName}:`, err)
          throw err
        } else {
          // Esperar antes del siguiente intento (backoff exponencial)
          const delay = config.retryDelay * Math.pow(2, retryCount.value - 1)
          console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      } finally {
        if (retryCount.value >= config.retryAttempts || !error.value) {
          loading.value = false
        }
      }
    }
  }

  // 🔍 Búsqueda avanzada
  function buscar(termino, campos = config.searchFields) {
    if (!termino || typeof termino !== 'string') {
      return items.value
    }

    const terminoNormalizado = config.caseSensitive ? termino.trim() : termino.trim().toLowerCase()

    if (!terminoNormalizado) {
      return items.value
    }

    return items.value.filter((item) => {
      return campos.some((campo) => {
        const valorCampo = item[campo]
        if (valorCampo === null || valorCampo === undefined) return false

        const valorNormalizado = config.caseSensitive
          ? String(valorCampo)
          : String(valorCampo).toLowerCase()

        return valorNormalizado.includes(terminoNormalizado)
      })
    })
  }

  // 🎯 Búsquedas específicas optimizadas
  function buscarPorId(id) {
    if (id === null || id === undefined) return null
    return items.value.find((item) => item[config.valueKey] == id)
  }

  function buscarPorCampo(campo, valor) {
    if (valor === null || valor === undefined) return null
    return items.value.find((item) => item[campo] == valor)
  }

  function buscarMultiples(ids) {
    if (!Array.isArray(ids)) return []
    return items.value.filter((item) => ids.includes(item[config.valueKey]))
  }

  // 🎮 Selección mejorada
  function seleccionar(item) {
    if (!item) {
      selectedItem.value = null
      return
    }

    selectedItem.value = item
    console.log(`🎯 ${storeName} seleccionado:`, item[config.labelKey])

    // Emitir evento personalizado
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(`combo:${storeName}:selected`, {
          detail: { item, storeName },
        }),
      )
    }
  }

  function seleccionarPorId(id) {
    const item = buscarPorId(id)
    if (item) {
      seleccionar(item)
      return item
    }
    console.warn(`⚠️ No se encontró ${storeName} con ID: ${id}`)
    return null
  }

  function limpiarSeleccion() {
    console.log(`🧹 Limpiando selección de ${storeName}`)
    selectedItem.value = null
  }

  // 🛠️ Utilidades
  function refrescar() {
    console.log(`🔄 Refrescando ${storeName}...`)
    return cargar(true)
  }

  function existe(id) {
    return items.value.some((item) => item[config.valueKey] == id)
  }

  function obtenerValores(campo = config.valueKey) {
    return items.value.map((item) => item[campo])
  }

  function agruparPor(campo) {
    return items.value.reduce((grupos, item) => {
      const clave = item[campo]
      if (!grupos[clave]) {
        grupos[clave] = []
      }
      grupos[clave].push(item)
      return grupos
    }, {})
  }

  // 🔄 Reset completo
  function reset() {
    items.value = []
    selectedItem.value = null
    error.value = null
    lastFetch.value = null
    initialized.value = false
    loading.value = false
    retryCount.value = 0
  }

  // 📊 Validaciones
  function validar() {
    const errores = []

    if (!storeName) errores.push('storeName es requerido')
    if (!apiMethod) errores.push('apiMethod es requerido')
    if (!config.valueKey) errores.push('valueKey es requerido')
    if (!config.labelKey) errores.push('labelKey es requerido')

    return {
      valido: errores.length === 0,
      errores,
    }
  }

  // 🚀 Auto-inicialización
  if (config.autoLoad) {
    onMounted(async () => {
      const { valido, errores } = validar()
      if (!valido) {
        console.error(`❌ Configuración inválida para ${storeName}:`, errores)
        return
      }

      try {
        await cargar()
      } catch (err) {
        console.error(`❌ Error en auto-inicialización de ${storeName}:`, err)
      }
    })
  }

  return {
    // 📊 Estados
    items,
    selectedItem,
    loading,
    error,
    initialized,
    config,

    // 💡 Computadas
    hasItems,
    isEmpty,
    needsRefresh,
    itemsOrdenados,
    opcionesSelect,
    estadisticas,

    // 🔄 Acciones principales
    cargar,
    refrescar,
    reset,

    // 🔍 Búsqueda
    buscar,
    buscarPorId,
    buscarPorCampo,
    buscarMultiples,

    // 🎮 Selección
    seleccionar,
    seleccionarPorId,
    limpiarSeleccion,

    // 🛠️ Utilidades
    existe,
    obtenerValores,
    agruparPor,
    validar,
  }
}

/**
 * 🎯 Composable específico para filtros
 */
export function useComboFiltro(storeName, apiMethod, filtrosStore, setterMethod, options = {}) {
  const combo = useCombo(storeName, apiMethod, options)

  function aplicarFiltro(value) {
    const item = combo.buscarPorId(value)
    combo.seleccionar(item)

    if (filtrosStore && setterMethod && typeof filtrosStore[setterMethod] === 'function') {
      filtrosStore[setterMethod](item)
    }

    console.log(`🔧 Filtro ${storeName} aplicado:`, item?.[combo.config.labelKey] || 'Ninguno')
  }

  function limpiarFiltro() {
    combo.limpiarSeleccion()

    if (filtrosStore && setterMethod && typeof filtrosStore[setterMethod] === 'function') {
      filtrosStore[setterMethod](null)
    }

    console.log(`🧹 Filtro ${storeName} limpiado`)
  }

  return {
    ...combo,
    aplicarFiltro,
    limpiarFiltro,
  }
}

/**
 * 🔗 Composable para combos dependientes
 */
export function useComboDependiente(storeName, apiMethod, dependeDe, options = {}) {
  const combo = useCombo(storeName, apiMethod, {
    ...options,
    autoLoad: false,
  })

  async function cargarDependiente(valorPadre) {
    if (!valorPadre) {
      combo.reset()
      return
    }

    try {
      // Aquí puedes customizar la lógica de dependencia
      await combo.cargar(true)
    } catch (err) {
      console.error(`❌ Error cargando combo dependiente ${storeName}:`, err)
    }
  }

  return {
    ...combo,
    cargarDependiente,
  }
}
