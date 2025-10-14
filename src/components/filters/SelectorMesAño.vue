<template>
  <div class="mes-año-selector-compact">
    <div class="selector-row">
      <select
        :value="mesSeleccionado"
        @change="actualizarMes($event.target.value)"
        class="select-mes"
      >
        <option value="">Mes</option>
        <option v-for="mes in meses" :key="mes.valor" :value="mes.valor">
          {{ mes.nombre }}
        </option>
      </select>

      <select
        :value="añoSeleccionado"
        @change="actualizarAño($event.target.value)"
        class="select-año"
      >
        <option value="">Año</option>
        <option v-for="año in años" :key="año" :value="año">
          {{ año }}
        </option>
      </select>

      <button @click="establecerHoy" class="btn-hoy" title="Establecer mes/año actual">📅</button>
      <button @click="limpiarSeleccion" class="btn-limpiar" title="Limpiar selección">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePeriodoStore } from '@/stores/filters/periodo.js'

// Props simplificadas - solo lo esencial
const props = defineProps({
  // Valor inicial del mes (1-12)
  mesInicial: {
    type: [Number, String],
    default: null,
  },
  // Valor inicial del año
  añoInicial: {
    type: [Number, String],
    default: null,
  },
  // Rango de años a mostrar
  añoMinimo: {
    type: Number,
    default: 2020,
  },
  añoMaximo: {
    type: Number,
    default: 2030,
  },
  // Si debe conectarse con el store de períodos
  conectarStore: {
    type: Boolean,
    default: true,
  },
})

// Solo el emit esencial
const emit = defineEmits(['cambio'])

// Estado reactivo
const mesSeleccionado = ref(props.mesInicial || '')
const añoSeleccionado = ref(props.añoInicial || '')

// Store (solo si está habilitado)
const periodoStore = props.conectarStore ? usePeriodoStore() : null

// Definición de meses
const meses = [
  { valor: 1, nombre: 'Enero' },
  { valor: 2, nombre: 'Febrero' },
  { valor: 3, nombre: 'Marzo' },
  { valor: 4, nombre: 'Abril' },
  { valor: 5, nombre: 'Mayo' },
  { valor: 6, nombre: 'Junio' },
  { valor: 7, nombre: 'Julio' },
  { valor: 8, nombre: 'Agosto' },
  { valor: 9, nombre: 'Septiembre' },
  { valor: 10, nombre: 'Octubre' },
  { valor: 11, nombre: 'Noviembre' },
  { valor: 12, nombre: 'Diciembre' },
]

// Generar array de años
const años = computed(() => {
  const añosArray = []
  for (let año = props.añoMinimo; año <= props.añoMaximo; año++) {
    añosArray.push(año)
  }
  return añosArray
})

// Computados esenciales
const nombreMesSeleccionado = computed(() => {
  if (!mesSeleccionado.value) return ''
  const mes = meses.find((m) => m.valor === parseInt(mesSeleccionado.value))
  return mes ? mes.nombre : ''
})

// Datos de selección para emitir - solo lo necesario
const seleccionCompleta = computed(() => {
  return {
    mes: parseInt(mesSeleccionado.value) || null,
    año: parseInt(añoSeleccionado.value) || null,
    mesNombre: nombreMesSeleccionado.value,
    // Fechas ISO para APIs
    fechaInicioISO:
      mesSeleccionado.value && añoSeleccionado.value
        ? `${añoSeleccionado.value}-${mesSeleccionado.value.toString().padStart(2, '0')}-01T00:00:00.000Z`
        : null,
    fechaFinISO:
      mesSeleccionado.value && añoSeleccionado.value
        ? `${añoSeleccionado.value}-${mesSeleccionado.value.toString().padStart(2, '0')}-${new Date(añoSeleccionado.value, mesSeleccionado.value, 0).getDate().toString().padStart(2, '0')}T23:59:59.999Z`
        : null,
  }
})

// Métodos principales - solo lo esencial
function actualizarMes(valor) {
  mesSeleccionado.value = valor
  emitirCambio()
  sincronizarConStore()
}

