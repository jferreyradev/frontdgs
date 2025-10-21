<template>
  <div class="filtros-container">
    <!-- Grupo Sicore -->
    <div class="filtro-campo">
      <ComboSimple
        label="Grupo Sicore"
        placeholder="Seleccione grupo SICORE"
        v-model="grupoSeleccionado"
        api-method="getGruposSicore"
        store-name="gruposSicore"
        value-key="IDGRUPOSICORE"
        label-key="DESCRIPCION"
        @update:model-value="onGrupoSicoreChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ComboSimple from '@/components/ComboSimple.vue'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'
import { useCombo } from '@/composables/useCombo.js'

const store = useFiltrosActivosStore()

console.log('🚀 Inicializando FiltrosSicore...')

// Usar composable para cargar grupos
const { items: grupos, loading, error, buscarPor } = useCombo('gruposSicore', 'getGruposSicore')

// Función auxiliar para buscar por ID
const buscarPorId = (id) => buscarPor('IDGRUPOSICORE', id)

onMounted(() => {
  console.log('🎬 FiltrosSicore montado')
  console.log('📊 Estado inicial grupos:', grupos.value)
  console.log('⏳ Estado inicial loading:', loading.value)
  console.log('❌ Estado inicial error:', error.value)
})

// Debug - ver qué está pasando
watch(
  grupos,
  (newGrupos) => {
    console.log('🔍 Grupos SICORE cargados:', newGrupos)
  },
  { immediate: true },
)

watch(
  loading,
  (isLoading) => {
    console.log('⏳ Loading SICORE:', isLoading)
  },
  { immediate: true },
)

watch(
  error,
  (errorMsg) => {
    if (errorMsg) console.error('❌ Error SICORE:', errorMsg)
  },
  { immediate: true },
)

// Estado local sincronizado con el store
const grupoSeleccionado = ref('')

// Sincronizar con el store global
watch(
  () => store.grupoSicoreActivo,
  (nuevoGrupo) => {
    grupoSeleccionado.value = nuevoGrupo?.IDGRUPOSICORE || ''
  },
  { immediate: true },
)

function onGrupoSicoreChange(value) {
  console.log('🔄 Cambio detectado en grupo SICORE, valor:', value)

  if (!value) {
    console.log('🧹 Limpiando grupo SICORE')
    store.setGrupoSicore(null)
    return
  }

  const grupo = buscarPorId(value)
  console.log('🎯 Grupo SICORE encontrado:', grupo)
  console.log('📝 Total grupos disponibles:', grupos.value.length)

  if (grupo) {
    store.setGrupoSicore(grupo)
    console.log('✅ Grupo SICORE establecido en store')
  } else {
    console.error('❌ No se encontró el grupo SICORE con ID:', value)
  }
}
</script>

<style scoped>
.panel-filtros {
  margin: 10px 0;
}

.filtros-container {
  display: flex;
  gap: 10px;
  align-items: end;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.filtro-campo {
  flex: 1;
  min-width: 150px;
  padding: 5px 0;
}

.filtro-label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.filtro-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 13px;
  background-color: white;
}

.btn-limpiar {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  height: 34px;
}

.btn-limpiar:hover {
  background-color: #c82333;
}
</style>
