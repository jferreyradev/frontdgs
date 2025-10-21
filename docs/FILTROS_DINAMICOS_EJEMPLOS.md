# 🎯 Implementación de Filtros Dinámicos - Ejemplos de Uso

## 🚀 **Enfoque 1: Configuración por Props**

### **Uso Básico:**

```vue
<template>
  <FiltroLiqDinamico :combos="miConfiguracion" @filtro-cambiado="onFiltroCambiado" />
</template>

<script setup>
import FiltroLiqDinamico from '@/components/filters/FiltroLiqDinamico.vue'

const miConfiguracion = [
  {
    storeName: 'tiposLiquidacion',
    apiMethod: 'getTiposLiquidacion',
    label: 'Tipo Liquidación',
    placeholder: 'Seleccione tipo...',
    valueKey: 'IDTIPOLIQUIDACION',
    labelKey: 'DESCRIPCION',
    storeProperty: 'tipoLiquidacionActivo',
    storeMethod: 'setTipoLiquidacion',
  },
  {
    storeName: 'gruposReparticion',
    apiMethod: 'getGruposReparticion',
    label: 'Grupo Repartición',
    placeholder: 'Seleccione grupo...',
    valueKey: 'IDGRUPO',
    labelKey: 'DESCRIPCION',
    storeProperty: 'grupoReparticionActivo',
    storeMethod: 'setGrupoReparticion',
  },
]

function onFiltroCambiado(evento) {
  console.log('Filtro cambiado:', evento)
}
</script>
```

### **Configuración Avanzada:**

```vue
<template>
  <!-- Para reportes de ventas -->
  <FiltroLiqDinamico :combos="configVentas" />

  <!-- Para análisis SICORE -->
  <FiltroLiqDinamico :combos="configSicore" />
</template>

<script setup>
// Configuración específica para ventas
const configVentas = [
  {
    storeName: 'vendedores',
    apiMethod: 'getUsuarios',
    label: 'Vendedor',
    valueKey: 'IDUSUARIO',
    labelKey: 'NOMBRE',
  },
  {
    storeName: 'departamentos',
    apiMethod: 'getDepartamentos',
    label: 'Departamento',
    valueKey: 'IDDEPARTAMENTO',
    labelKey: 'DESCRIPCION',
  },
  {
    storeName: 'provincias',
    apiMethod: 'getProvincias',
    label: 'Provincia',
    valueKey: 'IDPROVINCIA',
    labelKey: 'DESCRIPCION',
  },
]

// Configuración específica para SICORE
const configSicore = [
  {
    storeName: 'tiposLiquidacion',
    apiMethod: 'getTiposLiquidacion',
    label: 'Tipo Liquidación',
    valueKey: 'IDTIPOLIQUIDACION',
    labelKey: 'DESCRIPCION',
    storeMethod: 'setTipoLiquidacion',
  },
  {
    storeName: 'gruposSicore',
    apiMethod: 'getGruposSicore',
    label: 'Grupo SICORE',
    valueKey: 'IDGRUPOSICORE',
    labelKey: 'DESCRIPCION',
    storeMethod: 'setGrupoSicore',
  },
]
</script>
```

---

## 🎮 **Enfoque 2: Composable Dinámico**

### **Uso del Composable:**

```vue
<template>
  <div>
    <!-- Botones para agregar combos -->
    <div class="controles">
      <button @click="agregarUsuarios">+ Usuarios</button>
      <button @click="agregarDepartamentos">+ Departamentos</button>
      <button @click="removerCombo('usuarios')">- Usuarios</button>
    </div>

    <!-- Renderizar combos dinámicamente -->
    <div class="filtros">
      <div v-for="combo in combosActivos" :key="combo.id">
        <ComboSimple
          :label="combo.label"
          v-model="valoresSeleccionados[combo.id]"
          :api-method="combo.apiMethod"
          :store-name="combo.storeName"
          :value-key="combo.valueKey"
          :label-key="combo.labelKey"
        />
      </div>
    </div>

    <!-- Estadísticas -->
    <p>Combos activos: {{ estadisticas.activos }} / {{ estadisticas.total }}</p>
  </div>
</template>

<script setup>
import { useFiltrosDinamicos } from '@/composables/useFiltrosDinamicos.js'
import ComboSimple from '@/components/ComboSimple.vue'

const { combosActivos, valoresSeleccionados, estadisticas, registrarCombo, desregistrarCombo } =
  useFiltrosDinamicos()

function agregarUsuarios() {
  registrarCombo({
    id: 'usuarios',
    storeName: 'usuarios',
    apiMethod: 'getUsuarios',
    label: 'Usuario',
    valueKey: 'IDUSUARIO',
    labelKey: 'NOMBRE',
  })
}

function agregarDepartamentos() {
  registrarCombo({
    id: 'departamentos',
    storeName: 'departamentos',
    apiMethod: 'getDepartamentos',
    label: 'Departamento',
    valueKey: 'IDDEPARTAMENTO',
    labelKey: 'DESCRIPCION',
  })
}

function removerCombo(id) {
  desregistrarCombo(id)
}
</script>
```

