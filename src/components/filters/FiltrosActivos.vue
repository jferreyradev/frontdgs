<template>
  <div class="filtros-activos">
    <!-- Header compacto con toggle -->
    <div class="header" @click="toggleVisible">
      <div class="header-content">
        <span class="titulo">🔍 Filtros</span>
        <span class="contador" v-if="store.hayFiltrosActivos">({{ store.contadorFiltros }})</span>
        <span class="toggle-icon">{{ visible ? '▼' : '▶' }}</span>
      </div>
    </div>

    <!-- Contenido ocultable -->
    <div v-if="visible" class="contenido">
      <div v-if="store.hayFiltrosActivos" class="filtros-lista">
        <div
          v-if="store.periodoActivo && store.periodoActivo.mes && store.periodoActivo.año"
          class="filtro-item"
        >
          📅 {{ store.periodoActivo.mesNombre }} {{ store.periodoActivo.año }}
        </div>

        <div v-if="store.tipoLiquidacionActivo" class="filtro-item">
          📋
          {{ store.tipoLiquidacionActivo.descripcion || store.tipoLiquidacionActivo.DESCRIPCION }}
        </div>

        <div v-if="store.grupoReparticionActivo" class="filtro-item">
          🏢
          {{ store.grupoReparticionActivo.descripcion || store.grupoReparticionActivo.DESCRIPCION }}
        </div>

        <button @click.stop="limpiarTodos" class="btn-limpiar">✕ Limpiar</button>
      </div>

      <div v-else class="sin-filtros">
        <small>Sin filtros activos</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'

const store = useFiltrosActivosStore()
const visible = ref(false)

function toggleVisible() {
  visible.value = !visible.value
}

function limpiarTodos() {
  console.log('🧹 Botón limpiar presionado en FiltrosActivos')
  store.limpiarTodos()
}
</script>

<style scoped>
.filtros-activos {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 10px 0;
  overflow: hidden;
  max-width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e9ecef;
}

.header:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  color: #2c3e50;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
}

.titulo {
  flex: 1;
}

.contador {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin: 0 8px;
  font-weight: 600;
}

.toggle-icon {
  font-size: 12px;
  transition: transform 0.2s;
}

.contenido {
  padding: 10px;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filtro-item {
  background-color: #f8f9fa;
  padding: 8px 12px;
  margin: 6px 0;
  border-radius: 6px;
  border-left: 3px solid #1976d2;
  font-size: 13px;
  color: #495057;
  transition: background-color 0.2s ease;
}

.filtro-item:hover {
  background-color: #e3f2fd;
}

.btn-limpiar {
  background-color: #fff;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-limpiar:hover {
  background-color: #dc3545;
  color: white;
}

.sin-filtros {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 10px;
}

.sin-filtros small {
  font-size: 12px;
}
</style>
