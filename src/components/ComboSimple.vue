<template>
  <div class="combo-simple">
    <label v-if="label" class="combo-label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="loading"
      class="combo-select"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="item in items" :key="item[valueKey]" :value="item[valueKey]">
        {{ item[labelKey] }}
      </option>
    </select>
    <span v-if="loading" class="combo-loading">⏳</span>
    <span v-if="error" class="combo-error">❌ {{ error }}</span>
  </div>
</template>

<script setup>
import { useCombo } from '@/composables/useCombo.js'

// Props
const props = defineProps({
  label: String,
  placeholder: {
    type: String,
    default: 'Seleccione una opción',
  },
  modelValue: [String, Number],
  apiMethod: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  valueKey: {
    type: String,
    default: 'id',
  },
  labelKey: {
    type: String,
    default: 'nombre',
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
})

// Emits
defineEmits(['update:modelValue'])

// Usar el composable
const { items, loading, error } = useCombo(props.storeName, props.apiMethod, {
  autoLoad: props.autoLoad,
  valueKey: props.valueKey,
  labelKey: props.labelKey,
})
</script>

<style scoped>
.combo-simple {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.combo-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.combo-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.combo-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.combo-select:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.combo-loading {
  font-size: 0.75rem;
  color: #6b7280;
}

.combo-error {
  font-size: 0.75rem;
  color: #dc2626;
}
</style>
