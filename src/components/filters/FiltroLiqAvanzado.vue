<!-- FiltroLiqAvanzado.vue - Usando el composable dinámico -->
<template>
  <div class="panel-filtros-avanzado">
    <!-- Controles de configuración (opcional - solo en desarrollo) -->
    <div v-if="showControls" class="controles-desarrollo">
      <h4>🛠️ Controles de Desarrollo</h4>
      <div class="controles-grid">
        <button @click="agregarComboUsuarios" class="btn-control">+ Agregar Usuarios</button>
        <button @click="agregarComboDepartamentos" class="btn-control">
          + Agregar Departamentos
        </button>
        <button @click="agregarComboSicore" class="btn-control">+ Agregar SICORE</button>
        <button @click="limpiarTodosCombos" class="btn-control btn-danger">
          🗑️ Limpiar Combos
        </button>
      </div>

      <div class="estadisticas">
        <span>📊 Total: {{ estadisticas.total }}</span>
        <span>✅ Activos: {{ estadisticas.activos }}</span>
        <span>📋 Con datos: {{ estadisticas.conDatos }}</span>
      </div>
    </div>

    <!-- Panel de filtros -->
    <div class="filtros-container">
      <!-- Período (siempre presente) -->
      <div class="filtro-campo">
        <label class="filtro-label">Período</label>
        <SelectorMesAño ref="selectorMesAñoRef" @cambio="onMesAñoCambiado" />
      </div>

      <!-- Combos dinámicos -->
      <div v-for="combo in combosActivos" :key="combo.id" class="filtro-campo">
        <ComboSimple
          :label="combo.label"
          :placeholder="combo.placeholder"
          v-model="valoresSeleccionados[combo.id]"
          :api-method="combo.apiMethod"
          :store-name="combo.storeName"
          :value-key="combo.valueKey"
          :label-key="combo.labelKey"
          @update:model-value="(value) => onComboChange(combo.id, value)"
        />

        <!-- Botón para remover combo (opcional) -->
        <button
          v-if="showControls"
          @click="removerCombo(combo.id)"
          class="btn-remover"
          title="Remover filtro"
        >
          ✖️
        </button>
      </div>

      <!-- Botón limpiar valores -->
      <div class="filtro-campo">
        <button @click="limpiarTodos" class="btn-limpiar">Limpiar</button>
      </div>
    </div>

    <!-- Debug info (opcional) -->
    <div v-if="showDebug" class="debug-info">
      <h5>🐛 Debug Info</h5>
      <pre>{{ JSON.stringify({ valoresSeleccionados, estadisticas }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import SelectorMesAño from './FiltroMesAño.vue'
import ComboSimple from '@/components/ComboSimple.vue'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'
import { useFiltrosDinamicos } from '@/composables/useFiltrosDinamicos.js'

const props = defineProps({
  // Configuraciones iniciales
  combosIniciales: {
    type: Array,
    default: () => [
      {
        id: 'tipos-liquidacion',
        storeName: 'tiposLiquidacion',
        apiMethod: 'getTiposLiquidacion',
        label: 'Tipo Liquidación',
        valueKey: 'IDTIPOLIQUIDACION',
        labelKey: 'DESCRIPCION',
        storeMethod: 'setTipoLiquidacion',
      },
      {
        id: 'grupos-reparticion',
        storeName: 'gruposReparticion',
        apiMethod: 'getGruposReparticion',
        label: 'Grupo Repartición',
        valueKey: 'IDGRUPO',
        labelKey: 'DESCRIPCION',
        storeMethod: 'setGrupoReparticion',
      },
    ],
  },
  // Controles de desarrollo
  showControls: {
    type: Boolean,
    default: false,
  },
  showDebug: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['filtro-cambiado', 'combo-agregado', 'combo-removido'])

const store = useFiltrosActivosStore()
const selectorMesAñoRef = ref(null)

// Usar composable dinámico
const {
  combosActivos,
  valoresSeleccionados,
  combosData,
  estadisticas,
  registrarCombo,
  desregistrarCombo,
  limpiarSelecciones,
  obtenerValorSeleccionado,
} = useFiltrosDinamicos()

// Inicializar combos
props.combosIniciales.forEach((config) => {
  registrarCombo(config)
})

// Funciones de eventos
function onMesAñoCambiado(seleccion) {
  console.log('📅 Período cambiado:', seleccion)

  if (seleccion && seleccion.mes && seleccion.año) {
    store.setPeriodo(seleccion)
  } else {
    store.setPeriodo(null)
  }

  emits('filtro-cambiado', { tipo: 'periodo', valor: seleccion })
}

function onComboChange(comboId, value) {
  console.log(`🔄 Combo ${comboId} cambiado:`, value)

  const item = obtenerValorSeleccionado(comboId)

  // Buscar método del store y ejecutarlo si existe
  const combo = combosActivos.value.find((c) => c.id === comboId)
  if (combo?.storeMethod && store[combo.storeMethod]) {
    const valorCompleto = combosData[comboId]?.buscarPor(value)
    store[combo.storeMethod](valorCompleto)
  }

  emits('filtro-cambiado', {
    tipo: comboId,
    valor: item,
    comboConfig: combo,
  })
}

function limpiarTodos() {
  console.log('🧹 Limpiando todos los filtros')
  store.limpiarTodos()
  limpiarSelecciones()

  if (selectorMesAñoRef.value) {
    selectorMesAñoRef.value.limpiarSeleccion()
  }

  emits('filtro-cambiado', { tipo: 'limpiar', valor: null })
}

// Funciones para agregar combos dinámicamente
function agregarComboUsuarios() {
  const id = registrarCombo({
    id: 'usuarios',
    storeName: 'usuarios',
    apiMethod: 'getUsuarios',
    label: 'Usuario',
    valueKey: 'IDUSUARIO',
    labelKey: 'NOMBRE',
  })
  emits('combo-agregado', id)
}

function agregarComboDepartamentos() {
  const id = registrarCombo({
    id: 'departamentos',
    storeName: 'departamentos',
    apiMethod: 'getDepartamentos',
    label: 'Departamento',
    valueKey: 'IDDEPARTAMENTO',
    labelKey: 'DESCRIPCION',
  })
  emits('combo-agregado', id)
}

function agregarComboSicore() {
  const id = registrarCombo({
    id: 'grupos-sicore',
    storeName: 'gruposSicore',
    apiMethod: 'getGruposSicore',
    label: 'Grupo SICORE',
    valueKey: 'IDGRUPOSICORE',
    labelKey: 'DESCRIPCION',
    storeMethod: 'setGrupoSicore',
  })
  emits('combo-agregado', id)
}

function removerCombo(comboId) {
  const removido = desregistrarCombo(comboId)
  if (removido) {
    emits('combo-removido', comboId)
  }
}

function limpiarTodosCombos() {
  // Mantener solo los combos iniciales
  const idsIniciales = props.combosIniciales.map((c) => c.id)

  combosActivos.value.forEach((combo) => {
    if (!idsIniciales.includes(combo.id)) {
      desregistrarCombo(combo.id)
    }
  })
}

// Sincronizar cuando se limpian filtros desde otro lugar
watch(
  () => store.hayFiltrosActivos,
  (tieneFiltos, teniaFiltrosAntes) => {
    if (teniaFiltrosAntes && !tieneFiltos) {
      if (selectorMesAñoRef.value) {
        selectorMesAñoRef.value.limpiarSeleccion()
      }
    }
  },
)
</script>

<style scoped>
.panel-filtros-avanzado {
  margin: 10px 0;
}

.controles-desarrollo {
  background: #f8f9fa;
  border: 2px dashed #6c757d;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.controles-desarrollo h4 {
  margin: 0 0 10px 0;
  color: #495057;
}

.controles-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.btn-control {
  padding: 5px 10px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-control:hover {
  background: #0056b3;
}

.btn-control.btn-danger {
  background: #dc3545;
  border-color: #dc3545;
}

.btn-control.btn-danger:hover {
  background: #c82333;
}

.estadisticas {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #6c757d;
}

.filtros-container {
  display: flex;
  gap: 10px;
  align-items: end;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  flex-wrap: wrap;
}

.filtro-campo {
  flex: 1;
  min-width: 150px;
  max-width: 250px;
  padding: 5px 0;
  position: relative;
}

.filtro-label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.btn-remover {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remover:hover {
  background: #c82333;
}

.btn-limpiar {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  height: 34px;
  white-space: nowrap;
}

.btn-limpiar:hover {
  background-color: #c82333;
}

.debug-info {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 11px;
}

.debug-info h5 {
  margin: 0 0 10px 0;
}

.debug-info pre {
  margin: 0;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .filtros-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filtro-campo {
    max-width: none;
  }

  .controles-grid {
    flex-direction: column;
  }
}
</style>
