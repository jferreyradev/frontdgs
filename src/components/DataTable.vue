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
        <div class="info-left">
          <span class="row-count">
            📊 {{ rows.length }} registro{{ rows.length !== 1 ? 's' : '' }}
          </span>
          <span v-if="filasSeleccionadas.size > 0" class="selection-info">
            ({{ filasSeleccionadas.size }} seleccionado{{
              filasSeleccionadas.size !== 1 ? 's' : ''
            }})
          </span>
        </div>
        <div class="export-buttons">
          <button
            v-if="filasSeleccionadas.size > 0"
            @click="limpiarSeleccion"
            class="btn-export btn-clear"
            title="Limpiar selección"
          >
            🗑️ Limpiar
          </button>
          <button @click="exportarCSV" class="btn-export btn-csv">📄 CSV</button>
          <button @click="exportarExcel" class="btn-export btn-excel">📊 Excel</button>
          <button @click="exportarJSON" class="btn-export btn-json">📋 JSON</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th
                v-if="showCheckboxes && selectionMode !== 'none'"
                class="table-header checkbox-header"
              >
                <input
                  v-if="selectionMode === 'multiple'"
                  type="checkbox"
                  :checked="todasSeleccionadas"
                  :indeterminate="algunasSeleccionadas"
                  @change="seleccionarTodo"
                  class="select-all-checkbox"
                  title="Seleccionar todas las filas"
                />
              </th>
              <th v-for="column in columns" :key="column" class="table-header">
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in rows"
              :key="index"
              class="table-row"
              :class="{
                selected: filasSeleccionadas.has(index),
                active: filaSeleccionadaActiva === index,
                clickable: selectionMode !== 'none',
              }"
              @click="selectionMode !== 'none' ? seleccionarFila(index, $event) : null"
              @mouseenter="filaSeleccionadaActiva = index"
              @mouseleave="filaSeleccionadaActiva = null"
            >
              <td
                v-if="showCheckboxes && selectionMode !== 'none'"
                class="table-cell checkbox-cell"
              >
                <input
                  v-if="selectionMode === 'multiple'"
                  type="checkbox"
                  :checked="filasSeleccionadas.has(index)"
                  @change="toggleFilaSeleccion(index)"
                  @click.stop
                  class="row-checkbox"
                />
                <span
                  v-else-if="selectionMode === 'single'"
                  class="radio-indicator"
                  :class="{ selected: filasSeleccionadas.has(index) }"
                ></span>
              </td>
              <td
                v-for="column in columns"
                :key="column"
                class="table-cell"
                @click="handleClickRow(row)"
              >
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
import { ref, computed } from 'vue'
import { exportCSV, exportJSON, exportExcel } from '@/utils/exportTable.js'

