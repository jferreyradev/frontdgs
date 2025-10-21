<template>
  <div class="reportes-ventas">
    <div class="page-header">
      <h1>📊 Reportes de Ventas</h1>
      <p class="page-description">Análisis detallado de ventas, ingresos y rendimiento comercial</p>
    </div>

    <!-- Filtros adicionales -->
    <div class="filtros-adicionales">
      <h3>🎯 Filtros Específicos de Ventas</h3>
      <div class="filtros-grid">
        <!-- Ejemplo con ComboSimple -->
        <ComboSimple
          label="Vendedor"
          placeholder="Seleccione un vendedor"
          v-model="vendedorSeleccionado"
          api-method="getUsuarios"
          store-name="vendedores"
          value-key="id"
          label-key="nombre"
        />

        <!-- Ejemplo con ComboAvanzado -->
        <ComboAvanzado
          label="Departamento"
          placeholder="Buscar departamento..."
          v-model="departamentoSeleccionado"
          api-method="getDepartamentos"
          store-name="departamentos"
          searchable
          :required="false"
          help-text="Filtre por departamento para análisis específico"
          :validator="validarDepartamento"
          @select="onDepartamentoSeleccionado"
        />

        <!-- Combo dependiente -->
        <ComboSimple
          label="Provincia"
          placeholder="Seleccione provincia"
          v-model="provinciaSeleccionada"
          api-method="getProvincias"
          store-name="provincias"
          @update:model-value="onProvinciaChange"
        />
      </div>
    </div>

    <div class="content-grid">
      <div class="report-section">
        <ReporteSimple
          titulo="Ventas por Período"
          :variables="variablesVentas"
          selection-mode="single"
          :show-checkboxes="false"
          @seleccion-cambio="manejarSeleccionVentas"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReporteSimple from '@/components/ReporteSimple.vue'
import ComboSimple from '@/components/ComboSimple.vue'
import ComboAvanzado from '@/components/ComboAvanzado.vue'

// Estados de los filtros
const vendedorSeleccionado = ref('')
const departamentoSeleccionado = ref('')
const provinciaSeleccionada = ref('')

// Variables para el reporte de ventas
const variablesVentas = ref([
  { nombre: 'fecha_inicio', tipo: 'date', valor: '2024-01-01', label: 'Fecha Inicio' },
  { nombre: 'fecha_fin', tipo: 'date', valor: '2024-12-31', label: 'Fecha Fin' },
  { nombre: 'vendedor_id', tipo: 'number', valor: null, label: 'ID Vendedor' },
])

// Funciones de manejo
const manejarSeleccionVentas = (seleccion) => {
  console.log('🛒 Venta seleccionada:', seleccion)
}

const validarDepartamento = (valor, item) => {
  if (valor && item && !item.activo) {
    return 'Este departamento no está activo'
  }
  return true
}

const onDepartamentoSeleccionado = (departamento) => {
  console.log('🏢 Departamento seleccionado:', departamento)
}

const onProvinciaChange = (provinciaId) => {
  console.log('📍 Provincia seleccionada:', provinciaId)
  // Aquí podrías cargar ciudades dependientes
}
</script>

<style scoped>
.reportes-ventas {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  margin: 0;
}

.filtros-adicionales {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.filtros-adicionales h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.content-grid {
  display: grid;
  gap: 1.5rem;
}

.report-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
