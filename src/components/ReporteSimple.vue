<template>
  <div class="reporte-simple">
    <!-- Título -->
    <h1>{{ titulo }}</h1>

    <!-- Filtros (si están habilitados) -->
    <div v-if="mostrarFiltros" class="filtros">
      <PanelFiltros />
    </div>

    <!-- Botón ejecutar -->
    <button @click="ejecutar" :disabled="cargando" class="btn-ejecutar">
      {{ cargando ? '⏳ Cargando...' : '📊 Ejecutar Reporte' }}
    </button>

    <!-- Mensaje -->
    <div v-if="mensaje" class="mensaje" :class="tipoMensaje">
      {{ mensaje }}
    </div>

    <!-- Resultados -->
    <DataTable
      :columns="columnas"
      :rows="datos"
      :loading="cargando"
      :error="error"
      :titulo="props.titulo"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PanelFiltros from '@/components/filters/PanelFiltros.vue'
import DataTable from '@/components/DataTable.vue'
import { useDgsApi } from '@/composables/api/useDgsApi.js'

// Props
const props = defineProps({
  titulo: { type: String, default: 'Reporte' },
  consulta: { type: String, required: true },
  variables: { type: Object, default: () => ({}) },
  mostrarFiltros: { type: Boolean, default: true },
})

// Estado
const cargando = ref(false)
const mensaje = ref('')
const tipoMensaje = ref('info')
const columnas = ref([])
const datos = ref([])
const error = ref(null)

// Composables
const { executeQuery } = useDgsApi()

// Función principal - COMPLETAMENTE GENERALIZADA
async function ejecutar() {
  try {
    cargando.value = true
    mensaje.value = ''
    error.value = null
    columnas.value = []
    datos.value = []

    // Construir consulta con variables generalizadas
    let sql = props.consulta

    console.log('🔍 Variables recibidas:', props.variables)

    // Reemplazar todos los placeholders con las variables proporcionadas
    Object.entries(props.variables).forEach(([key, value]) => {
      const placeholder = `:${key.toUpperCase()}`
      const valorFinal = value !== null && value !== undefined ? value : 'NULL'

      // Si es string y no es NULL, agregar comillas
      const valorSQL =
        typeof valorFinal === 'string' && valorFinal !== 'NULL' ? `'${valorFinal}'` : valorFinal

      sql = sql.replace(new RegExp(placeholder, 'g'), valorSQL)
      console.log(`� Reemplazando ${placeholder} con ${valorSQL}`)
    })

    console.log('🔍 SQL final:', sql)
    const resultado = await executeQuery(sql)

    if (resultado?.length > 0) {
      columnas.value = Object.keys(resultado[0])
      datos.value = resultado
      mostrarMensaje(`${resultado.length} registros encontrados`, 'success')
    } else {
      mostrarMensaje('No se encontraron datos', 'warning')
    }
  } catch (err) {
    console.error('❌ Error:', err)
    error.value = err.message
    mostrarMensaje(`Error: ${err.message}`, 'error')
  } finally {
    cargando.value = false
  }
}

function mostrarMensaje(texto, tipo = 'info') {
  mensaje.value = texto
  tipoMensaje.value = tipo
  if (tipo !== 'error') {
    setTimeout(() => (mensaje.value = ''), 3000)
  }
}

defineExpose({ ejecutar })
</script>

<style scoped>
.reporte-simple {
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.filtros {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.btn-ejecutar {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

.btn-ejecutar:hover:not(:disabled) {
  background: #0056b3;
}

.btn-ejecutar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.mensaje {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.mensaje.success {
  background: #d4edda;
  color: #155724;
}

.mensaje.warning {
  background: #fff3cd;
  color: #856404;
}

.mensaje.error {
  background: #f8d7da;
  color: #721c24;
}

.info {
  text-align: right;
  color: #666;
  margin-top: 10px;
  font-size: 14px;
}
</style>