---

## 🎛️ **Enfoque 3: Componente Avanzado**

### **Uso en Desarrollo:**

```vue
<template>
  <!-- Con controles de desarrollo -->
  <FiltroLiqAvanzado
    :show-controls="true"
    :show-debug="true"
    @combo-agregado="onComboAgregado"
    @combo-removido="onComboRemovido"
    @filtro-cambiado="onFiltroCambiado"
  />
</template>

<script setup>
function onComboAgregado(comboId) {
  console.log('✅ Combo agregado:', comboId)
}

function onComboRemovido(comboId) {
  console.log('🗑️ Combo removido:', comboId)
}

function onFiltroCambiado(evento) {
  console.log('🔄 Filtro cambiado:', evento)
}
</script>
```

### **Uso en Producción:**

```vue
<template>
  <!-- Sin controles, solo funcionalidad -->
  <FiltroLiqAvanzado :combos-iniciales="configPersonalizada" @filtro-cambiado="manejarCambio" />
</template>

<script setup>
const configPersonalizada = [
  {
    id: 'tipos-liq',
    storeName: 'tiposLiquidacion',
    apiMethod: 'getTiposLiquidacion',
    label: 'Tipo Liquidación',
    valueKey: 'IDTIPOLIQUIDACION',
    labelKey: 'DESCRIPCION',
  },
  // ... más configuraciones
]

function manejarCambio(evento) {
  // Lógica específica de la aplicación
  switch (evento.tipo) {
    case 'periodo':
      console.log('Período cambió:', evento.valor)
      break
    case 'tipos-liq':
      console.log('Tipo liquidación cambió:', evento.valor)
      break
  }
}
</script>
```

---

## 🔄 **Migración Gradual del FiltroLiq Original**

### **Paso 1: Reemplazar con versión dinámica básica**

```vue
<!-- Cambiar FiltroLiq.vue original por: -->
<template>
  <FiltroLiqDinamico />
  <!-- Usa configuración por defecto -->
</template>

<script setup>
import FiltroLiqDinamico from './FiltroLiqDinamico.vue'
</script>
```

### **Paso 2: Personalizar según necesidades**

```vue
<template>
  <FiltroLiqDinamico :combos="combosEspecificos" @filtro-cambiado="manejarCambios" />
</template>

<script setup>
import FiltroLiqDinamico from './FiltroLiqDinamico.vue'

// Solo los combos que realmente necesitas
const combosEspecificos = [
  {
    storeName: 'tiposLiquidacion',
    apiMethod: 'getTiposLiquidacion',
    label: 'Tipo Liquidación',
    valueKey: 'IDTIPOLIQUIDACION',
    labelKey: 'DESCRIPCION',
    storeMethod: 'setTipoLiquidacion',
  },
  // Agregar más según necesidad
]

function manejarCambios(evento) {
  // Tu lógica específica
}
</script>
```

---

## 🎯 **Casos de Uso Recomendados**

### **📋 Para Filtros Fijos:**

**Usa Enfoque 1** (Configuración por Props)

- Cuando sabes exactamente qué filtros necesitas
- Para interfaces estables de producción
- Máximo rendimiento y simplicidad

### **🎮 Para Filtros Dinámicos:**

**Usa Enfoque 2** (Composable)

- Cuando el usuario puede personalizar filtros
- Para dashboards configurables
- Interfaces adaptativas

### **🛠️ Para Desarrollo/Testing:**

**Usa Enfoque 3** (Componente Avanzado)

- Durante desarrollo para probar combinaciones
- Para demos interactivas
- Prototipado rápido

---

## 📊 **Beneficios de Cada Enfoque**

| Enfoque        | Flexibilidad | Rendimiento | Complejidad | Caso de Uso          |
| -------------- | ------------ | ----------- | ----------- | -------------------- |
| **Props**      | ⭐⭐⭐       | ⭐⭐⭐⭐⭐  | ⭐⭐        | Producción estable   |
| **Composable** | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐    | ⭐⭐⭐      | Interfaces dinámicas |
| **Avanzado**   | ⭐⭐⭐⭐⭐   | ⭐⭐⭐      | ⭐⭐⭐⭐    | Desarrollo/testing   |

**💡 Recomendación:** Comenzar con **Enfoque 1** para la mayoría de casos, y migrar a **Enfoque 2** cuando necesites más dinamismo.
