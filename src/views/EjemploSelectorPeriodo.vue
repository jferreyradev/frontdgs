<template>
  <div class="demo-selector-periodo">
    <h2>🗓️ Selector de Período - Demo</h2>

    <!-- Ejemplo básico -->
    <div class="ejemplo">
      <h3>📋 Uso Básico</h3>
      <SelectorPeriodo @cambio="manejarCambio" @periodo-completo="manejarPeriodoCompleto" />

      <div v-if="datosBasico" class="resultado">
        <strong>Selección:</strong> {{ JSON.stringify(datosBasico, null, 2) }}
      </div>
    </div>

    <!-- Ejemplo con valores iniciales -->
    <div class="ejemplo">
      <h3>⚙️ Con Valores Iniciales</h3>
      <SelectorPeriodo
        :mes-inicial="10"
        :año-inicial="2025"
        :iniciar-con-hoy="false"
        @cambio="manejarCambioConInicial"
      />

      <div v-if="datosConInicial" class="resultado">
        <strong>Con inicial:</strong> {{ datosConInicial.textoCompleto }}
      </div>
    </div>

    <!-- Ejemplo con rango personalizado -->
    <div class="ejemplo">
      <h3>📅 Rango de Años Personalizado</h3>
      <SelectorPeriodo
        :año-minimo="2015"
        :año-maximo="2035"
        :iniciar-con-hoy="true"
        @cambio="manejarCambioRango"
      />

      <div v-if="datosRango" class="resultado">
        <strong>Rango personalizado:</strong>
        {{ datosRango.textoCompleto }}
        <br />
        <small>Fechas ISO: {{ datosRango.fechaInicioISO }} → {{ datosRango.fechaFinISO }}</small>
      </div>
    </div>

    <!-- Ejemplo sin store -->
    <div class="ejemplo">
      <h3>🔓 Sin Conexión a Store</h3>
      <SelectorPeriodo :conectar-store="false" @cambio="manejarCambioSinStore" />

      <div v-if="datosSinStore" class="resultado">
        <strong>Sin store:</strong> {{ datosSinStore.textoCompleto }}
      </div>
    </div>

    <!-- Control programático -->
    <div class="ejemplo">
      <h3>🎮 Control Programático</h3>
      <SelectorPeriodo ref="selectorControlado" @cambio="manejarCambioControlado" />

      <div class="controles-demo">
        <button @click="establecerEnero2024" class="btn-demo">Enero 2024</button>
        <button @click="establecerHoyProgramatico" class="btn-demo">Hoy</button>
        <button @click="limpiarProgramatico" class="btn-demo">Limpiar</button>
        <button @click="obtenerDatosProgramatico" class="btn-demo">Obtener Datos</button>
      </div>

      <div v-if="datosControlado" class="resultado">
        <strong>Controlado:</strong> {{ datosControlado.textoCompleto }}
      </div>
    </div>

    <!-- Estado del store -->
    <div class="ejemplo">
      <h3>🏪 Estado del Store</h3>
      <div class="store-info">
        <p>
          <strong>Mes en store:</strong> {{ periodoStore?.mesSeleccionado || 'No seleccionado' }}
        </p>
        <p>
          <strong>Año en store:</strong> {{ periodoStore?.añoSeleccionado || 'No seleccionado' }}
        </p>
        <p>
          <strong>Fecha actual:</strong>
          {{
            periodoStore?.fechaActual ? JSON.stringify(periodoStore.fechaActual) : 'No disponible'
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SelectorPeriodo from '@/components/filters/SelectorPeriodo.vue'
import { usePeriodoStore } from '@/stores/filters/periodo.js'

// Store para mostrar estado
const periodoStore = usePeriodoStore()

// Referencias para los ejemplos
const selectorControlado = ref(null)

// Estados de los ejemplos
const datosBasico = ref(null)
const datosConInicial = ref(null)
const datosRango = ref(null)
const datosSinStore = ref(null)
const datosControlado = ref(null)

// Manejadores de eventos
function manejarCambio(datos) {
  datosBasico.value = datos
  console.log('Cambio básico:', datos)
}

function manejarPeriodoCompleto(datos) {
  console.log('Período completo:', datos)
}

function manejarCambioConInicial(datos) {
  datosConInicial.value = datos
}

function manejarCambioRango(datos) {
  datosRango.value = datos
}

function manejarCambioSinStore(datos) {
  datosSinStore.value = datos
}

function manejarCambioControlado(datos) {
  datosControlado.value = datos
}

// Controles programáticos
function establecerEnero2024() {
  selectorControlado.value?.establecerPeriodo(1, 2024)
}

function establecerHoyProgramatico() {
  selectorControlado.value?.establecerHoy()
}

function limpiarProgramatico() {
  selectorControlado.value?.limpiarSeleccion()
}

function obtenerDatosProgramatico() {
  const datos = selectorControlado.value?.obtenerDatos()
  console.log('Datos obtenidos:', datos)
  alert(`Datos actuales:\n${JSON.stringify(datos, null, 2)}`)
}
</script>

<style scoped>
.demo-selector-periodo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.ejemplo {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}

.ejemplo h3 {
  margin: 0 0 1rem 0;
  color: #374151;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 0.5rem;
}

.resultado {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
}

.controles-demo {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.btn-demo {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.btn-demo:hover {
  background: #2563eb;
}

.store-info {
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.375rem;
}

.store-info p {
  margin: 0.5rem 0;
  color: #92400e;
}

/* Responsive */
@media (max-width: 640px) {
  .demo-selector-periodo {
    padding: 1rem;
  }

  .controles-demo {
    flex-direction: column;
  }

  .btn-demo {
    width: 100%;
  }
}
</style>
