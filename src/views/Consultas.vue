<template>
  <div class="consultas-view">
    <h1>Consultas SQL</h1>

    <div class="sql-query-section">
      <div class="query-editor">
        <div class="editor-header">
          <h3>💻 Editor de Consultas SQL</h3>
          <div class="editor-actions">
            <button @click="clearQuery" class="btn-clear" :disabled="loading">🗑️ Limpiar</button>
            <button
              @click="executeQueryHandler"
              class="btn-execute"
              :disabled="loading || !sqlQuery.trim()"
            >
              {{ loading ? '⏳ Ejecutando...' : '▶️ Ejecutar' }}
            </button>
          </div>
        </div>

        <div class="editor-container">
          <textarea
            v-model="sqlQuery"
            class="sql-textarea"
            placeholder="Escribe tu consulta SQL aquí...&#10;&#10;Ejemplo:&#10;SELECT * FROM tabla WHERE campo = 'valor'"
            rows="8"
            :disabled="loading"
          ></textarea>
        </div>

        <div class="query-examples">
          <h4>📝 Consultas de ejemplo:</h4>
          <div class="examples-grid">
            <button
              v-for="example in sqlExamples"
              :key="example.name"
              @click="loadExample(example.query)"
              class="example-btn"
              :disabled="loading"
            >
              {{ example.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="results-section">
      <h3>📊 Resultados</h3>
      <DataTable :columns="queryColumns" :rows="queryRows" :loading="loading" :error="error" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDgsApi } from '@/composables/api/useDgsApi.js'
import DataTable from '@/components/DataTable.vue'

const { executeQuery, loading, error } = useDgsApi()

const sqlQuery = ref('')
const queryColumns = ref([])
const queryRows = ref([])

const sqlExamples = ref([
  {
    name: 'Todas las liquidaciones',
    query: 'SELECT * FROM usuario.liquidacion rownum<= 10',
  },
  {
    name: 'Liquidaciones por fecha',
    query:
      "SELECT * FROM usuario.liquidacion WHERE fecha >= '2024-01-01' ORDER BY fecha DESC rownum <= 10",
  },
  {
    name: 'Resumen por tipo',
    query:
      'SELECT tipo_liquidacion, COUNT(*) as cantidad FROM usuario.liquidaciones GROUP BY tipo_liquidacion',
  },
  {
    name: 'Contribuyentes activos',
    query: "SELECT DISTINCT contribuyente FROM liquidaciones WHERE estado = 'ACTIVO' LIMIT 10",
  },
])

const executeQueryHandler = async () => {
  if (!sqlQuery.value.trim()) {
    return
  }

  try {
    console.log('🔍 Ejecutando consulta SQL:', sqlQuery.value)

    // Limpiar resultados anteriores
    queryColumns.value = []
    queryRows.value = []

    const result = await executeQuery(sqlQuery.value.trim())

    if (result && Array.isArray(result) && result.length > 0) {
      // Extraer columnas del primer registro
      queryColumns.value = Object.keys(result[0])
      queryRows.value = result

      console.log('✅ Consulta ejecutada exitosamente:', {
        columns: queryColumns.value,
        rowCount: queryRows.value.length,
      })
    } else {
      // No hay datos pero la consulta fue exitosa
      queryColumns.value = []
      queryRows.value = []
      console.log('✅ Consulta ejecutada sin resultados')
    }
  } catch (err) {
    console.error('❌ Error ejecutando consulta SQL:', err)
    queryColumns.value = []
    queryRows.value = []
  }
}

const clearQuery = () => {
  sqlQuery.value = ''
  queryColumns.value = []
  queryRows.value = []
}

const loadExample = (exampleQuery) => {
  sqlQuery.value = exampleQuery
}
</script>

<style scoped>
.consultas-view {
  padding: 1.5rem;
  max-width: 100%;
}

.consultas-view h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.sql-query-section {
  margin-bottom: 2rem;
}

.query-editor {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.editor-header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3 {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-clear,
.btn-execute {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-clear {
  background-color: #6c757d;
  color: white;
}

.btn-clear:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-execute {
  background-color: #28a745;
  color: white;
}

.btn-execute:hover:not(:disabled) {
  background-color: #218838;
}

.btn-clear:disabled,
.btn-execute:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.editor-container {
  padding: 1rem;
}

.sql-textarea {
  width: 100%;
  min-height: 200px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  background-color: #f8f9fa;
  color: #495057;
  transition: border-color 0.2s ease;
}

.sql-textarea:focus {
  outline: none;
  border-color: #1976d2;
  background-color: white;
}

.sql-textarea::placeholder {
  color: #6c757d;
  font-style: italic;
}

.sql-textarea:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.query-examples {
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.query-examples h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 0.9rem;
}

.examples-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example-btn {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d2;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.example-btn:hover:not(:disabled) {
  background-color: #1976d2;
  color: white;
}

.example-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.results-section {
  margin-top: 2rem;
}

.results-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .consultas-view {
    padding: 1rem;
  }

  .consultas-view h1 {
    font-size: 1.5rem;
  }

  .editor-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .editor-actions {
    justify-content: center;
  }

  .sql-textarea {
    min-height: 150px;
    font-size: 0.8rem;
  }

  .examples-grid {
    justify-content: center;
  }

  .example-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .editor-actions {
    flex-direction: column;
  }

  .examples-grid {
    flex-direction: column;
  }

  .example-btn {
    text-align: center;
  }
}
</style>
