import { ref, reactive, computed } from 'vue'
import { useCombo } from '@/composables/useCombo.js'

/**
 * Composable para manejar filtros dinámicos
 * Permite agregar/remover combos en tiempo de ejecución
 */
export function useFiltrosDinamicos() {
  // Estado reactivo
  const combosRegistrados = ref(new Map())
  const valoresSeleccionados = reactive({})
  const combosData = reactive({})

  /**
   * Registrar un nuevo combo
   */
  function registrarCombo(config) {
    const {
      id,
      storeName,
      apiMethod,
      label,
      placeholder,
      valueKey = 'id',
      labelKey = 'nombre',
      storeProperty = null,
      storeMethod = null,
      enabled = true,
    } = config

    // Validar configuración
    if (!id || !storeName || !apiMethod) {
      throw new Error('Configuración de combo incompleta: id, storeName y apiMethod son requeridos')
    }

    // Registrar configuración
    combosRegistrados.value.set(id, {
      id,
      storeName,
      apiMethod,
      label: label || id,
      placeholder: placeholder || `Seleccione ${label || id}`,
      valueKey,
      labelKey,
      storeProperty,
      storeMethod,
      enabled,
    })

    // Inicializar datos del combo
    const { items, buscarPor } = useCombo(storeName, apiMethod)
    combosData[id] = {
      items,
      buscarPor: (value) => buscarPor(valueKey, value),
    }

    // Inicializar valor seleccionado
    valoresSeleccionados[id] = ''

    console.log(`✅ Combo registrado: ${id}`)
    return id
  }

  /**
   * Desregistrar un combo
   */
  function desregistrarCombo(id) {
    if (!combosRegistrados.value.has(id)) {
      console.warn(`⚠️ Combo ${id} no encontrado`)
      return false
    }

    combosRegistrados.value.delete(id)
    delete combosData[id]
    delete valoresSeleccionados[id]

    console.log(`🗑️ Combo desregistrado: ${id}`)
    return true
  }

  /**
   * Habilitar/deshabilitar combo
   */
  function toggleCombo(id, enabled = null) {
    const combo = combosRegistrados.value.get(id)
    if (!combo) {
      console.warn(`⚠️ Combo ${id} no encontrado`)
      return false
    }

    combo.enabled = enabled !== null ? enabled : !combo.enabled
    console.log(`🔄 Combo ${id} ${combo.enabled ? 'habilitado' : 'deshabilitado'}`)
    return combo.enabled
  }

  /**
   * Obtener configuración de un combo
   */
  function obtenerCombo(id) {
    return combosRegistrados.value.get(id) || null
  }

  /**
   * Limpiar todos los valores seleccionados
   */
  function limpiarSelecciones() {
    Object.keys(valoresSeleccionados).forEach((id) => {
      valoresSeleccionados[id] = ''
    })
    console.log('🧹 Selecciones limpiadas')
  }

  /**
   * Obtener valor seleccionado de un combo
   */
  function obtenerValorSeleccionado(id) {
    const comboConfig = combosRegistrados.value.get(id)
    const valor = valoresSeleccionados[id]

    if (!valor || !comboConfig) return null

    return combosData[id]?.buscarPor(valor) || null
  }

  /**
   * Establecer valor seleccionado
   */
  function establecerValor(id, valor) {
    if (combosRegistrados.value.has(id)) {
      valoresSeleccionados[id] = valor
      return true
    }
    return false
  }

  // Computadas
  const combosActivos = computed(() => {
    return Array.from(combosRegistrados.value.values()).filter((combo) => combo.enabled)
  })

  const todosLosCombos = computed(() => {
    return Array.from(combosRegistrados.value.values())
  })

  const estadisticas = computed(() => {
    const total = combosRegistrados.value.size
    const activos = combosActivos.value.length
    const inactivos = total - activos
    const conDatos = Object.keys(valoresSeleccionados).filter(
      (id) => valoresSeleccionados[id],
    ).length

    return { total, activos, inactivos, conDatos }
  })

  return {
    // Estado
    combosRegistrados,
    valoresSeleccionados,
    combosData,

    // Computadas
    combosActivos,
    todosLosCombos,
    estadisticas,

    // Métodos
    registrarCombo,
    desregistrarCombo,
    toggleCombo,
    obtenerCombo,
    limpiarSelecciones,
    obtenerValorSeleccionado,
    establecerValor,
  }
}
