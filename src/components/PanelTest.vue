<script setup>
import { useDgsApi } from '@/composables/api/useDgsApi.js'
import PanelFiltros from './filters/PanelFiltros.vue'
import { onMounted, ref } from 'vue'

const { verificarConexion, getPeriodoActivo } = useDgsApi()

const data = ref(null)
const periodo = ref(null)
const panelFiltrosRef = ref(null)

async function carga() {
  data.value = await verificarConexion()
  periodo.value = await getPeriodoActivo()
}

onMounted(() => {
  carga()
})

// Manejar eventos del panel de filtros
function onFiltrosAplicados(filtros) {
  console.log('Filtros aplicados desde PanelTest:', filtros)
  // Aquí puedes agregar lógica adicional cuando se apliquen los filtros
}

function onFiltrosCambiados(filtros) {
  console.log('Filtros cambiados:', filtros)
  // Aquí puedes agregar lógica adicional cuando cambien los filtros
}

// Función para obtener filtros actuales (para uso externo)
function obtenerFiltrosActuales() {
  return panelFiltrosRef.value ? panelFiltrosRef.value.obtenerFiltros() : null
}

// Exponer métodos públicos
defineExpose({
  obtenerFiltrosActuales,
})
</script>

<template>
  <div class="panel-test">
    <h2 class="titulo">Panel de Control</h2>

    <!-- Componente de Filtros -->
    <PanelFiltros
      ref="panelFiltrosRef"
      :auto-cargar="true"
      @filtros-aplicados="onFiltrosAplicados"
      @filtros-cambiados="onFiltrosCambiados"
    />

    <!-- Sección de información de conexión (opcional) -->
    <div v-if="data || periodo" class="info-sistema">
      <h3>Información del Sistema</h3>

      <div v-if="data" class="info-conexion">
        <h4>Estado de Conexión</h4>
        <pre class="info-data">{{ data }}</pre>
      </div>

      <div v-if="periodo" class="info-periodo">
        <h4>Períodos Activos</h4>
        <pre class="info-data">{{ periodo }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-test {
  padding: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.titulo {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.info-sistema {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
}

.info-sistema h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #495057;
}

.info-conexion,
.info-periodo {
  margin-bottom: 15px;
}

.info-conexion:last-child,
.info-periodo:last-child {
  margin-bottom: 0;
}

.info-conexion h4,
.info-periodo h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #6c757d;
}

.info-data {
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 3px;
  padding: 8px;
  margin: 0;
  font-size: 12px;
  color: #495057;
  overflow-x: auto;
}
</style>
