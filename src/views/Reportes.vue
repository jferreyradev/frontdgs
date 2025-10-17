<template>
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
import { computed, ref } from 'vue'
import ReporteSimple from '@/components/ReporteSimple.vue'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'

const filtros = useFiltrosActivosStore()

// Estado para manejar la selección
const filaSeleccionada = ref(null)
const filasSeleccionadas = ref([])

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
    grupo: filtros.grupoReparticionActivo?.IDGRUPO || null,
  }
})

// Consulta SQL con placeholders generalizados
const consultaSql = `
SELECT ec.ID_EJEC_CAB, to_char(ec.PERIODO, 'DD/MM/YYYY') as PERIODO,   
  pc.DESCRIPCION as PROCESO, pd.descripcion as PROCESO_DETALLE,
  ec.FECHAHORA as FECHA_HORA,
  ed.ESTADO, ed.NROEJEC as EJECUCIONES
FROM WORKFLOW.EJEC_CAB ec
INNER JOIN WORKFLOW.PROC_CAB pc ON pc.ID_PROC_CAB = ec.ID_PROC_CAB
INNER JOIN WORKFLOW.EJEC_DET ed ON ed.ID_EJEC_CAB = ec.ID_EJEC_CAB
inner join WORKFLOW.PROC_DET pd on PD.ID_PROC_DET = ED.ID_PROC_DET
WHERE 1=1
  AND (:PERIODO IS NULL OR ec.PERIODO = to_date(:PERIODO, 'DD/MM/YYYY'))
  AND (:TIPO IS NULL OR ec.IDTIPOLIQ = :TIPO)
  AND (:GRUPO IS NULL OR ec.GRUPOREP = :GRUPO)
ORDER BY ec.fechahora, ED.ORDENEJEC
`.trim()
</script>
