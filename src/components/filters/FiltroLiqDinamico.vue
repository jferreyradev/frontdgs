<!-- FiltroLiqDinamico.vue - Componente configurable por props -->
<template>
  <div class="panel-filtros">
    <div class="filtros-container">
      <!-- Período (siempre presente) -->
      <div class="filtro-campo">
        <label class="filtro-label">Período</label>
        <SelectorMesAño ref="selectorMesAñoRef" @cambio="onMesAñoCambiado" />
      </div>

      <!-- Combos dinámicos -->
      <div v-for="combo in combosActivos" :key="combo.storeName" class="filtro-campo">
        <ComboSimple
          :label="combo.label"
          :placeholder="combo.placeholder"
          v-model="valoresSeleccionados[combo.storeName]"
          :api-method="combo.apiMethod"
          :store-name="combo.storeName"
          :value-key="combo.valueKey"
          :label-key="combo.labelKey"
          @update:model-value="(value) => onComboChange(combo, value)"
        />
      </div>

      <!-- Botón limpiar -->
      <div class="filtro-campo">
        <button @click="limpiarTodos" class="btn-limpiar">Limpiar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import SelectorMesAño from './FiltroMesAño.vue'
import ComboSimple from '@/components/ComboSimple.vue'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'
import { useCombo } from '@/composables/useCombo.js'

// Props para configurar los combos
const props = defineProps({
  /**
   * Configuración de combos a mostrar
   * @type {Array<Object>}
   * @example
   * [
   *   {
   *     storeName: 'tiposLiquidacion',
   *     apiMethod: 'getTiposLiquidacion',
   *     label: 'Tipo Liquidación',
   *     placeholder: 'Seleccione tipo...',
   *     valueKey: 'IDTIPOLIQUIDACION',
   *     labelKey: 'DESCRIPCION',
   *     storeProperty: 'tipoLiquidacionActivo',
   *     storeMethod: 'setTipoLiquidacion'
   *   }
   * ]
   */
  combos: {
    type: Array,
    default: () => [
      {
        storeName: 'tiposLiquidacion',
        apiMethod: 'getTiposLiquidacion',
        label: 'Tipo Liquidación',
        placeholder: 'Seleccione tipo de liquidación',
        valueKey: 'IDTIPOLIQUIDACION',
        labelKey: 'DESCRIPCION',
        storeProperty: 'tipoLiquidacionActivo',
        storeMethod: 'setTipoLiquidacion',
      },
      {
        storeName: 'gruposReparticion',
        apiMethod: 'getGruposReparticion',
        label: 'Grupo Repartición',
        placeholder: 'Seleccione grupo de repartición',
        valueKey: 'IDGRUPO',
        labelKey: 'DESCRIPCION',
        storeProperty: 'grupoReparticionActivo',
        storeMethod: 'setGrupoReparticion',
      },
    ],
  },
})

const emits = defineEmits(['filtro-cambiado'])

const store = useFiltrosActivosStore()
const selectorMesAñoRef = ref(null)

// Estados reactivos
const valoresSeleccionados = ref({})
const combosData = ref({})

// Computada para combos activos
const combosActivos = computed(() => {
  return props.combos.filter((combo) => combo.enabled !== false)
})

// Inicializar composables dinámicamente
combosActivos.value.forEach((combo) => {
  const { items, buscarPor } = useCombo(combo.storeName, combo.apiMethod)

  combosData.value[combo.storeName] = {
    items,
    buscarPor: (id) => buscarPor(combo.valueKey, id),
  }

  // Inicializar valor seleccionado
  valoresSeleccionados.value[combo.storeName] = ''

  // Sincronizar con store
  if (combo.storeProperty) {
    watch(
      () => store[combo.storeProperty],
      (nuevoValor) => {
        valoresSeleccionados.value[combo.storeName] = nuevoValor?.[combo.valueKey] || ''
      },
      { immediate: true },
    )
  }
})

// Funciones
function onMesAñoCambiado(seleccion) {
  console.log('📅 Período cambiado:', seleccion)

  if (seleccion && seleccion.mes && seleccion.año) {
    store.setPeriodo(seleccion)
  } else {
    store.setPeriodo(null)
  }

  emits('filtro-cambiado', { tipo: 'periodo', valor: seleccion })
}

function onComboChange(combo, value) {
  console.log(`🔄 ${combo.label} cambiado:`, value)

  const item = combosData.value[combo.storeName]?.buscarPor(value)

  // Actualizar store si tiene método configurado
  if (combo.storeMethod && store[combo.storeMethod]) {
    store[combo.storeMethod](item)
  }

  emits('filtro-cambiado', {
    tipo: combo.storeName,
    valor: item,
    config: combo,
  })
}

function limpiarTodos() {
  console.log('🧹 Limpiando todos los filtros')
  store.limpiarTodos()

  // Limpiar estados locales
  Object.keys(valoresSeleccionados.value).forEach((key) => {
    valoresSeleccionados.value[key] = ''
  })

  // Limpiar selector de período
  if (selectorMesAñoRef.value) {
    selectorMesAñoRef.value.limpiarSeleccion()
  }

  emits('filtro-cambiado', { tipo: 'limpiar', valor: null })
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
.panel-filtros {
  margin: 10px 0;
}

.filtros-container {
  display: flex;
  gap: 10px;
  align-items: end;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  flex-wrap: wrap; /* Permite que se ajusten en múltiples filas */
}

.filtro-campo {
  flex: 1;
  min-width: 150px;
  max-width: 250px; /* Evita que se hagan muy anchos */
  padding: 5px 0;
}

.filtro-label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
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

/* Responsive */
@media (max-width: 768px) {
  .filtros-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filtro-campo {
    max-width: none;
  }
}
</style>
