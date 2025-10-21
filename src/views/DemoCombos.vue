<template>
  <div class="demo-combos">
    <div class="page-header">
      <h1>🎛️ Demostración de Combos</h1>
      <p class="page-description">
        Ejemplos de uso de ComboSimple y ComboAvanzado en diferentes escenarios
      </p>
    </div>

    <div class="demo-sections">
      <!-- Sección ComboSimple -->
      <div class="demo-section">
        <h2>📋 ComboSimple - Uso básico</h2>
        <p class="section-description">
          Para casos simples donde solo necesitas seleccionar un valor de una lista.
        </p>

        <div class="combos-grid">
          <ComboSimple
            label="Usuario"
            placeholder="Seleccione un usuario"
            v-model="usuario"
            api-method="getUsuarios"
            store-name="usuarios"
            value-key="id"
            label-key="nombre"
          />

          <ComboSimple
            label="Departamento"
            placeholder="Seleccione departamento"
            v-model="departamento"
            api-method="getDepartamentos"
            store-name="departamentos"
            value-key="id"
            label-key="nombre"
          />

          <ComboSimple
            label="Grupo SICORE"
            placeholder="Seleccione grupo SICORE"
            v-model="grupoSicore"
            api-method="getGruposSicore"
            store-name="gruposSicore"
            value-key="IDGRUPOSICORE"
            label-key="DESCRIPCION"
          />
        </div>

        <div class="valores-seleccionados">
          <h4>🎯 Valores seleccionados (ComboSimple):</h4>
          <pre>{{ { usuario, departamento, grupoSicore } }}</pre>
        </div>
      </div>

      <!-- Sección ComboAvanzado -->
      <div class="demo-section">
        <h2>🚀 ComboAvanzado - Funcionalidades avanzadas</h2>
        <p class="section-description">
          Para casos más complejos con búsqueda, validación y mejor UX.
        </p>

        <div class="combos-grid">
          <!-- Con búsqueda -->
          <ComboAvanzado
            label="Usuario (con búsqueda)"
            placeholder="Buscar usuario..."
            v-model="usuarioAvanzado"
            api-method="getUsuarios"
            store-name="usuariosAvanzado"
            searchable
            help-text="Escriba para buscar por nombre o email"
            @select="onUsuarioSeleccionado"
          />

          <!-- Con validación -->
          <ComboAvanzado
            label="Departamento (con validación)"
            placeholder="Seleccione departamento"
            v-model="departamentoAvanzado"
            api-method="getDepartamentos"
            store-name="departamentosAvanzado"
            required
            :validator="validarDepartamento"
            help-text="Campo requerido"
            @select="onDepartamentoSeleccionado"
          />

          <!-- Deshabilitado -->
          <ComboAvanzado
            label="Campo deshabilitado"
            placeholder="No se puede seleccionar"
            v-model="campoDeshabilitado"
            api-method="getUsuarios"
            store-name="campoDeshabilitado"
            disabled
            help-text="Este campo está deshabilitado"
          />
        </div>

        <div class="valores-seleccionados">
          <h4>🎯 Valores seleccionados (ComboAvanzado):</h4>
          <pre>{{ { usuarioAvanzado, departamentoAvanzado, campoDeshabilitado } }}</pre>
        </div>
      </div>

      <!-- Sección de casos especiales -->
      <div class="demo-section">
        <h2>⚡ Casos Especiales</h2>
        <p class="section-description">
          Ejemplos de uso con composables personalizados y casos avanzados.
        </p>

        <div class="combos-grid">
          <!-- Combo con composable personalizado -->
          <div class="combo-custom">
            <label>Provincia (con composable):</label>
            <select v-model="provinciaComposable" :disabled="provincias.loading">
              <option value="">Seleccione provincia</option>
              <option
                v-for="provincia in provincias.itemsOrdenados"
                :key="provincia.id"
                :value="provincia.id"
              >
                {{ provincia.nombre }}
              </option>
            </select>
            <div class="combo-feedback">
              <span v-if="provincias.loading" class="loading">⏳ Cargando...</span>
              <span v-if="provincias.error" class="error">❌ {{ provincias.error }}</span>
            </div>
          </div>

          <!-- Stats del composable -->
          <div class="stats-combo">
            <h4>📊 Estadísticas del Composable:</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="label">Total provincias:</span>
                <span class="value">{{ provincias.items.length }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Cache válido:</span>
                <span class="value">{{ !provincias.needsRefresh ? '✅' : '❌' }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Inicializado:</span>
                <span class="value">{{ provincias.initialized ? '✅' : '❌' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="valores-seleccionados">
          <h4>🎯 Valor seleccionado (Composable):</h4>
          <pre>{{ { provinciaComposable } }}</pre>
        </div>
      </div>

      <!-- Sección de acciones -->
      <div class="demo-section">
        <h2>🛠️ Acciones y Controles</h2>

        <div class="acciones">
          <button @click="limpiarTodo" class="btn-action btn-clear">🧹 Limpiar Todo</button>
          <button @click="cargarDatos" class="btn-action btn-refresh" :disabled="cargandoDatos">
            {{ cargandoDatos ? '⏳ Cargando...' : '🔄 Refrescar Datos' }}
          </button>
          <button @click="mostrarEstadisticas" class="btn-action btn-stats">
            📊 Ver Estadísticas
          </button>
          <button @click="simularError" class="btn-action btn-error">⚠️ Simular Error</button>
        </div>

        <!-- Log de eventos -->
        <div class="event-log">
          <h4>📝 Log de eventos:</h4>
          <div class="log-container">
            <div v-for="(evento, index) in eventLog" :key="index" class="log-entry">
              <span class="timestamp">{{ evento.timestamp }}</span>
              <span class="event">{{ evento.message }}</span>
            </div>
          </div>
          <button @click="limpiarLog" class="btn-clear-log">🗑️ Limpiar Log</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ComboSimple from '@/components/ComboSimple.vue'
import ComboAvanzado from '@/components/ComboAvanzado.vue'
import { useCombo } from '@/composables/useCombo.js'

// Estados ComboSimple
const usuario = ref('')
const departamento = ref('')
const grupoSicore = ref('')

// Estados ComboAvanzado
const usuarioAvanzado = ref('')
const departamentoAvanzado = ref('')
const campoDeshabilitado = ref('')

// Estado composable personalizado
const provinciaComposable = ref('')
const provincias = useCombo('provincias', 'getProvincias')

// Estados generales
const cargandoDatos = ref(false)
const eventLog = ref([])

// Funciones de validación
function validarDepartamento(valor, item) {
  if (valor && item && !item.activo) {
    return 'Este departamento no está activo'
  }
  if (!valor) {
    return 'Debe seleccionar un departamento'
  }
  return true
}

// Manejadores de eventos
function onUsuarioSeleccionado(usuario) {
  logEvent(`Usuario seleccionado: ${usuario.nombre || usuario.id}`)
}

function onDepartamentoSeleccionado(departamento) {
  logEvent(`Departamento seleccionado: ${departamento.nombre || departamento.id}`)
}

// Acciones
function limpiarTodo() {
  usuario.value = ''
  departamento.value = ''
  grupoSicore.value = ''
  usuarioAvanzado.value = ''
  departamentoAvanzado.value = ''
  campoDeshabilitado.value = ''
  provinciaComposable.value = ''

  provincias.limpiar()
  logEvent('🧹 Todos los campos limpiados')
}

async function cargarDatos() {
  cargandoDatos.value = true
  try {
    await provincias.refrescar()
    logEvent('🔄 Datos refrescados exitosamente')
  } catch (error) {
    logEvent(`❌ Error refrescando datos: ${error.message}`)
  } finally {
    cargandoDatos.value = false
  }
}

function mostrarEstadisticas() {
  const stats = provincias.obtenerEstadisticas()
  const mensaje = `
📊 Estadísticas:
- Total items: ${stats.total}
- Cache válido: ${stats.cacheValido ? 'Sí' : 'No'}
- Inicializado: ${stats.inicializado ? 'Sí' : 'No'}
- Última actualización: ${stats.ultimaActualizacion ? new Date(stats.ultimaActualizacion).toLocaleTimeString() : 'Nunca'}
  `
  alert(mensaje)
  logEvent('📊 Estadísticas mostradas')
}

function simularError() {
  logEvent('⚠️ Simulando error de conexión...')
  // Simular un error
  setTimeout(() => {
    logEvent('❌ Error simulado: Conexión perdida')
  }, 1000)
}

function logEvent(message) {
  eventLog.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    message,
  })

  // Mantener solo los últimos 10 eventos
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

function limpiarLog() {
  eventLog.value = []
}
</script>

<style scoped>
.demo-combos {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  font-size: 1.1rem;
}

.demo-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.demo-section h2 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.section-description {
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.combos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.combo-custom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.combo-custom label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.combo-custom select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
}

.combo-feedback {
  font-size: 0.75rem;
  min-height: 1rem;
}

.combo-feedback .loading {
  color: #6b7280;
}

.combo-feedback .error {
  color: #dc2626;
}

.stats-combo {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stats-combo h4 {
  margin-bottom: 1rem;
  color: #374151;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.stat-item .label {
  color: #6b7280;
}

.stat-item .value {
  font-weight: 500;
  color: #374151;
}

.valores-seleccionados {
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.valores-seleccionados h4 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.valores-seleccionados pre {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
}

.acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-action {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-clear {
  background: #ef4444;
  color: white;
}
.btn-refresh {
  background: #3b82f6;
  color: white;
}
.btn-stats {
  background: #10b981;
  color: white;
}
.btn-error {
  background: #f59e0b;
  color: white;
}

.btn-action:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.event-log {
  background: #1f2937;
  border-radius: 8px;
  padding: 1rem;
}

.event-log h4 {
  color: #f9fafb;
  margin-bottom: 1rem;
}

.log-container {
  background: #111827;
  border-radius: 6px;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  margin-bottom: 1rem;
}

.log-entry {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.timestamp {
  color: #6b7280;
  min-width: 80px;
}

.event {
  color: #f9fafb;
}

.btn-clear-log {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.btn-clear-log:hover {
  background: #4b5563;
}

@media (max-width: 768px) {
  .demo-combos {
    padding: 1rem;
  }

  .combos-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .acciones {
    flex-direction: column;
  }
}
</style>
