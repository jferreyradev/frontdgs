<!-- FiltroConComposable.vue - Usando el composable dinámico -->
<template>
  <div class="filtro-con-composable">
    <h3>🎮 Filtro con Composable Dinámico</h3>

    <!-- Controles para agregar filtros -->
    <div class="controles">
      <button @click="agregarUsuarios" :disabled="yaExiste('usuarios')" class="btn-add">
        + Usuarios
      </button>
      <button @click="agregarDepartamentos" :disabled="yaExiste('departamentos')" class="btn-add">
        + Departamentos
      </button>
      <button @click="agregarProvincias" :disabled="yaExiste('provincias')" class="btn-add">
        + Provincias
      </button>
      <button @click="limpiarTodosCombos" class="btn-clear">🗑️ Limpiar Combos</button>
    </div>

    <!-- Estadísticas -->
    <div class="stats">
      <span>📊 Total: {{ estadisticas.total }}</span>
      <span>✅ Activos: {{ estadisticas.activos }}</span>
      <span>📋 Con datos: {{ estadisticas.conDatos }}</span>
    </div>

    <!-- Renderizar combos dinámicos -->
    <div class="filtros-container">
      <!-- Período fijo -->
      <div class="filtro-campo">
        <label class="filtro-label">Período</label>
        <input
          type="month"
          v-model="periodoSeleccionado"
          @change="onPeriodoChange"
          class="filtro-input"
        />
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

        <!-- Botón para remover -->
        <button @click="removerCombo(combo.id)" class="btn-remove" title="Remover filtro">
          ✖️
        </button>
      </div>

      <!-- Botón limpiar valores -->
      <div class="filtro-campo">
        <button @click="limpiarSelecciones" class="btn-limpiar">🧹 Limpiar Valores</button>
      </div>
    </div>

    <!-- Resultados -->
    <div class="resultados">
      <h4>📋 Filtros Aplicados:</h4>
      <div v-if="periodoSeleccionado" class="filtro-activo">
        <strong>Período:</strong> {{ periodoSeleccionado }}
      </div>
      <div v-for="(valor, id) in valoresConDatos" :key="id" class="filtro-activo">
        <strong>{{ obtenerCombo(id)?.label }}:</strong>
        {{ obtenerValorSeleccionado(id)?.DESCRIPCION || obtenerValorSeleccionado(id)?.NOMBRE }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
import { useFiltrosDinamicos } from '@/composables/useFiltrosDinamicos.js'
import ComboSimple from '@/components/ComboSimple.vue'

const emits = defineEmits(['filtro-aplicado'])

// Usar composable dinámico
const {
  combosActivos,
  valoresSeleccionados,
  estadisticas,
  registrarCombo,
  desregistrarCombo,
  limpiarSelecciones,
  obtenerCombo,
  obtenerValorSeleccionado,
} = useFiltrosDinamicos()

const periodoSeleccionado = ref('')

// Computadas
const valoresConDatos = computed(() => {
  const resultado = {}
  Object.keys(valoresSeleccionados).forEach((id) => {
    if (valoresSeleccionados[id]) {
      resultado[id] = valoresSeleccionados[id]
    }
  })
  return resultado
})

// Funciones
function yaExiste(id) {
  return combosActivos.value.some((combo) => combo.id === id)
}

function agregarUsuarios() {
  registrarCombo({
    id: 'usuarios',
    storeName: 'usuarios',
    apiMethod: 'getUsuarios',
    label: 'Usuario',
    placeholder: 'Seleccione usuario',
    valueKey: 'IDUSUARIO',
    labelKey: 'NOMBRE',
  })
  console.log('✅ Filtro de usuarios agregado')
}

function agregarDepartamentos() {
  registrarCombo({
    id: 'departamentos',
    storeName: 'departamentos',
    apiMethod: 'getDepartamentos',
    label: 'Departamento',
    placeholder: 'Seleccione departamento',
    valueKey: 'IDDEPARTAMENTO',
    labelKey: 'DESCRIPCION',
  })
  console.log('✅ Filtro de departamentos agregado')
}

function agregarProvincias() {
  registrarCombo({
    id: 'provincias',
    storeName: 'provincias',
    apiMethod: 'getProvincias',
    label: 'Provincia',
    placeholder: 'Seleccione provincia',
    valueKey: 'IDPROVINCIA',
    labelKey: 'DESCRIPCION',
  })
  console.log('✅ Filtro de provincias agregado')
}

function removerCombo(id) {
  desregistrarCombo(id)
  console.log(`🗑️ Filtro ${id} removido`)
}

function limpiarTodosCombos() {
  // Remover todos los combos
  combosActivos.value.forEach((combo) => {
    desregistrarCombo(combo.id)
  })
  console.log('🗑️ Todos los combos removidos')
}

function onPeriodoChange() {
  console.log('📅 Período seleccionado:', periodoSeleccionado.value)
  emitirFiltroAplicado()
}

function onComboChange(comboId, value) {
  console.log(`🔄 Combo ${comboId} cambió:`, value)
  emitirFiltroAplicado()
}

function emitirFiltroAplicado() {
  const filtrosAplicados = {
    periodo: periodoSeleccionado.value,
    combos: {},
  }

  // Recopilar valores de combos
  Object.keys(valoresConDatos.value).forEach((id) => {
    const valor = obtenerValorSeleccionado(id)
    if (valor) {
      filtrosAplicados.combos[id] = valor
    }
  })

  emits('filtro-aplicado', filtrosAplicados)
}
</script>

<style scoped>
.filtro-con-composable {
  padding: 20px;
  border: 2px solid #28a745;
  border-radius: 8px;
  margin: 10px 0;
  background: #f8fff9;
}

.filtro-con-composable h3 {
  margin-top: 0;
  color: #28a745;
}

.controles {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.btn-add {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-add:hover:not(:disabled) {
  background: #218838;
}

.btn-add:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-clear {
  padding: 6px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-clear:hover {
  background: #c82333;
}

.stats {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #495057;
}

.filtros-container {
  display: flex;
  gap: 10px;
  align-items: end;
  padding: 15px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.filtro-campo {
  flex: 1;
  min-width: 150px;
  max-width: 200px;
  position: relative;
}

.filtro-label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
  color: #495057;
  font-size: 12px;
}

.filtro-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
}

.btn-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 18px;
  height: 18px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #c82333;
}

.btn-limpiar {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.btn-limpiar:hover {
  background: #545b62;
}

.resultados {
  padding: 15px;
  background: #e9ecef;
  border-radius: 5px;
}

.resultados h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #495057;
}

.filtro-activo {
  background: white;
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 3px;
  border-left: 3px solid #28a745;
  font-size: 13px;
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

  .controles {
    flex-direction: column;
  }
}
</style>
