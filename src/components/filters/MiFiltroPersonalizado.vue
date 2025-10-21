<!-- MiFiltroPersonalizado.vue - Ejemplo de filtro personalizado -->
<template>
  <div class="mi-filtro-personalizado">
    <h3>🎯 Mi Filtro Específico</h3>

    <FiltroLiqDinamico :combos="miConfiguracion" @filtro-cambiado="onFiltroCambiado" />

    <!-- Mostrar valores seleccionados -->
    <div v-if="mostrarDebug" class="debug-section">
      <h4>📊 Valores Seleccionados:</h4>
      <pre>{{ JSON.stringify(valoresActuales, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import FiltroLiqDinamico from './FiltroLiqDinamico.vue'

const props = defineProps({
  // Configurar qué filtros mostrar
  incluirUsuarios: {
    type: Boolean,
    default: true,
  },
  incluirDepartamentos: {
    type: Boolean,
    default: true,
  },
  incluirProvincias: {
    type: Boolean,
    default: false,
  },
  mostrarDebug: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['filtros-cambiados'])

const valoresActuales = ref({})

// 🎯 Configuración dinámica basada en props
const miConfiguracion = computed(() => {
  const combos = []

  // Siempre incluir tipos de liquidación
  combos.push({
    storeName: 'tiposLiquidacion',
    apiMethod: 'getTiposLiquidacion',
    label: 'Tipo Liquidación',
    valueKey: 'IDTIPOLIQUIDACION',
    labelKey: 'DESCRIPCION',
  })

  // Incluir usuarios si está habilitado
  if (props.incluirUsuarios) {
    combos.push({
      storeName: 'usuarios',
      apiMethod: 'getUsuarios',
      label: 'Usuario',
      valueKey: 'IDUSUARIO',
      labelKey: 'NOMBRE',
    })
  }

  // Incluir departamentos si está habilitado
  if (props.incluirDepartamentos) {
    combos.push({
      storeName: 'departamentos',
      apiMethod: 'getDepartamentos',
      label: 'Departamento',
      valueKey: 'IDDEPARTAMENTO',
      labelKey: 'DESCRIPCION',
    })
  }

  // Incluir provincias si está habilitado
  if (props.incluirProvincias) {
    combos.push({
      storeName: 'provincias',
      apiMethod: 'getProvincias',
      label: 'Provincia',
      valueKey: 'IDPROVINCIA',
      labelKey: 'DESCRIPCION',
    })
  }

  return combos
})

function onFiltroCambiado(evento) {
  console.log('🔄 Mi filtro personalizado - Cambio:', evento)

  // Actualizar valores actuales
  if (evento.tipo !== 'limpiar') {
    valoresActuales.value[evento.tipo] = evento.valor
  } else {
    valoresActuales.value = {}
  }

  // Emitir evento con todos los valores
  emits('filtros-cambiados', {
    evento: evento,
    todosLosValores: valoresActuales.value,
  })
}
</script>

<style scoped>
.mi-filtro-personalizado {
  padding: 15px;
  border: 2px solid #007bff;
  border-radius: 8px;
  margin: 10px 0;
}

.mi-filtro-personalizado h3 {
  margin-top: 0;
  color: #007bff;
}

.debug-section {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.debug-section h4 {
  margin-top: 0;
  color: #495057;
}

.debug-section pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  font-size: 12px;
  overflow-x: auto;
}
</style>