function actualizarAño(valor) {
  añoSeleccionado.value = valor
  emitirCambio()
  sincronizarConStore()
}

function establecerHoy() {
  const hoy = new Date()
  mesSeleccionado.value = hoy.getMonth() + 1
  añoSeleccionado.value = hoy.getFullYear()
  emitirCambio()
  sincronizarConStore()
}

function limpiarSeleccion() {
  mesSeleccionado.value = ''
  añoSeleccionado.value = ''
  emitirCambio()
  sincronizarConStore()
}

function emitirCambio() {
  emit('cambio', seleccionCompleta.value)
}

// Sincronización con store - solo si está habilitado
function sincronizarConStore() {
  if (!periodoStore) return

  const mesNum = parseInt(mesSeleccionado.value)
  const añoNum = parseInt(añoSeleccionado.value)

  // Solo sincronizar si los valores son diferentes a los del store
  if (
    mesSeleccionado.value &&
    añoSeleccionado.value &&
    (periodoStore.mesSeleccionado !== mesNum || periodoStore.añoSeleccionado !== añoNum)
  ) {
    console.log('Sincronizando hacia store:', { mes: mesNum, año: añoNum })
    periodoStore.establecerMesAño(mesNum, añoNum)
  } else if (!mesSeleccionado.value || !añoSeleccionado.value) {
    periodoStore.limpiarSeleccion()
  }
}

// Métodos públicos - solo los esenciales
function establecerMesAño(mes, año) {
  mesSeleccionado.value = mes || ''
  añoSeleccionado.value = año || ''
  emitirCambio()
  sincronizarConStore()
}

function obtenerSeleccion() {
  return seleccionCompleta.value
}

// Exponer solo métodos esenciales
defineExpose({
  establecerMesAño,
  obtenerSeleccion,
  establecerHoy,
  limpiarSeleccion,
})

// Sincronización bidireccional con el store
if (periodoStore) {
  // Watch para sincronizar desde el store hacia el componente
  watch(
    () => [periodoStore.mesSeleccionado, periodoStore.añoSeleccionado],
    ([nuevoMes, nuevoAño]) => {
      // Solo actualizar si los valores son diferentes para evitar bucles infinitos
      const mesComponente = parseInt(mesSeleccionado.value) || null
      const añoComponente = parseInt(añoSeleccionado.value) || null

      if (nuevoMes !== mesComponente || nuevoAño !== añoComponente) {
        console.log('Sincronizando desde store:', {
          store: { mes: nuevoMes, año: nuevoAño },
          componente: { mes: mesComponente, año: añoComponente },
        })
        mesSeleccionado.value = nuevoMes ? nuevoMes.toString() : ''
        añoSeleccionado.value = nuevoAño ? nuevoAño.toString() : ''
        emitirCambio()
      }
    },
    { immediate: true },
  )
}

// Inicialización simple
onMounted(() => {
  // Si el store tiene valores y el componente no, sincronizar
  if (periodoStore && periodoStore.mesSeleccionado && periodoStore.añoSeleccionado) {
    if (!mesSeleccionado.value || !añoSeleccionado.value) {
      mesSeleccionado.value = periodoStore.mesSeleccionado
      añoSeleccionado.value = periodoStore.añoSeleccionado
      emitirCambio()
    }
  } else if (mesSeleccionado.value || añoSeleccionado.value) {
    emitirCambio()
    sincronizarConStore()
  }
})
</script>

<style scoped>
.mes-año-selector-compact {
  width: 100%;
}

.selector-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.select-mes,
.select-año {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: white;
  font-size: 13px;
  min-width: 70px;
}

.select-mes:focus,
.select-año:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn-hoy,
.btn-limpiar {
  flex: 0 0 auto;
  width: 26px;
  height: 32px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-hoy {
  background-color: #28a745;
  color: white;
}

.btn-hoy:hover {
  background-color: #218838;
}

.btn-limpiar {
  background-color: #dc3545;
  color: white;
  font-weight: bold;
}

.btn-limpiar:hover {
  background-color: #c82333;
}
</style>
