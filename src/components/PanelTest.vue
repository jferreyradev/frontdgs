<script setup>
import { useDgsApi } from '@/composables/useDgsApi.js'
import { useFiltrosStore } from '@/stores/filtros'
import SelectorMesAño from './SelectorMesAño.vue'
import FiltrosActivos from './FiltrosActivos.vue'
import { onMounted, ref } from 'vue'

const { verificarConexion, getPeriodoActivo, getTiposLiquidacion, getGruposReparticion } =
  useDgsApi()

const data = ref(null)
const periodo = ref(null)
const tipos = ref(null)
const grupos = ref(null)

const idLiq = ref(null)
const idGrupo = ref(null)

// Datos del selector de mes y año
const seleccionMesAño = ref({})
const selectorMesAñoRef = ref(null)

const filtrosStore = useFiltrosStore()

async function carga() {
  data.value = await verificarConexion()
  periodo.value = await getPeriodoActivo()
  tipos.value = await getTiposLiquidacion()
  grupos.value = await getGruposReparticion()

  // Actualizar el store con los datos obtenidos
  if (periodo.value && periodo.value.length > 0) {
    filtrosStore.setPeriodo(periodo.value[0])
  }
  if (tipos.value && tipos.value.length > 0) {
    filtrosStore.setTipos(tipos.value[0])
  }
  if (grupos.value && grupos.value.length > 0) {
    filtrosStore.setGrupos(grupos.value[0])
  }
}

onMounted(() => {
  carga()
})

function verFiltros() {
  console.log('Filtros Aplicados:')
  console.log('Período seleccionado:', seleccionMesAño.value)
  console.log('Tipo de Liquidación:', idLiq.value)
  console.log('Grupo de Repartición:', idGrupo.value)

  // Mostrar información detallada si hay selección de período
  if (seleccionMesAño.value.mes && seleccionMesAño.value.año) {
    console.log(`Período: ${seleccionMesAño.value.mesNombre} ${seleccionMesAño.value.año}`)
    console.log(`Fechas: ${seleccionMesAño.value.fechaInicio} - ${seleccionMesAño.value.fechaFin}`)
  }
}

// Función para manejar cambios en el selector de mes y año
function onMesAñoCambiado(seleccion) {
  seleccionMesAño.value = seleccion
  console.log('Período actualizado:', seleccion)
}

// Funciones para limpiar filtros individuales
function limpiarPeriodo() {
  if (selectorMesAñoRef.value) {
    selectorMesAñoRef.value.limpiarSeleccion()
  }
  seleccionMesAño.value = {}
}

function limpiarTipoLiquidacion() {
  idLiq.value = null
}

function limpiarGrupoReparticion() {
  idGrupo.value = null
}

function limpiarTodosFiltros() {
  if (selectorMesAñoRef.value) {
    selectorMesAñoRef.value.limpiarSeleccion()
  }
  seleccionMesAño.value = {}
  idLiq.value = null
  idGrupo.value = null
}
</script>

<template>
  <div style="padding: 15px; max-width: 1200px; margin: 0 auto">
    <h2 style="margin: 0 0 12px 0; font-size: 18px">Panel de Filtros</h2>

    <!-- Fila de filtros -->
    <div
      style="
        display: flex;
        gap: 10px;
        align-items: end;
        margin: 10px 0;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
      "
    >
      <!-- Período -->
      <div style="flex: 1; min-width: 180px">
        <label
          style="
            display: block;
            margin-bottom: 3px;
            font-weight: bold;
            color: #333;
            font-size: 14px;
          "
        >
          Período
        </label>
        <SelectorMesAño
          ref="selectorMesAñoRef"
          :año-minimo="2020"
          :año-maximo="2030"
          :auto-hoy="false"
          @cambio="onMesAñoCambiado"
        />
      </div>

      <!-- Tipo de Liquidación -->
      <div style="flex: 1; min-width: 180px">
        <label
          style="
            display: block;
            margin-bottom: 3px;
            font-weight: bold;
            color: #333;
            font-size: 14px;
          "
        >
          Tipo de Liquidación
        </label>
        <select
          v-model="idLiq"
          style="
            width: 100%;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 13px;
          "
        >
          <option value="">Seleccione tipo</option>
          <option
            v-for="tipo in tipos"
            :key="tipo['IDTIPOLIQUIDACION']"
            :value="tipo['IDTIPOLIQUIDACION']"
          >
            {{ tipo['DESCRIPCION'] }}
          </option>
        </select>
      </div>

      <!-- Grupo de Repartición -->
      <div style="flex: 1; min-width: 180px">
        <label
          style="
            display: block;
            margin-bottom: 3px;
            font-weight: bold;
            color: #333;
            font-size: 14px;
          "
        >
          Grupo de Repartición
        </label>
        <select
          v-model="idGrupo"
          style="
            width: 100%;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 13px;
          "
        >
          <option value="">Seleccione grupo</option>
          <option v-for="grupo in grupos" :key="grupo['IDGRUPO']" :value="grupo['IDGRUPO']">
            {{ grupo['DESCRIPCION'] }}
          </option>
        </select>
      </div>

      <!-- Botón aplicar -->
      <div style="flex: 0 0 auto">
        <button
          @click="verFiltros"
          style="
            padding: 8px 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            height: 34px;
            white-space: nowrap;
          "
        >
          Aplicar Filtros
        </button>
      </div>
    </div>

    <!-- Componente para mostrar filtros activos -->
    <FiltrosActivos
      :periodo="seleccionMesAño"
      :tipo-liquidacion-id="idLiq"
      :grupo-reparticion-id="idGrupo"
      :tipos-liquidacion="tipos || []"
      :grupos-reparticion="grupos || []"
      @limpiar-periodo="limpiarPeriodo"
      @limpiar-tipo-liquidacion="limpiarTipoLiquidacion"
      @limpiar-grupo-reparticion="limpiarGrupoReparticion"
      @limpiar-todos-filtros="limpiarTodosFiltros"
    />
  </div>
</template>
