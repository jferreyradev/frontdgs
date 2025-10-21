import { ref, computed, onMounted } from 'vue'
import { useDgsApi } from '@/composables/api/useDgsApi.js'

/**
 * Composable genérico para manejar combos con API
 * Uso simple: const { items, loading, error } = useCombo('usuarios', 'getUsuarios')
 */
export function useCombo(storeName, apiMethod, options = {}) {
  // Estados básicos
  const items = ref([])
  const selectedItem = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Opciones por defecto
  const config = {
    autoLoad: true,
    valueKey: 'id',
    labelKey: 'nombre',
    ...options,
  }

  // API
  const api = useDgsApi()

  // Computadas
  const hasItems = computed(() => items.value.length > 0)

  const itemsOrdenados = computed(() => {
    return items.value
      .slice()
      .sort((a, b) => (a[config.labelKey] || '').localeCompare(b[config.labelKey] || ''))
  })

  // Acciones
  async function cargar() {
    try {
      loading.value = true
      error.value = null

      console.log(`🔄 Cargando ${storeName}...`)

      if (!api[apiMethod]) {
        throw new Error(`Método ${apiMethod} no existe en la API`)
      }

      const resultado = await api[apiMethod]()
      items.value = resultado || []

      console.log(`✅ ${items.value.length} ${storeName} cargados`)
    } catch (err) {
      error.value = err.message || `Error al cargar ${storeName}`
      console.error(`❌ Error cargando ${storeName}:`, err)
    } finally {
      loading.value = false
    }
  }

  function seleccionar(item) {
    selectedItem.value = item
  }

  function limpiar() {
    selectedItem.value = null
  }

  function buscarPor(key, value) {
    return items.value.find((item) => item[key] == value)
  }

  // Auto-cargar si está habilitado
  if (config.autoLoad) {
    onMounted(() => cargar())
  }

  return {
    // Estados
    items,
    selectedItem,
    loading,
    error,

    // Computadas
    hasItems,
    itemsOrdenados,

    // Acciones
    cargar,
    seleccionar,
    limpiar,
    buscarPor,

    // Configuración
    config,
  }
}

/**
 * Composable específico para combos de filtros
 */
export function useComboFiltro(storeName, apiMethod, filtrosStore, setterMethod) {
  const combo = useCombo(storeName, apiMethod)

  function aplicarFiltro(value) {
    const item = combo.buscarPor(combo.config.valueKey, value)
    combo.seleccionar(item)

    if (filtrosStore && setterMethod) {
      filtrosStore[setterMethod](item)
    }
  }

  return {
    ...combo,
    aplicarFiltro,
  }
}
