import { onMounted } from 'vue'
import { usePeriodoStore } from '@/stores/periodo.js'

/**
 * Composable para asegurar que el período activo esté inicializado
 * Se puede usar en componentes que dependan del período activo
 */
export function usePeriodoActivo() {
  const periodoStore = usePeriodoStore()

  // Función para asegurar que el período esté cargado
  async function asegurarPeriodoActivo() {
    if (!periodoStore.hasPeriodos && !periodoStore.loading) {
      console.log('Períodos no cargados, inicializando...')
      await periodoStore.inicializarPeriodoActivo()
    }
    return periodoStore.periodoSeleccionado
  }

  // Auto-inicializar al montar el composable
  onMounted(async () => {
    await asegurarPeriodoActivo()
  })

  return {
    // Estado del store
    periodoStore,
    periodos: periodoStore.periodos,
    periodoSeleccionado: periodoStore.periodoSeleccionado,
    mesSeleccionado: periodoStore.mesSeleccionado,
    añoSeleccionado: periodoStore.añoSeleccionado,
    loading: periodoStore.loading,
    error: periodoStore.error,
    hasPeriodos: periodoStore.hasPeriodos,
    fechaActual: periodoStore.fechaActual,

    // Funciones útiles
    asegurarPeriodoActivo,
    formatearPeriodo: periodoStore.formatearPeriodo,
    establecerMesAño: periodoStore.establecerMesAño,
  }
}
