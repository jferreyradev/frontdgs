<template>
  <div class="demo-filtros-completos">
    <h2>🔧 Filtros Completos con Período</h2>

    <!-- Filtros dinámicos + período -->
    <div class="filtros-container">
      <div class="filtro-periodo">
        <label class="filtro-label">📅 Período:</label>
        <SelectorPeriodo
          :iniciar-con-hoy="true"
          @cambio="actualizarPeriodo"
          @periodo-completo="periodoCompleto"
        />
      </div>

      <div class="filtros-dinamicos">
        <label class="filtro-label">🎯 Filtros:</label>
        <FiltroLiqDinamico :configuracion="configFiltros" @filtros-aplicados="filtrosAplicados" />
      </div>
    </div>

    <!-- Mostrar datos combinados -->
    <div class="resultados">
      <div class="resultado-card">
        <h3>📊 Estado de Filtros</h3>

        <div class="resultado-seccion">
          <h4>🗓️ Período Seleccionado</h4>
          <div v-if="datosCompletos.periodo" class="datos-periodo">
            <p><strong>Período:</strong> {{ datosCompletos.periodo.textoCompleto }}</p>
            <p>
              <strong>Desde:</strong> {{ formatearFecha(datosCompletos.periodo.fechaInicioISO) }}
            </p>
            <p><strong>Hasta:</strong> {{ formatearFecha(datosCompletos.periodo.fechaFinISO) }}</p>
            <span v-if="datosCompletos.periodo.esFuturo" class="badge-futuro">Período Futuro</span>
          </div>
          <p v-else class="texto-muted">No hay período seleccionado</p>
        </div>

        <div class="resultado-seccion">
          <h4>🎯 Filtros Aplicados</h4>
          <div
            v-if="datosCompletos.filtros && Object.keys(datosCompletos.filtros).length > 0"
            class="datos-filtros"
          >
            <div
              v-for="(valor, filtro) in datosCompletos.filtros"
              :key="filtro"
              class="filtro-aplicado"
            >
              <strong>{{ filtro }}:</strong> {{ formatearValorFiltro(valor) }}
            </div>
          </div>
          <p v-else class="texto-muted">No hay filtros aplicados</p>
        </div>

        <div class="resultado-seccion">
          <h4>🚀 Consulta Lista</h4>
          <div v-if="consultaLista" class="consulta-ready">
            <p class="texto-exito">✅ Listos para consultar datos</p>
            <button @click="simularConsulta" class="btn-consulta">🔍 Ejecutar Consulta</button>
          </div>
          <p v-else class="texto-advertencia">⏳ Selecciona período y al menos un filtro</p>
        </div>
      </div>

      <!-- JSON completo para debug -->
      <div class="resultado-card">
        <h3>🔧 Datos Técnicos (Debug)</h3>
        <pre class="json-debug">{{ JSON.stringify(datosCompletos, null, 2) }}</pre>
      </div>
    </div>

    <!-- Controles adicionales -->
    <div class="controles-extras">
      <button @click="limpiarTodo" class="btn-limpiar-todo">🗑️ Limpiar Todo</button>
      <button @click="configurarEjemplo" class="btn-ejemplo">⚡ Configurar Ejemplo</button>
      <button @click="exportarConfiguracion" class="btn-exportar">📤 Exportar Config</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SelectorPeriodo from '@/components/filters/SelectorPeriodo.vue'
import FiltroLiqDinamico from '@/components/filters/FiltroLiqDinamico.vue'

// Configuración de filtros dinámicos
const configFiltros = [
  {
    key: 'jurisdiccion',
    metodoApi: 'getJurisdicciones',
    placeholder: 'Seleccionar jurisdicción',
  },
  {
    key: 'programa',
    metodoApi: 'getProgramas',
    placeholder: 'Seleccionar programa',
  },
  {
    key: 'organismo',
    metodoApi: 'getOrganismos',
    placeholder: 'Seleccionar organismo',
  },
]

// Estado de datos
const datosCompletos = ref({
  periodo: null,
  filtros: {},
  timestamp: null,
})

// Referencias para control
const selectorPeriodo = ref(null)

// Computados
const consultaLista = computed(() => {
  return (
    datosCompletos.value.periodo &&
    datosCompletos.value.periodo.valido &&
    Object.keys(datosCompletos.value.filtros).length > 0
  )
})

