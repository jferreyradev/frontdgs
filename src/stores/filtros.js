import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFiltrosStore = defineStore('filtros', () => {
  const periodoActivo = ref(null)
  const tipoLiqActivo = ref(null)
  const grupoLiqActivo = ref(null)

  function setPeriodo(newPeriodo) {
    periodoActivo.value = newPeriodo
  }
  function setTipos(newTipos) {
    tipoLiqActivo.value = newTipos
  }

  function setGrupos(newGrupos) {
    grupoLiqActivo.value = newGrupos
  }

  return { periodoActivo, setPeriodo, tipoLiqActivo, setTipos, grupoLiqActivo, setGrupos }
})
