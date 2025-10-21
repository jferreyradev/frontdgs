<template>
  <!-- 🚀 FiltroLiq mejorado con sistema dinámico -->
  <FiltroLiqDinamico :combos="combosConfigurados" @filtro-cambiado="onFiltroCambiado" />
</template>

<script setup>
import { defineEmits } from 'vue'
import FiltroLiqDinamico from './FiltroLiqDinamico.vue'

const emits = defineEmits(['filtro-cambiado'])

// 🎯 Configuración de combos para FiltroLiq
// Puedes agregar o quitar combos según la necesidad
const combosConfigurados = [
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
]

// Reenviar eventos
function onFiltroCambiado(evento) {
  console.log('🔄 FiltroLiq - Filtro cambiado:', evento)
  emits('filtro-cambiado', evento)
}
</script>

<!-- 
🎯 Estilos manejados por FiltroLiqDinamico.vue
💡 Para personalizar estilos, editar FiltroLiqDinamico.vue
-->