// Manejadores de eventos
function actualizarPeriodo(datosPeriodo) {
  datosCompletos.value.periodo = datosPeriodo
  datosCompletos.value.timestamp = new Date().toISOString()
  console.log('Período actualizado:', datosPeriodo)
}

function periodoCompleto(datosPeriodo) {
  console.log('Período completo detectado:', datosPeriodo)
  // Aquí podrías activar automáticamente algunos filtros
}

function filtrosAplicados(filtrosData) {
  datosCompletos.value.filtros = filtrosData
  datosCompletos.value.timestamp = new Date().toISOString()
  console.log('Filtros aplicados:', filtrosData)
}

// Utilidades de formato
function formatearFecha(fechaISO) {
  if (!fechaISO) return 'No definida'
  return new Date(fechaISO).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatearValorFiltro(valor) {
  if (typeof valor === 'object' && valor !== null) {
    return valor.nombre || valor.descripcion || JSON.stringify(valor)
  }
  return valor
}

// Controles adicionales
function limpiarTodo() {
  datosCompletos.value = {
    periodo: null,
    filtros: {},
    timestamp: null,
  }
  // Los componentes se limpiarán via store automáticamente
}

function configurarEjemplo() {
  // Configurar un ejemplo completo
  datosCompletos.value.periodo = {
    mes: 10,
    año: 2025,
    mesNombre: 'Octubre',
    textoCompleto: 'Octubre 2025',
    fechaInicioISO: '2025-10-01T00:00:00.000Z',
    fechaFinISO: '2025-10-31T23:59:59.999Z',
    valido: true,
    esFuturo: false,
  }
}

function simularConsulta() {
  const parametros = {
    ...datosCompletos.value.filtros,
    fechaInicio: datosCompletos.value.periodo.fechaInicioISO,
    fechaFin: datosCompletos.value.periodo.fechaFinISO,
  }

  console.log('🚀 Simulando consulta con parámetros:', parametros)

  alert(`Consulta ejecutada con:\n\n${JSON.stringify(parametros, null, 2)}`)
}

function exportarConfiguracion() {
  const config = {
    filtrosDinamicos: configFiltros,
    estadoActual: datosCompletos.value,
    timestamp: new Date().toISOString(),
  }

  console.log('📤 Configuración exportada:', config)

  // Simular descarga
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `filtros-config-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Watchers para debugging
watch(
  () => datosCompletos.value,
  (nuevos) => {
    console.log('📊 Estado completo actualizado:', nuevos)
  },
  { deep: true },
)
</script>

<style scoped>
.demo-filtros-completos {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.filtros-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.filtro-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.resultados {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.resultado-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.resultado-card h3 {
  margin: 0 0 1rem 0;
  color: #111827;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 0.5rem;
}

.resultado-seccion {
  margin-bottom: 1.5rem;
}

.resultado-seccion h4 {
  margin: 0 0 0.5rem 0;
  color: #4b5563;
  font-size: 1rem;
}

.datos-periodo p,
.datos-filtros .filtro-aplicado {
  margin: 0.25rem 0;
  padding: 0.25rem 0;
}

.badge-futuro {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #fbbf24;
  color: #92400e;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.texto-muted {
  color: #6b7280;
  font-style: italic;
}

.texto-exito {
  color: #059669;
  font-weight: 500;
}

.texto-advertencia {
  color: #d97706;
}

.consulta-ready {
  padding: 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
}

.btn-consulta {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #059669;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-consulta:hover {
  background: #047857;
}

.json-debug {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.controles-extras {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.controles-extras button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-limpiar-todo {
  color: #dc2626;
  border-color: #fecaca;
}

.btn-limpiar-todo:hover {
  background: #fef2f2;
}

.btn-ejemplo {
  color: #2563eb;
  border-color: #bfdbfe;
}

.btn-ejemplo:hover {
  background: #eff6ff;
}

.btn-exportar {
  color: #059669;
  border-color: #a7f3d0;
}

.btn-exportar:hover {
  background: #f0fdf4;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-filtros-completos {
    padding: 1rem;
  }

  .filtros-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .resultados {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .controles-extras {
    flex-direction: column;
  }
}
</style>
