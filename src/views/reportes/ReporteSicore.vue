<template>
  <FiltrosSicore />
  <ReporteSimple
    titulo="Reporte de Procesos"
    :consulta="consultaSql"
    :variables="variablesConsulta"
    :mostrar-filtros="true"
    selection-mode="single"
    :showCheckboxes="false"
    @seleccion-cambio="manejarSeleccion"
  />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import ReporteSimple from '@/components/ReporteSimple.vue'
import FiltrosSicore from '@/components/filters/FiltrosSicore.vue'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'
import { useSicoreStore } from '@/stores/sicore.js'

const filtros = useFiltrosActivosStore()
const sicoreStore = useSicoreStore()

// Estado para manejar la selección
const filaSeleccionada = ref(null)
const filasSeleccionadas = ref([])

// Cargar datos de SICORE al montar el componente
onMounted(async () => {
  await sicoreStore.cargarGrupos()
})

// Función para manejar la selección
const manejarSeleccion = (seleccion) => {
  console.log('📋 Selección recibida:', seleccion)

  // Para modo single
  if (seleccion.cantidad === 1) {
    filaSeleccionada.value = seleccion.datos[0]
    console.log('🎯 Fila seleccionada:', filaSeleccionada.value)
  } else if (seleccion.cantidad === 0) {
    filaSeleccionada.value = null
  }

  // Para modo multiple
  filasSeleccionadas.value = seleccion.datos
  console.log('📊 Total seleccionadas:', seleccion.cantidad)
}

// Variables que se pasarán a la consulta
const variablesConsulta = computed(() => {
  const periodo = `01/${String(filtros.periodoActivo?.mes).padStart(2, '0')}/${filtros.periodoActivo?.año}`
  return {
    periodo: periodo,
    tipo: filtros.tipoLiquidacionActivo?.IDTIPOLIQUIDACION || null,
  }
})

// Consulta SQL con placeholders generalizados
const consultaSql = `
SELECT * 
FROM USUARIO.GAN_SICORE S
WHERE 1=1 
  AND (:PERIODO IS NULL OR S.PERIODO = to_date(:PERIODO, 'DD/MM/YYYY'))
  AND (:TIPO IS NULL OR S.IDTIPOLIQUIDACION = :TIPO)
`.trim()
</script>
