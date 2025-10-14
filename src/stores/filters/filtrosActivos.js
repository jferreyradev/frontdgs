import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFiltrosActivosStore = defineStore('filtrosActivos', () => {
  // Estados básicos
  const periodoActivo = ref(null)
  const tipoLiquidacionActivo = ref(null)
  const grupoReparticionActivo = ref(null)

  // Computados básicos
  const hayFiltrosActivos = computed(() => {
    const periodoValido = periodoActivo.value && periodoActivo.value.mes && periodoActivo.value.año
    return !!periodoValido || !!tipoLiquidacionActivo.value || !!grupoReparticionActivo.value
  })

  const contadorFiltros = computed(() => {
    let contador = 0
    // Solo contar período si tiene mes Y año
    if (periodoActivo.value && periodoActivo.value.mes && periodoActivo.value.año) {
      contador++
    }
    if (tipoLiquidacionActivo.value) contador++
    if (grupoReparticionActivo.value) contador++
    console.log('📊 contadorFiltros calculado:', contador, {
      periodo: periodoActivo.value,
      tipo: tipoLiquidacionActivo.value,
      grupo: grupoReparticionActivo.value,
    })
    return contador
  })

  // Funciones básicas para establecer filtros
  function setPeriodo(periodo) {
    periodoActivo.value = periodo
  }

  function setTipoLiquidacion(tipo) {
    tipoLiquidacionActivo.value = tipo
  }

  function setGrupoReparticion(grupo) {
    grupoReparticionActivo.value = grupo
  }

  // Función para limpiar todo
  function limpiarTodos() {
    console.log('🧹 Limpiando todos los filtros')
    periodoActivo.value = null
    tipoLiquidacionActivo.value = null
    grupoReparticionActivo.value = null
    console.log('🧹 Filtros limpiados. Contador:', contadorFiltros.value)
  }

  return {
    // Estados
    periodoActivo,
    tipoLiquidacionActivo,
    grupoReparticionActivo,

    // Computados
    hayFiltrosActivos,
    contadorFiltros,

    // Funciones
    setPeriodo,
    setTipoLiquidacion,
    setGrupoReparticion,
    limpiarTodos,
  }
})
