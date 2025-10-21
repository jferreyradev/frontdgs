<template>
  <div class="selector-periodo">
    <!-- Combos usando ComboSimple -->
    <div class="combos-periodo">
      <ComboSimple
        v-model="mesSeleccionado"
        :items="mesesCombo"
        placeholder="Seleccionar mes"
        class="combo-mes"
        @update:modelValue="actualizarMes"
      />

      <ComboSimple
        v-model="añoSeleccionado"
        :items="añosCombo"
        placeholder="Seleccionar año"
        class="combo-año"
        @update:modelValue="actualizarAño"
      />
    </div>

    <!-- Controles adicionales -->
    <div class="controles-periodo">
      <button @click="establecerHoy" class="btn-periodo btn-hoy" title="Mes/año actual">
        📅 Hoy
      </button>

      <button
        @click="limpiarSeleccion"
        class="btn-periodo btn-limpiar"
        title="Limpiar selección"
        :disabled="!haySeleccion"
      >
        ✕ Limpiar
      </button>
    </div>

    <!-- Indicador visual de la selección -->
    <div v-if="periodoCompleto" class="indicador-periodo">
      <span class="texto-periodo">{{ textoSeleccion }}</span>
      <span v-if="esPeriodoFuturo" class="badge-futuro">Futuro</span>
    </div>

    <!-- Información adicional si está conectado al store -->
    <div v-if="conectarStore && periodoStore?.fechaActual" class="info-store">
      <small class="texto-muted"> Período sincronizado con el store </small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ComboSimple from '@/components/ComboSimple.vue'
import { usePeriodoData } from '@/composables/usePeriodoData.js'
import { usePeriodoStore } from '@/stores/filters/periodo.js'

