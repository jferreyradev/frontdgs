<template>
  <div class="data-table-container">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Ejecutando consulta...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h4>❌ Error en la consulta</h4>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="columns.length === 0" class="empty-state">
      <h4>🔍 Sin resultados</h4>
      <p>Ejecuta una consulta SQL para ver los resultados aquí</p>
    </div>

    <div v-else class="table-wrapper">
      <div class="table-info">
        <span class="row-count"
          >📊 {{ rows.length }} registro{{ rows.length !== 1 ? 's' : '' }}</span
        >
        <div class="export-buttons">
          <button @click="exportarCSV" class="btn-export btn-csv">📄 CSV</button>
          <button @click="exportarExcel" class="btn-export btn-excel">� Excel</button>
          <button @click="exportarJSON" class="btn-export btn-json">📋 JSON</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column" class="table-header">
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index" class="table-row">
              <td v-for="column in columns" :key="column" class="table-cell">
                {{ formatCellValue(row[column]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { exportCSV, exportJSON, exportExcel } from '@/utils/exportTable.js'

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  titulo: {
    type: String,
    default: 'consulta',
  },
})

const formatCellValue = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

// Funciones de exportación usando las utilidades existentes
const generarNombreArchivo = (extension) => {
  const nombre = props.titulo.toLowerCase().replace(/\s+/g, '_')
  const fecha = new Date().toISOString().split('T')[0]
  return `${nombre}_${fecha}.${extension}`
}

const exportarCSV = () => {
  if (props.columns.length === 0 || props.rows.length === 0) {
    return
  }
  const nombreArchivo = generarNombreArchivo('csv')
  exportCSV(props.columns, props.rows, nombreArchivo)
}

const exportarExcel = () => {
  if (props.columns.length === 0 || props.rows.length === 0) {
    return
  }
  const nombreArchivo = generarNombreArchivo('xls')
  exportExcel(props.columns, props.rows, nombreArchivo)
}

const exportarJSON = () => {
  if (props.columns.length === 0 || props.rows.length === 0) {
    return
  }
  const nombreArchivo = generarNombreArchivo('json')
  exportJSON(props.rows, nombreArchivo)
}
</script>

<style scoped>
.data-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.loading-state,
.error-state,
.empty-state {
  padding: 3rem;
  text-align: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-state {
  color: #dc3545;
}

.error-state h4 {
  margin: 0 0 1rem 0;
}

.empty-state {
  color: #6c757d;
}

.empty-state h4 {
  margin: 0 0 1rem 0;
}

.table-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.row-count {
  font-weight: 600;
  color: #495057;
}

.export-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-export {
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: white;
}

.btn-csv {
  background-color: #28a745;
}

.btn-csv:hover {
  background-color: #218838;
}

.btn-excel {
  background-color: #17a2b8;
}

.btn-excel:hover {
  background-color: #138496;
}

.btn-json {
  background-color: #6f42c1;
}

.btn-json:hover {
  background-color: #5a32a3;
}

.table-scroll {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 60vh;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table-header {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-row:nth-child(even) {
  background-color: #fdfdfd;
}

.table-cell {
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-cell:hover {
  white-space: normal;
  word-wrap: break-word;
}

/* Responsive */
@media (max-width: 768px) {
  .table-info {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .export-buttons {
    justify-content: center;
  }

  .btn-export {
    flex: 1;
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .table-scroll {
    max-height: 50vh;
  }

  .table-header,
  .table-cell {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .table-cell {
    max-width: 150px;
  }
}
</style>
