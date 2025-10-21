<template>
  <div class="reportes-inventario">
    <div class="page-header">
      <h1>📦 Reportes de Inventario</h1>
      <p class="page-description">
        Control y análisis de stock, productos y movimientos de inventario
      </p>
    </div>

    <div class="content-grid">
      <div class="report-section">
        <ReporteSimple
          titulo="Estado del Inventario"
          :variables="variablesInventario"
          selection-mode="multiple"
          :show-checkboxes="true"
          @seleccion-cambio="manejarSeleccionInventario"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReporteSimple from '@/components/ReporteSimple.vue'

// Variables para el reporte de inventario
const variablesInventario = ref([
  { nombre: 'categoria', tipo: 'text', valor: '', label: 'Categoría' },
  { nombre: 'stock_minimo', tipo: 'number', valor: 10, label: 'Stock Mínimo' },
  { nombre: 'almacen_id', tipo: 'number', valor: null, label: 'ID Almacén' },
])

// Función para manejar selección múltiple
const manejarSeleccionInventario = (seleccion) => {
  console.log('📦 Productos seleccionados:', seleccion)
}
</script>

<style scoped>
.reportes-inventario {
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
