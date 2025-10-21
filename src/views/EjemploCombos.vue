<template>
  <div class="ejemplo-combos">
    <h2>📋 Ejemplos de Combos Simples</h2>

    <div class="grid-combos">
      <!-- Combo básico -->
      <ComboSimple
        label="Usuario"
        placeholder="Seleccione usuario"
        v-model="usuarioSeleccionado"
        api-method="getUsuarios"
        store-name="usuarios"
        value-key="id"
        label-key="nombre"
      />

      <!-- Combo de departamentos -->
      <ComboSimple
        label="Departamento"
        placeholder="Seleccione departamento"
        v-model="departamentoSeleccionado"
        api-method="getDepartamentos"
        store-name="departamentos"
        value-key="id"
        label-key="nombre"
      />

      <!-- Combo de provincias -->
      <ComboSimple
        label="Provincia"
        placeholder="Seleccione provincia"
        v-model="provinciaSeleccionada"
        api-method="getProvincias"
        store-name="provincias"
        value-key="id"
        label-key="nombre"
        @update:model-value="onProvinciaChange"
      />

      <!-- Combo de ciudades (dependiente de provincia) -->
      <ComboSimple
        label="Ciudad"
        placeholder="Seleccione ciudad"
        v-model="ciudadSeleccionada"
        api-method="getCiudades"
        store-name="ciudades"
        value-key="id"
        label-key="nombre"
        :auto-load="false"
        ref="comboCiudades"
      />

      <!-- Combo con composable personalizado -->
      <div class="combo-custom">
        <label>Cargo (con composable):</label>
        <select v-model="cargoSeleccionado" :disabled="cargos.loading">
          <option value="">Seleccione cargo</option>
          <option v-for="cargo in cargos.itemsOrdenados" :key="cargo.id" :value="cargo.id">
            {{ cargo.nombre }}
          </option>
        </select>
        <span v-if="cargos.loading">⏳ Cargando...</span>
        <span v-if="cargos.error">❌ {{ cargos.error }}</span>
      </div>
    </div>

    <!-- Mostrar valores seleccionados -->
    <div class="valores-seleccionados">
      <h3>🎯 Valores Seleccionados:</h3>
      <pre>{{ valoresSeleccionados }}</pre>
    </div>

    <!-- Botones de acción -->
    <div class="acciones">
      <button @click="limpiarTodo" class="btn-limpiar">🧹 Limpiar Todo</button>
      <button @click="mostrarEstadisticas" class="btn-stats">📊 Estadísticas</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ComboSimple from '@/components/ComboSimple.vue'
import { useCombo } from '@/composables/useCombo.js'

// Valores seleccionados
const usuarioSeleccionado = ref('')
const departamentoSeleccionado = ref('')
const provinciaSeleccionada = ref('')
const ciudadSeleccionada = ref('')
const cargoSeleccionado = ref('')

// Referencia al combo de ciudades
const comboCiudades = ref(null)

// Combo personalizado con composable
const cargos = useCombo('cargos', 'getCargos')

// Computed para mostrar valores
const valoresSeleccionados = computed(() => ({
  usuario: usuarioSeleccionado.value,
  departamento: departamentoSeleccionado.value,
  provincia: provinciaSeleccionada.value,
  ciudad: ciudadSeleccionada.value,
  cargo: cargoSeleccionado.value,
}))

// Watcher para cargar ciudades cuando cambia la provincia
watch(provinciaSeleccionada, async (nuevaProvincia) => {
  if (nuevaProvincia) {
    // Aquí podrías cargar las ciudades filtradas por provincia
    console.log('🌆 Cargando ciudades para provincia:', nuevaProvincia)
    // comboCiudades.value?.cargar(nuevaProvincia)
  }
  ciudadSeleccionada.value = '' // Limpiar ciudad al cambiar provincia
})

// Funciones
function onProvinciaChange(value) {
  console.log('📍 Provincia seleccionada:', value)
}

function limpiarTodo() {
  usuarioSeleccionado.value = ''
  departamentoSeleccionado.value = ''
  provinciaSeleccionada.value = ''
  ciudadSeleccionada.value = ''
  cargoSeleccionado.value = ''
  cargos.limpiar()
}

function mostrarEstadisticas() {
  const stats = {
    cargos: cargos.hasItems ? cargos.items.length : 0,
    seleccionados: Object.values(valoresSeleccionados.value).filter((v) => v).length,
  }
  alert(
    `📊 Estadísticas:\n- Cargos disponibles: ${stats.cargos}\n- Campos seleccionados: ${stats.seleccionados}`,
  )
}
</script>

<style scoped>
.ejemplo-combos {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-combos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.combo-custom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.combo-custom label {
  font-weight: 500;
  color: #374151;
}

.combo-custom select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
}

.valores-seleccionados {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.valores-seleccionados pre {
  margin: 0;
  font-size: 0.875rem;
}

.acciones {
  display: flex;
  gap: 1rem;
}

.btn-limpiar,
.btn-stats {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-limpiar {
  background: #ef4444;
  color: white;
}

.btn-stats {
  background: #3b82f6;
  color: white;
}

.btn-limpiar:hover,
.btn-stats:hover {
  opacity: 0.9;
}
</style>
