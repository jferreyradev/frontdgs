<template>
  <div class="combo-avanzado" :class="{ 'has-error': hasError, 'is-loading': loading }">
    <!-- Label con indicador de requerido -->
    <label v-if="label" class="combo-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <!-- Input con búsqueda -->
    <div class="combo-input-wrapper">
      <div v-if="searchable" class="search-input-container">
        <input
          v-model="searchTerm"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          :disabled="loading || disabled"
          @focus="showDropdown = true"
          @blur="handleBlur"
          @keydown="handleKeydown"
          ref="searchInput"
        />
        <div class="combo-icons">
          <span v-if="loading" class="icon loading">⏳</span>
          <span v-else class="icon dropdown-arrow" :class="{ open: showDropdown }">▼</span>
        </div>
      </div>

      <!-- Select tradicional -->
      <select
        v-else
        :value="modelValue"
        @change="handleChange"
        :disabled="loading || disabled"
        class="combo-select"
        :class="{ 'has-value': modelValue }"
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="item in filteredItems" :key="item[valueKey]" :value="item[valueKey]">
          {{ formatLabel(item) }}
        </option>
      </select>

      <!-- Dropdown personalizado para búsqueda -->
      <div v-if="searchable && showDropdown" class="dropdown-list" ref="dropdown">
        <div v-if="filteredItems.length === 0" class="no-results">
          {{ noResultsText }}
        </div>
        <div
          v-else
          v-for="(item, index) in filteredItems"
          :key="item[valueKey]"
          class="dropdown-item"
          :class="{
            selected: item[valueKey] == modelValue,
            highlighted: index === highlightedIndex,
          }"
          @mousedown.prevent="selectItem(item)"
          @mouseenter="highlightedIndex = index"
        >
          <span class="item-label">{{ formatLabel(item) }}</span>
          <span v-if="item[descriptionKey]" class="item-description">
            {{ item[descriptionKey] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Estados y validación -->
    <div class="combo-feedback">
      <div v-if="loading" class="feedback loading">
        <span class="icon">⏳</span>
        <span>{{ loadingText }}</span>
      </div>

      <div v-if="error && !loading" class="feedback error">
        <span class="icon">❌</span>
        <span>{{ error }}</span>
      </div>

      <div v-if="validationError && !loading && !error" class="feedback validation-error">
        <span class="icon">⚠️</span>
        <span>{{ validationError }}</span>
      </div>

      <div v-if="helpText && !error && !validationError" class="feedback help">
        <span class="icon">💡</span>
        <span>{{ helpText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCombo } from '@/composables/useComboAvanzado.js'

// Props
const props = defineProps({
  // Básicos
  label: String,
  modelValue: [String, Number],
  placeholder: { type: String, default: 'Seleccione una opción' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },

  // API
  apiMethod: { type: String, required: true },
  storeName: { type: String, required: true },

  // Configuración de campos
  valueKey: { type: String, default: 'id' },
  labelKey: { type: String, default: 'nombre' },
  descriptionKey: String,

  // Búsqueda
  searchable: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Buscar...' },
  noResultsText: { type: String, default: 'Sin resultados' },

  // Carga
  autoLoad: { type: Boolean, default: true },
  loadingText: { type: String, default: 'Cargando...' },

  // Validación
  validator: Function,
  helpText: String,

  // Formateo
  labelFormatter: Function,

  // Opciones avanzadas
  clearable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  maxSelections: Number,
})

// Emits
defineEmits(['update:modelValue', 'change', 'select', 'clear', 'search'])

// Estado local
const searchTerm = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(-1)
const validationError = ref('')
const searchInput = ref(null)
const dropdown = ref(null)

// Composable
const { items, loading, error, cargar, buscar } = useCombo(props.storeName, props.apiMethod, {
  autoLoad: props.autoLoad,
  valueKey: props.valueKey,
  labelKey: props.labelKey,
})

// Computadas
const hasError = computed(() => !!error.value || !!validationError.value)

const filteredItems = computed(() => {
  if (!props.searchable || !searchTerm.value) {
    return items.value
  }

  return buscar(searchTerm.value, [props.labelKey, props.descriptionKey].filter(Boolean))
})

const selectedItem = computed(() => {
  if (!props.modelValue) return null
  return items.value.find((item) => item[props.valueKey] == props.modelValue)
})

// Métodos
function formatLabel(item) {
  if (props.labelFormatter) {
    return props.labelFormatter(item)
  }
  return item[props.labelKey] || `Item ${item[props.valueKey]}`
}

function handleChange(event) {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)

  const item = items.value.find((i) => i[props.valueKey] == value)
  if (item) {
    emit('select', item)
  }

  validateValue(value)
}

function selectItem(item) {
  const value = item[props.valueKey]
  emit('update:modelValue', value)
  emit('change', value)
  emit('select', item)

  if (props.searchable) {
    searchTerm.value = formatLabel(item)
    showDropdown.value = false
  }

  validateValue(value)
}

function handleKeydown(event) {
  if (!props.searchable) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (highlightedIndex.value < filteredItems.value.length - 1) {
        highlightedIndex.value++
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--
      }
      break

    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredItems.value[highlightedIndex.value]) {
        selectItem(filteredItems.value[highlightedIndex.value])
      }
      break

    case 'Escape':
      showDropdown.value = false
      break
  }
}

function handleBlur() {
  // Delay para permitir clicks en dropdown
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

function validateValue(value) {
  validationError.value = ''

  if (props.required && !value) {
    validationError.value = 'Este campo es requerido'
    return false
  }

  if (props.validator) {
    const result = props.validator(value, selectedItem.value)
    if (result !== true) {
      validationError.value = result || 'Valor inválido'
      return false
    }
  }

  return true
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (props.searchable && selectedItem.value) {
      searchTerm.value = formatLabel(selectedItem.value)
    }
  },
  { immediate: true },
)

watch(searchTerm, (newTerm) => {
  emit('search', newTerm)
  highlightedIndex.value = -1
})

// Lifecycle
onMounted(() => {
  if (props.modelValue && selectedItem.value && props.searchable) {
    searchTerm.value = formatLabel(selectedItem.value)
  }
})
</script>

<style scoped>
.combo-avanzado {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
}

.combo-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required-indicator {
  color: #dc2626;
  font-weight: bold;
}

.combo-input-wrapper {
  position: relative;
}

.search-input-container {
  position: relative;
}

.search-input,
.combo-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus,
.combo-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.combo-select.has-value {
  color: #111827;
}

.combo-icons {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon {
  font-size: 0.75rem;
  color: #6b7280;
}

.dropdown-arrow {
  transition: transform 0.2s;
  cursor: pointer;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s;
}

.dropdown-item:hover,
.dropdown-item.highlighted {
  background-color: #f9fafb;
}

.dropdown-item.selected {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.item-label {
  font-weight: 500;
}

.item-description {
  font-size: 0.75rem;
  color: #6b7280;
  display: block;
  margin-top: 0.125rem;
}

.no-results {
  padding: 0.75rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.combo-feedback {
  min-height: 1.25rem;
}

.feedback {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.feedback.loading {
  color: #6b7280;
}

.feedback.error,
.feedback.validation-error {
  color: #dc2626;
}

.feedback.help {
  color: #6b7280;
}

.combo-avanzado.has-error .search-input,
.combo-avanzado.has-error .combo-select {
  border-color: #dc2626;
}

.combo-avanzado.is-loading .search-input,
.combo-avanzado.is-loading .combo-select {
  background-color: #f9fafb;
  cursor: wait;
}

:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}
</style>
