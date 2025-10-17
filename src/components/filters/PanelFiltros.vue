<template>
  <div class="panel-filtros">
    <div class="filtros-container">
      <!-- Período -->
      <div class="filtro-campo">
        <label class="filtro-label">Período</label>
        <SelectorMesAño ref="selectorMesAñoRef" @cambio="onMesAñoCambiado" />
      </div>

      <!-- Tipo de Liquidación -->
      <div class="filtro-campo">
        <label class="filtro-label">Tipo</label>
        <select
          :value="store.tipoLiquidacionActivo?.IDTIPOLIQUIDACION || ''"
          @change="onTipoChange($event.target.value)"
          class="filtro-select"
        >
          <option value="">Seleccione tipo</option>
          <option
            v-for="tipo in tipos"
            :key="tipo.IDTIPOLIQUIDACION"
            :value="tipo.IDTIPOLIQUIDACION"
          >
            {{ tipo.DESCRIPCION }}
          </option>
        </select>
      </div>

      <!-- Grupo de Repartición -->
      <div class="filtro-campo">
        <label class="filtro-label">Grupo</label>
        <select
          :value="store.grupoReparticionActivo?.IDGRUPO || ''"
          @change="onGrupoChange($event.target.value)"
          class="filtro-select"
        >
          <option value="">Seleccione grupo</option>
          <option v-for="grupo in grupos" :key="grupo.IDGRUPO" :value="grupo.IDGRUPO">
            {{ grupo.DESCRIPCION }}
          </option>
        </select>
      </div>

      <!-- Botón limpiar -->
      <div class="filtro-campo">
        <button @click="limpiarTodos" class="btn-limpiar">Limpiar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import SelectorMesAño from './SelectorMesAño.vue'
import { useDgsApi } from '@/composables/api/useDgsApi.js'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'

const { getTiposLiquidacion, getGruposReparticion } = useDgsApi()
const store = useFiltrosActivosStore()

const tipos = ref([])
const grupos = ref([])
const selectorMesAñoRef = ref(null)

// Cargar datos básicos
async function cargarDatos() {
  try {
    tipos.value = await getTiposLiquidacion()
    grupos.value = await getGruposReparticion()
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
}

// Funciones de cambio
function onMesAñoCambiado(seleccion) {
  console.log('📅 onMesAñoCambiado recibió:', seleccion)
  // Solo establecer el período si tiene mes y año válidos
  if (seleccion && seleccion.mes && seleccion.año) {
    store.setPeriodo(seleccion)
  } else {
    store.setPeriodo(null)
  }
  console.log('📅 Período en store después del cambio:', store.periodoActivo)
}

function onTipoChange(value) {
  const tipo = tipos.value.find((t) => t.IDTIPOLIQUIDACION == value)
  store.setTipoLiquidacion(tipo)
}

function onGrupoChange(value) {
  const grupo = grupos.value.find((g) => g.IDGRUPO == value)
  store.setGrupoReparticion(grupo)
}

function limpiarTodos() {
  console.log('🧹 Botón limpiar presionado en PanelFiltros')
  store.limpiarTodos()
  // También limpiar el selector de mes/año
  if (selectorMesAñoRef.value) {
    selectorMesAñoRef.value.limpiarSeleccion()
  }
}

onMounted(() => {
  cargarDatos()
})

// Watch para sincronizar cuando se limpian los filtros desde otro componente
watch(
  () => store.hayFiltrosActivos,
  (tieneFiltos, teniaFiltrosAntes) => {
    // Si antes tenía filtros y ahora no tiene, significa que se limpiaron
    if (teniaFiltrosAntes && !tieneFiltos) {
      if (selectorMesAñoRef.value) {
        selectorMesAñoRef.value.limpiarSeleccion()
      }
    }
  },
)
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
