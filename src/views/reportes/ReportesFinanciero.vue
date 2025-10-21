<template>
  <div class="reportes-financiero">
    <div class="page-header">
      <h1>💳 Reportes Financieros</h1>
      <p class="page-description">Análisis financiero, balances, ingresos y gastos del sistema</p>
    </div>

    <div class="content-grid">
      <div class="report-section">
        <ReporteSimple
          titulo="Estado Financiero"
          :variables="variablesFinanciero"
          selection-mode="single"
          :show-checkboxes="false"
          @seleccion-cambio="manejarSeleccionFinanciero"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReporteSimple from '@/components/ReporteSimple.vue'

// Variables para el reporte financiero
const variablesFinanciero = ref([
  { nombre: 'periodo', tipo: 'text', valor: '2024-Q1', label: 'Período' },
  { nombre: 'tipo_movimiento', tipo: 'text', valor: '', label: 'Tipo Movimiento' },
  { nombre: 'monto_minimo', tipo: 'number', valor: 0, label: 'Monto Mínimo' },
])

// Función para manejar selección
const manejarSeleccionFinanciero = (seleccion) => {
  console.log('💰 Movimiento financiero seleccionado:', seleccion)
}
</script>

<style scoped>
.reportes-financiero {
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
