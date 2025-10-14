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
        <button @click="exportToCSV" class="btn-export">📥 Exportar CSV</button>
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

const exportToCSV = () => {
  if (props.columns.length === 0 || props.rows.length === 0) {
    return
  }

  // Crear CSV content
  const csvContent = [
    // Headers
    props.columns.join(','),
    // Rows
    ...props.rows.map((row) =>
      props.columns
        .map((column) => {
          const value = row[column]
          // Escapar comillas y envolver en comillas si contiene comas
          const stringValue = formatCellValue(value)
          return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue
        })
        .join(','),
    ),
  ].join('\n')

  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `consulta_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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

.btn-export {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.btn-export:hover {
  background-color: #218838;
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
