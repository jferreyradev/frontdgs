# Sistema de Reportes Simplificado

## 🎯 ReporteSimple.vue - Componente Único

### Uso Básico

```vue
<template>
  <ReporteSimple
    titulo="Mi Reporte"
    :consulta="miConsulta"
    :variables="misVariables"
    :mostrar-filtros="true"
  />
</template>

<script setup>
import ReporteSimple from '@/components/ReporteSimple.vue'

const misVariables = computed(() => ({
  periodo: '202410',
  tipo: 5,
  estado: 'ACTIVO',
}))

const miConsulta = `
SELECT * FROM tabla 
WHERE periodo = :PERIODO 
  AND tipo = :TIPO 
  AND estado = :ESTADO
`
</script>
```

### Props

- **titulo** (String): Título del reporte
- **consulta** (String): SQL con placeholders `:VARIABLE`
- **variables** (Object): Valores para reemplazar en la consulta
- **mostrarFiltros** (Boolean): Mostrar panel de filtros

### Placeholders

- `:VARIABLE` se reemplaza automáticamente con `variables.variable`
- Strings se envuelven en comillas automáticamente
- Valores null/undefined se convierten en `NULL`

### Ejemplo con Filtros Reactivos

```javascript
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'

const filtros = useFiltrosActivosStore()

const variablesReactivas = computed(() => ({
  periodo:
    filtros.periodoActivo?.mes && filtros.periodoActivo?.año
      ? `${filtros.periodoActivo.año}${String(filtros.periodoActivo.mes).padStart(2, '0')}`
      : null,
  tipo: filtros.tipoLiquidacionActivo?.IDTIPOLIQUIDACION || null,
  grupo: filtros.grupoReparticionActivo?.IDGRUPO || null,
}))
```

## ✅ Archivos Limpios

- **Componente único**: `ReporteSimple.vue`
- **Vista de ejemplo**: `Reportes.vue`
- **Sin dependencias obsoletas**
- **Código minimalista y mantenible**
