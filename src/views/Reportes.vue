<template>
  <ReporteSimple
    titulo="Reporte de Procesos"
    :consulta="consultaSql"
    :variables="variablesConsulta"
    :mostrar-filtros="true"
  />
</template>

<script setup>
import { computed } from 'vue'
import ReporteSimple from '@/components/ReporteSimple.vue'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'

const filtros = useFiltrosActivosStore()

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
SELECT 
  ec.ID_EJEC_CAB,
  ec.PERIODO,
  ec.IDTIPOLIQ,
  ec.GRUPOREP,
  pc.DESCRIPCION as PROCESO,
  TO_CHAR(ec.FECHAHORA, 'DD/MM/YYYY HH24:MI') as FECHA_HORA,
  ed.ESTADO
FROM WORKFLOW.EJEC_CAB ec
INNER JOIN WORKFLOW.PROC_CAB pc ON pc.ID_PROC_CAB = ec.ID_PROC_CAB
INNER JOIN WORKFLOW.EJEC_DET ed ON ed.ID_EJEC_CAB = ec.ID_EJEC_CAB
WHERE 1=1
  AND (:PERIODO IS NULL OR ec.PERIODO = to_date(:PERIODO, 'DD/MM/YYYY'))
  AND (:TIPO IS NULL OR ec.IDTIPOLIQ = :TIPO)
  AND (:GRUPO IS NULL OR ec.GRUPOREP = :GRUPO)
ORDER BY ec.FECHAHORA DESC
`.trim()
</script>
