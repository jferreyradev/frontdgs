<template>
  <div v-if="hayFiltrosActivos" class="filtros-activos">
    <div class="header">
      <h4>
        <span class="icono">🔍</span>
        Filtros Activos
        <span class="contador-filtros">({{ contadorFiltros }})</span>
        <div class="botones-header">
          <button
            @click="toggleVisibilidad"
            class="btn-toggle"
            :title="visible ? 'Ocultar filtros' : 'Mostrar filtros'"
          >
            {{ visible ? '▼' : '▶' }}
          </button>
          <button
            @click="limpiarTodosFiltros"
            class="btn-limpiar-todo"
            title="Limpiar todos los filtros"
          >
            ✕
          </button>
        </div>
      </h4>
    </div>

    <div v-if="visible" class="filtros-lista">
      <!-- Filtro de Período -->
      <div v-if="periodo.mes && periodo.año" class="filtro-item">
        <span class="filtro-label">Período:</span>
        <span class="filtro-valor">{{ periodo.mesNombre }} {{ periodo.año }}</span>
        <button @click="limpiarPeriodo" class="btn-quitar" title="Quitar filtro de período">
          ✕
        </button>
      </div>

      <!-- Filtro de Tipo de Liquidación -->
      <div v-if="tipoLiquidacion.id" class="filtro-item">
        <span class="filtro-label">Tipo:</span>
        <span class="filtro-valor">{{ tipoLiquidacion.descripcion }}</span>
        <button @click="limpiarTipoLiquidacion" class="btn-quitar" title="Quitar filtro de tipo">
          ✕
        </button>
      </div>

      <!-- Filtro de Grupo de Repartición -->
      <div v-if="grupoReparticion.id" class="filtro-item">
        <span class="filtro-label">Grupo:</span>
        <span class="filtro-valor">{{ grupoReparticion.descripcion }}</span>
        <button @click="limpiarGrupoReparticion" class="btn-quitar" title="Quitar filtro de grupo">
          ✕
        </button>
      </div>
      <!-- Información adicional si hay período -->
      <div v-if="periodo.fechaInicio && periodo.fechaFin" class="info-adicional">
        <small> 📅 {{ periodo.fechaInicio }} - {{ periodo.fechaFin }} </small>
      </div>
    </div>
  </div>

  <div v-else class="sin-filtros">
    <span class="texto-sin-filtros">📋 No hay filtros aplicados</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Estado de visibilidad
const visible = ref(true)

// Props para recibir los datos de los filtros
const props = defineProps({
  periodo: {
    type: Object,
    default: () => ({}),
  },
  tipoLiquidacionId: {
    type: [String, Number],
    default: null,
  },
  grupoReparticionId: {
    type: [String, Number],
    default: null,
  },
  tiposLiquidacion: {
    type: Array,
    default: () => [],
  },
  gruposReparticion: {
    type: Array,
    default: () => [],
  },
})

// Eventos para comunicar cambios al componente padre
const emit = defineEmits([
  'limpiar-periodo',
  'limpiar-tipo-liquidacion',
  'limpiar-grupo-reparticion',
  'limpiar-todos-filtros',
])

// Computados para obtener información completa de los filtros
const tipoLiquidacion = computed(() => {
  if (!props.tipoLiquidacionId || !props.tiposLiquidacion.length) {
    return { id: null, descripcion: '' }
  }

  const tipo = props.tiposLiquidacion.find((t) => t.IDTIPOLIQUIDACION == props.tipoLiquidacionId)

  return {
    id: props.tipoLiquidacionId,
    descripcion: tipo ? tipo.DESCRIPCION : 'Desconocido',
  }
})

const grupoReparticion = computed(() => {
  if (!props.grupoReparticionId || !props.gruposReparticion.length) {
    return { id: null, descripcion: '' }
  }

  const grupo = props.gruposReparticion.find((g) => g.IDGRUPO == props.grupoReparticionId)

  return {
    id: props.grupoReparticionId,
    descripcion: grupo ? grupo.DESCRIPCION : 'Desconocido',
  }
})

const hayFiltrosActivos = computed(() => {
  return (
    (props.periodo.mes && props.periodo.año) || props.tipoLiquidacionId || props.grupoReparticionId
  )
})

const contadorFiltros = computed(() => {
  let contador = 0
  if (props.periodo.mes && props.periodo.año) contador++
  if (props.tipoLiquidacionId) contador++
  if (props.grupoReparticionId) contador++
  return contador
})

// Funciones para limpiar filtros individuales
function limpiarPeriodo() {
  emit('limpiar-periodo')
}

function limpiarTipoLiquidacion() {
  emit('limpiar-tipo-liquidacion')
}

function limpiarGrupoReparticion() {
  emit('limpiar-grupo-reparticion')
}

function limpiarTodosFiltros() {
  emit('limpiar-todos-filtros')
}

// Función para toggle de visibilidad
function toggleVisibilidad() {
  visible.value = !visible.value
}
</script>

<style scoped>
.filtros-activos {
  margin: 10px 0;
  padding: 8px 12px;
  background-color: #e8f4fd;
  border: 1px solid #b3d9ff;
  border-radius: 5px;
}

.sin-filtros {
  margin: 5px 0;
  padding: 6px 10px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-align: center;
}

.texto-sin-filtros {
  color: #6c757d;
  font-size: 12px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.header h4 {
  margin: 0;
  color: #0056b3;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.contador-filtros {
  font-size: 12px;
  color: #6c757d;
  font-weight: normal;
}

.botones-header {
  display: flex;
  gap: 4px;
  align-items: center;
}

.icono {
  font-size: 14px;
}

.btn-toggle {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 2px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-toggle:hover {
  background-color: #545b62;
}

.btn-limpiar-todo {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-limpiar-todo:hover {
  background-color: #c82333;
}

.filtros-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filtro-item {
  background-color: white;
  border: 1px solid #cce7ff;
  border-radius: 15px;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.filtro-label {
  font-weight: bold;
  color: #0056b3;
}

.filtro-valor {
  color: #333;
}

.btn-quitar {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  cursor: pointer;
  font-size: 9px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
}

.btn-quitar:hover {
  background-color: #545b62;
}

.info-adicional {
  margin-top: 6px;
  padding-top: 4px;
  border-top: 1px solid #cce7ff;
  color: #0056b3;
  font-size: 10px;
}
</style>