// Estado para manejar la selección
const filasSeleccionadas = ref(new Set())
const filaSeleccionadaActiva = ref(null)

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
  selectionMode: {
    type: String,
    default: 'multiple',
    validator: (value) => ['none', 'single', 'multiple'].includes(value),
  },
  showCheckboxes: {
    type: Boolean,
    default: true,
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

// Funciones de selección
const seleccionarFila = (index, event) => {
  if (props.selectionMode === 'none') return

  if (props.selectionMode === 'single') {
    // Selección única
    filasSeleccionadas.value.clear()
    filasSeleccionadas.value.add(index)
  } else if (props.selectionMode === 'multiple') {
    if (event.ctrlKey || event.metaKey) {
      // Selección múltiple (Ctrl/Cmd + click)
      if (filasSeleccionadas.value.has(index)) {
        filasSeleccionadas.value.delete(index)
      } else {
        filasSeleccionadas.value.add(index)
      }
    } else if (event.shiftKey && ultimaFilaSeleccionada.value !== null) {
      // Selección en rango (Shift + click)
      seleccionarRango(ultimaFilaSeleccionada.value, index)
    } else {
      // Selección simple
      filasSeleccionadas.value.clear()
      filasSeleccionadas.value.add(index)
    }
  }

  ultimaFilaSeleccionada.value = index
  emitirSeleccion()
}

const ultimaFilaSeleccionada = ref(null)

const seleccionarRango = (inicio, fin) => {
  const min = Math.min(inicio, fin)
  const max = Math.max(inicio, fin)

  filasSeleccionadas.value.clear()
  for (let i = min; i <= max; i++) {
    filasSeleccionadas.value.add(i)
  }
}

const seleccionarTodo = () => {
  if (filasSeleccionadas.value.size === props.rows.length) {
    filasSeleccionadas.value.clear()
  } else {
    filasSeleccionadas.value.clear()
    props.rows.forEach((_, index) => {
      filasSeleccionadas.value.add(index)
    })
  }
  emitirSeleccion()
}

const limpiarSeleccion = () => {
  filasSeleccionadas.value.clear()
  ultimaFilaSeleccionada.value = null
  filaSeleccionadaActiva.value = null
  emitirSeleccion()
}

const handleClickRow = (row) => {
  //event.stopPropagation()
  console.log('Fila clickeada', row.ID_EJEC_CAB)
}

// Computadas para la selección
const todasSeleccionadas = computed(
  () =>
    props.selectionMode === 'multiple' &&
    props.rows.length > 0 &&
    filasSeleccionadas.value.size === props.rows.length,
)

const algunasSeleccionadas = computed(
  () =>
    props.selectionMode === 'multiple' &&
    filasSeleccionadas.value.size > 0 &&
    filasSeleccionadas.value.size < props.rows.length,
)

const filasSeleccionadasData = computed(() =>
  Array.from(filasSeleccionadas.value).map((index) => props.rows[index]),
)

// Emits
const emit = defineEmits(['seleccion-cambio'])

const emitirSeleccion = () => {
  emit('seleccion-cambio', {
    indices: Array.from(filasSeleccionadas.value),
    datos: filasSeleccionadasData.value,
    cantidad: filasSeleccionadas.value.size,
  })
}

const toggleFilaSeleccion = (index) => {
  if (props.selectionMode === 'single') {
    filasSeleccionadas.value.clear()
    filasSeleccionadas.value.add(index)
  } else if (props.selectionMode === 'multiple') {
    if (filasSeleccionadas.value.has(index)) {
      filasSeleccionadas.value.delete(index)
    } else {
      filasSeleccionadas.value.add(index)
    }
  }
  ultimaFilaSeleccionada.value = index
  emitirSeleccion()
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
  background: rgb(209, 209, 209);
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

.info-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selection-info {
  color: #007bff;
  font-weight: 500;
  font-size: 0.9rem;
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

.btn-clear {
  background-color: #dc3545;
  margin-right: 0.5rem;
}

.btn-clear:hover {
  background-color: #c82333;
}

.table-scroll {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 60vh;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.table-header {
  background-color: #75baff;
  color: #ffffff;
  font-weight: 600;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
}

.checkbox-header {
  width: 40px;
  text-align: center;
  padding: 0.5rem;
}

.select-all-checkbox,
.row-checkbox {
  cursor: pointer;
  accent-color: #007bff;
}

.radio-indicator {
  width: 12px;
  height: 12px;
  border: 2px solid #007bff;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  position: relative;
  background: white;
  transition: all 0.2s ease;
}

.radio-indicator.selected {
  background: #007bff;
}

.radio-indicator.selected::after {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.table-row.clickable {
  cursor: pointer;
}

.table-row:not(.clickable) {
  cursor: default;
}

.table-row {
  cursor: pointer;
  position: relative;
}

/* Estados solo con cambio de background */
.table-row:hover {
  background-color: #ffffff;
}

.table-row.active {
  background-color: #a1a1a1;
}

.table-row.selected {
  background-color: #a1bcd4;
  border-left: 4px solid #007bff;
}

.table-row.selected:hover {
  background-color: #0f333a;
}

.table-row:nth-child(even):not(.selected):not(:hover) {
  background-color: #ffffff;
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

.checkbox-cell {
  width: 40px;
  text-align: center;
  padding: 0.5rem;
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

  .checkbox-header,
  .checkbox-cell {
    width: 35px;
    padding: 0.3rem;
  }
}
</style>
