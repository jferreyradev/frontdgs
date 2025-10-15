<template>
  <div class="reportes-view">
    <h1>Reportes</h1>
    <div>
      <PanelFiltros></PanelFiltros>
    </div>
    <div class="contenido">
      <p>Aquí irán los reportes del sistema DGS</p>
      <div class="placeholder">
        <h3>Tipos de Reportes Disponibles:</h3>
        <ul>
          <li>Reporte de Liquidaciones</li>
          <li>Reporte de Grupos Repartición</li>
          <li>Reporte por Período</li>
          <li>Resumen Mensual</li>
        </ul>
      </div>
    </div>
  </div>
  <div><button @click="getReporte">Generar Reporte de Procesos</button></div>
</template>

<script setup>
import PanelFiltros from '@/components/filters/PanelFiltros.vue'
import { useDgsApi } from '@/composables/api/useDgsApi.js'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'
import { useFechaUtils } from '@/composables/useFechaUtils'

import DataTable from '@/components/DataTable.vue'

const { formatearFechaPrimerDia } = useFechaUtils()

const filtrosStore = useFiltrosActivosStore()

const { getReporteProcesos } = useDgsApi()

const { periodoActivo, tipoLiquidacionActivo, grupoReparticionActivo } = filtrosStore

async function getReporte() {
  console.log('Generando reporte con filtros:', {
    periodo: `TO_DATE('${formatearFechaPrimerDia(periodoActivo.mes, periodoActivo.año)}', 'DD/MM/YYYY')`,
    tipoLiquidacion: tipoLiquidacionActivo.IDTIPOLIQUIDACION,
    grupoReparticion: grupoReparticionActivo.IDGRUPO,
  })

  const filtros = {
    periodo: `TO_DATE('${formatearFechaPrimerDia(periodoActivo.mes, periodoActivo.año)}', 'DD/MM/YYYY')`,
    tipoLiquidacion: tipoLiquidacionActivo.IDTIPOLIQUIDACION,
    grupoReparticion: grupoReparticionActivo.IDGRUPO,
  }

  //const result =

  await getReporteProcesos({
    periodo: `TO_DATE('${formatearFechaPrimerDia(periodoActivo.mes, periodoActivo.año)}', 'DD/MM/YYYY')`,
    tipoLiquidacion: tipoLiquidacionActivo.IDTIPOLIQUIDACION,
    grupoReparticion: grupoReparticionActivo.IDGRUPO,
  })
  //console.log('Resultado del reporte de procesos:', result)
}
</script>

<style scoped>
.reportes-view {
  padding: 20px;
}

.contenido {
  margin-top: 20px;
}

.placeholder {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.placeholder h3 {
  margin-top: 0;
  color: #2c3e50;
}

.placeholder ul {
  margin: 15px 0;
}

.placeholder li {
  margin: 8px 0;
  color: #555;
}
</style>