// Props
const props = defineProps({
  // Valores iniciales
  mesInicial: {
    type: [Number, String],
    default: null,
  },
  añoInicial: {
    type: [Number, String],
    default: null,
  },

  // Configuración de años
  añoMinimo: {
    type: Number,
    default: 2020,
  },
  añoMaximo: {
    type: Number,
    default: 2030,
  },

  // Conexión con store
  conectarStore: {
    type: Boolean,
    default: true,
  },

  // Establecer período actual al montar
  iniciarConHoy: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:mes', 'update:año', 'cambio', 'periodo-completo'])

// Composables
const {
  mesesCombo,
  generarAños,
  añoActual,
  mesActual,
  obtenerNombreMes,
  generarFechasISO,
  validarPeriodo,
} = usePeriodoData()

// Store (condicional)
const periodoStore = props.conectarStore ? usePeriodoStore() : null

// Estado reactivo
const mesSeleccionado = ref(props.mesInicial || null)
const añoSeleccionado = ref(props.añoInicial || null)

// Data para combos
const añosCombo = computed(() => generarAños(props.añoMinimo, props.añoMaximo))

// Computados
const haySeleccion = computed(() => mesSeleccionado.value || añoSeleccionado.value)

const periodoCompleto = computed(() => mesSeleccionado.value && añoSeleccionado.value)

const textoSeleccion = computed(() => {
  if (!periodoCompleto.value) return ''
  const nombreMes = obtenerNombreMes(mesSeleccionado.value)
  return `${nombreMes} ${añoSeleccionado.value}`
})

const validacion = computed(() => validarPeriodo(mesSeleccionado.value, añoSeleccionado.value))

const esPeriodoFuturo = computed(() => validacion.value.esFuturo)

// Datos completos del período para emitir
const datosCompletos = computed(() => {
  const mes = parseInt(mesSeleccionado.value) || null
  const año = parseInt(añoSeleccionado.value) || null

  return {
    mes,
    año,
    mesNombre: mes ? obtenerNombreMes(mes) : null,
    textoCompleto: textoSeleccion.value,
    valido: validacion.value.periodoCompleto,
    ...generarFechasISO(mes, año),
    esFuturo: esPeriodoFuturo.value,
  }
})

// Métodos
function actualizarMes(nuevoMes) {
  mesSeleccionado.value = nuevoMes
  emitirCambios()
  sincronizarConStore()
}

function actualizarAño(nuevoAño) {
  añoSeleccionado.value = nuevoAño
  emitirCambios()
  sincronizarConStore()
}

function establecerHoy() {
  mesSeleccionado.value = mesActual
  añoSeleccionado.value = añoActual
  emitirCambios()
  sincronizarConStore()
}

function limpiarSeleccion() {
  mesSeleccionado.value = null
  añoSeleccionado.value = null
  emitirCambios()
  sincronizarConStore()
}

function emitirCambios() {
  const datos = datosCompletos.value

  // Emits individuales
  emit('update:mes', datos.mes)
  emit('update:año', datos.año)

  // Emit general
  emit('cambio', datos)

  // Emit especial cuando el período está completo
  if (datos.valido) {
    emit('periodo-completo', datos)
  }
}

function sincronizarConStore() {
  if (!periodoStore) return

  // Actualizar el store con los valores seleccionados
  periodoStore.establecerMesAño(mesSeleccionado.value, añoSeleccionado.value)
}

// Watchers
watch(
  () => props.mesInicial,
  (nuevoMes) => {
    if (nuevoMes !== mesSeleccionado.value) {
      mesSeleccionado.value = nuevoMes
    }
  },
)

watch(
  () => props.añoInicial,
  (nuevoAño) => {
    if (nuevoAño !== añoSeleccionado.value) {
      añoSeleccionado.value = nuevoAño
    }
  },
)

// Sincronizar con el store al cambiar la selección (bidireccional)
if (periodoStore) {
  watch(
    () => [periodoStore.mesSeleccionado, periodoStore.añoSeleccionado],
    ([nuevoMes, nuevoAño]) => {
      if (nuevoMes !== mesSeleccionado.value) {
        mesSeleccionado.value = nuevoMes
      }
      if (nuevoAño !== añoSeleccionado.value) {
        añoSeleccionado.value = nuevoAño
      }
    },
    { immediate: true },
  )
}

// Lifecycle
onMounted(() => {
  // Establecer período actual si está configurado
  if (props.iniciarConHoy && !haySeleccion.value) {
    establecerHoy()
  }

  // Sincronizar estado inicial con store
  if (haySeleccion.value) {
    sincronizarConStore()
  }
})

// Exponer métodos para uso desde el padre
defineExpose({
  establecerHoy,
  limpiarSeleccion,
  establecerPeriodo: (mes, año) => {
    mesSeleccionado.value = mes
    añoSeleccionado.value = año
    emitirCambios()
    sincronizarConStore()
  },
  obtenerDatos: () => datosCompletos.value,
})
</script>

<style scoped>
.selector-periodo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 280px;
}

.combos-periodo {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.combo-mes {
  flex: 1;
  min-width: 120px;
}

.combo-año {
  flex: 0 0 100px;
}

.controles-periodo {
  display: flex;
  gap: 0.5rem;
}

.btn-periodo {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-periodo:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-periodo:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-hoy {
  color: #059669;
  border-color: #d1fae5;
  background: #f0fdf4;
}

.btn-hoy:hover:not(:disabled) {
  background: #dcfce7;
  border-color: #a7f3d0;
}

.btn-limpiar {
  color: #dc2626;
  border-color: #fecaca;
  background: #fef2f2;
}

.btn-limpiar:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #fca5a5;
}

.indicador-periodo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.375rem;
}

.texto-periodo {
  font-weight: 500;
  color: #0c4a6e;
}

.badge-futuro {
  padding: 0.125rem 0.375rem;
  background: #fbbf24;
  color: #92400e;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.info-store {
  padding: 0.375rem;
  text-align: center;
}

.texto-muted {
  color: #6b7280;
  font-size: 0.75rem;
}

/* Responsive */
@media (max-width: 640px) {
  .combos-periodo {
    flex-direction: column;
  }

  .combo-año {
    flex: 1;
  }

  .controles-periodo {
    flex-direction: column;
  }
}
</style>
