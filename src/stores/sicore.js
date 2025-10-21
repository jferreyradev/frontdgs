import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useDgsApi } from '@/composables/api/useDgsApi.js'

export const useSicoreStore = defineStore('sicore', () => {
  // Estado reactivo
  const grupos = ref([])
  const grupoSeleccionado = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Instancia del composable API
  const { getGruposSicore } = useDgsApi()

  // Getters computados
  const gruposActivos = computed(() => grupos.value.filter((grupo) => grupo.activo !== false))

  const hasGrupos = computed(() => grupos.value.length > 0)

  const gruposPorNombre = computed(() => {
    return grupos.value
      .slice()
      .sort((a, b) => (a.DESCRIPCION || '').localeCompare(b.DESCRIPCION || ''))
  })

  const informacionGrupoSeleccionado = computed(() => {
    if (!grupoSeleccionado.value) return null

    return {
      id: grupoSeleccionado.value.IDGRUPOSICORE,
      descripcion: grupoSeleccionado.value.DESCRIPCION,
      codigo: grupoSeleccionado.value.CODIGO,
      activo: grupoSeleccionado.value.ACTIVO,
      fechaCreacion: grupoSeleccionado.value.FECHA_CREACION,
      usuarioCreacion: grupoSeleccionado.value.USUARIO_CREACION,
    }
  })

  // Acciones
  async function cargarGrupos() {
    try {
      loading.value = true
      error.value = null

      console.log('🔄 Cargando grupos SICORE...')
      const resultado = await getGruposSicore()
      grupos.value = resultado || []

      console.log(`✅ ${grupos.value.length} grupos SICORE cargados`)
    } catch (err) {
      error.value = err.message || 'Error al cargar grupos SICORE'
      console.error('❌ Error en cargarGrupos SICORE:', err)
    } finally {
      loading.value = false
    }
  }

  function seleccionarGrupo(grupo) {
    console.log('🎯 Seleccionando grupo SICORE:', grupo)
    grupoSeleccionado.value = grupo
  }

  function limpiarSeleccion() {
    console.log('🧹 Limpiando selección SICORE')
    grupoSeleccionado.value = null
  }

  function buscarGrupoPorId(id) {
    return grupos.value.find((grupo) => grupo.IDGRUPOSICORE == id)
  }

  function buscarGrupoPorCodigo(codigo) {
    return grupos.value.find(
      (grupo) => grupo.CODIGO && grupo.CODIGO.toLowerCase() === codigo.toLowerCase(),
    )
  }

  // Funciones de utilidad
  function obtenerEstadisticas() {
    return {
      total: grupos.value.length,
      activos: gruposActivos.value.length,
      inactivos: grupos.value.length - gruposActivos.value.length,
      conSeleccion: !!grupoSeleccionado.value,
    }
  }

  // Función para refrescar datos
  async function refrescar() {
    await cargarGrupos()
  }

  // Función para validar si un grupo existe
  function existeGrupo(id) {
    return grupos.value.some((grupo) => grupo.IDGRUPOSICORE == id)
  }

  return {
    // Estados
    grupos,
    grupoSeleccionado,
    loading,
    error,

    // Computados
    gruposActivos,
    hasGrupos,
    gruposPorNombre,
    informacionGrupoSeleccionado,

    // Acciones
    cargarGrupos,
    seleccionarGrupo,
    limpiarSeleccion,
    buscarGrupoPorId,
    buscarGrupoPorCodigo,
    obtenerEstadisticas,
    refrescar,
    existeGrupo,
  }
})
