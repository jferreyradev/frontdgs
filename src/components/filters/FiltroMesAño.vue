<template>
  <div class="selector-compacto">
    <div class="fila-selector">
      <select
        :value="mesSeleccionado"
        @change="actualizarMes($event.target.value)"
        class="select-mes"
        title="Seleccionar mes"
      >
        <option value="">Mes</option>
        <option v-for="mes in meses" :key="mes.valor" :value="mes.valor">
          {{ mes.nombre.substring(0, 3) }}
        </option>
      </select>

      <select
        :value="añoSeleccionado"
        @change="actualizarAño($event.target.value)"
        class="select-año"
        title="Seleccionar año"
      >
        <option value="">Año</option>
        <option v-for="año in años" :key="año" :value="año">
          {{ año }}
        </option>
      </select>

      <button @click="establecerHoy" class="btn-pequeno btn-hoy" title="Mes/año actual">📅</button>

      <button
        @click="limpiarSeleccion"
        class="btn-pequeno btn-limpiar"
        title="Limpiar selección"
        :disabled="!mesSeleccionado && !añoSeleccionado"
      >
        ✕
      </button>
    </div>

    <!-- Indicador visual cuando hay selección -->
    <div v-if="mesSeleccionado && añoSeleccionado" class="indicador-seleccion">
      {{ nombreMesSeleccionado }} {{ añoSeleccionado }}
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
.selector-compacto {
  width: 100%;
  max-width: 300px;
}

/* Fila principal compacta - SIEMPRE EN UNA FILA */
.fila-selector {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: nowrap; /* Nunca wrap */
}

/* Selectores compactos */
.select-mes,
.select-año {
  flex: 1 1 auto;
  padding: 4px 6px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 55px; /* Mínimo para que quepa el texto */
  max-width: 80px; /* Máximo para no dominar */
}

.select-mes {
  min-width: 55px;
  max-width: 70px;
}

.select-año {
  min-width: 55px;
  max-width: 75px;
}

.select-mes:focus,
.select-año:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

.select-mes:hover,
.select-año:hover {
  border-color: #adb5bd;
}

/* Botones pequeños */
.btn-pequeno {
  flex: 0 0 24px; /* Tamaño fijo y no crece */
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-hoy {
  background: #28a745;
  color: white;
}

.btn-hoy:hover {
  background: #218838;
  transform: scale(1.05);
}

.btn-limpiar {
  background: #6c757d;
  color: white;
  font-weight: bold;
}

.btn-limpiar:hover:not(:disabled) {
  background: #5a6268;
  transform: scale(1.05);
}

.btn-limpiar:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
  transform: none;
}

/* Indicador de selección */
.indicador-seleccion {
  margin-top: 8px;
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  border-left: 3px solid #2196f3;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive para móviles - MANTENER UNA SOLA FILA */
@media (max-width: 480px) {
  .selector-compacto {
    max-width: 100%;
  }

  .fila-selector {
    gap: 3px; /* Reducir gap para más espacio */
  }

  .select-mes,
  .select-año {
    font-size: 11px;
    padding: 3px 4px;
    min-width: 45px;
    max-width: 65px;
  }

  .btn-pequeno {
    width: 22px;
    height: 22px;
    font-size: 9px;
    flex: 0 0 22px;
  }

  .indicador-seleccion {
    font-size: 10px;
    margin-top: 4px;
    padding: 2px 6px;
  }
}

/* Para pantallas muy pequeñas - AÚN MÁS COMPACTO PERO UNA FILA */
@media (max-width: 320px) {
  .fila-selector {
    gap: 2px; /* Gap mínimo */
  }

  .select-mes,
  .select-año {
    font-size: 10px;
    padding: 2px 3px;
    min-width: 40px;
    max-width: 55px;
  }

  .btn-pequeno {
    width: 20px;
    height: 20px;
    font-size: 8px;
    flex: 0 0 20px;
  }
}

/* Mejoras de accesibilidad */
.select-mes:focus-visible,
.select-año:focus-visible,
.btn-pequeno:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Hover states más suaves */
.select-mes:hover,
.select-año:hover {
  background: #f8f9fa;
}

/* Estados de carga/disabled */
.selector-compacto:disabled * {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
