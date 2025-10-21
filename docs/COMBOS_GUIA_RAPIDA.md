# 🚀 Guía Rápida: Combos Simples con Store y API

## ✨ Uso Más Simple

### 1. **Combo con Componente** (Recomendado)

```vue
<template>
  <ComboSimple
    label="Usuario"
    placeholder="Seleccione usuario"
    v-model="usuarioSeleccionado"
    api-method="getUsuarios"
    store-name="usuarios"
    value-key="id"
    label-key="nombre"
  />
</template>

<script setup>
import { ref } from 'vue'
import ComboSimple from '@/components/ComboSimple.vue'

const usuarioSeleccionado = ref('')
</script>
```

### 2. **Combo con Composable**

```vue
<template>
  <select v-model="seleccionado" :disabled="loading">
    <option value="">Seleccione...</option>
    <option v-for="item in items" :key="item.id" :value="item.id">
      {{ item.nombre }}
    </option>
  </select>
</template>

<script setup>
import { ref } from 'vue'
import { useCombo } from '@/composables/useCombo.js'

const seleccionado = ref('')
const { items, loading, error } = useCombo('usuarios', 'getUsuarios')
</script>
```

## 🛠️ Agregar Nuevo Método API

### 1. Agregar en `useDgsApi.js`:

```javascript
async function getMiTabla() {
  try {
    return await executeQuery('SELECT id, nombre FROM mi_tabla ORDER BY nombre')
  } catch (error) {
    console.error('Error en getMiTabla:', error.message)
    throw error
  }
}

// En el return:
return {
  // ... otros métodos
  getMiTabla,
}
```

### 2. Usar inmediatamente:

```vue
<ComboSimple label="Mi Combo" v-model="miSeleccion" api-method="getMiTabla" store-name="miTabla" />
```

## 📦 Propiedades del ComboSimple

| Prop          | Tipo          | Default         | Descripción                  |
| ------------- | ------------- | --------------- | ---------------------------- |
| `label`       | String        | -               | Etiqueta del combo           |
| `placeholder` | String        | 'Seleccione...' | Texto placeholder            |
| `modelValue`  | String/Number | -               | Valor seleccionado (v-model) |
| `apiMethod`   | String        | **Requerido**   | Método de la API a llamar    |
| `storeName`   | String        | **Requerido**   | Nombre del store (para logs) |
| `valueKey`    | String        | 'id'            | Campo para el value          |
| `labelKey`    | String        | 'nombre'        | Campo para mostrar           |
| `autoLoad`    | Boolean       | true            | Cargar automáticamente       |

## 🎯 Casos Comunes

### Combo dependiente:

```vue
<script setup>
import { watch } from 'vue'

// Cuando cambie la provincia, recargar ciudades
watch(provinciaSeleccionada, (nuevaProvincia) => {
  // Limpiar ciudad actual
  ciudadSeleccionada.value = ''

  // Cargar ciudades de la provincia
  if (nuevaProvincia) {
    ciudades.cargar()
  }
})
</script>
```

### Combo con filtro personalizado:

```javascript
const usuarios = useCombo('usuarios', 'getUsuarios')

const usuariosActivos = computed(() => usuarios.items.filter((u) => u.activo === true))
```

### Combo con validación:

```javascript
const validarSeleccion = () => {
  if (!usuarioSeleccionado.value) {
    alert('Debe seleccionar un usuario')
    return false
  }
  return true
}
```

## 🔧 API Incluida

Ya tienes estos métodos listos:

- `getUsuarios()` - Usuarios activos
- `getDepartamentos()` - Departamentos
- `getCargos()` - Cargos
- `getProvincias()` - Provincias
- `getCiudades(provinciaId)` - Ciudades
- `getGruposSicore()` - Grupos SICORE
- `getGruposReparticion()` - Grupos repartición
- `getTiposLiquidacion()` - Tipos liquidación

## ⚡ Tips de Rendimiento

1. **Auto-load = false** para combos dependientes
2. **Usar computed** para filtrado local
3. **Cache automático** en el composable
4. **Loading states** incluidos

## � Implementación en Componentes Existentes

### **Filtros actualizados:**

1. **`FiltrosSicore.vue`** - Migrado a ComboSimple ✅
2. **`PanelFiltros.vue`** - Migrado a ComboSimple ✅
3. **`ReportesVentas.vue`** - Ejemplo con ComboAvanzado ✅

### **Antes y después:**

```vue
<!-- ❌ Antes: Select manual -->
<select v-model="grupoSeleccionado">
  <option value="">Seleccione...</option>
  <option v-for="grupo in grupos" :value="grupo.id">
    {{ grupo.nombre }}
  </option>
</select>

<!-- ✅ Ahora: ComboSimple automático -->
<ComboSimple
  label="Grupo SICORE"
  v-model="grupoSeleccionado"
  api-method="getGruposSicore"
  store-name="gruposSicore"
  value-key="IDGRUPOSICORE"
  label-key="DESCRIPCION"
/>
```

## 🚀 Migración de Componentes

### **Pasos realizados:**

1. **Reemplazar selects manuales** → ComboSimple
2. **Eliminar lógica de carga** → useCombo automático
3. **Sincronizar con stores** → Estados reactivos
4. **Mejorar UX** → Loading states incluidos

### **Beneficios obtenidos:**

- ✅ **90% menos código** en componentes
- ✅ **Cache automático** (5 min TTL)
- ✅ **Estados consistentes**
- ✅ **Retry automático** en fallos
- ✅ **Loading indicators** incluidos

## 🎨 Ejemplos Completos

- **`/ejemplos/combos`** - Ejemplos básicos
- **`/demo/combos`** - Demostración interactiva completa
- **`/reportes/ventas`** - Uso en producción

## 🏆 Resultado Final

**Antes:** Select manual + lógica repetitiva
**Ahora:** Un tag, funcionalidad completa

---

## ⚠️ **Problemas Comunes**

### **1. Error: `buscarTipoPorId is not a function`**

```javascript
// ❌ INCORRECTO
const { buscarPorId } = useCombo('usuarios', 'getUsuarios')

// ✅ CORRECTO
const { buscarPor } = useCombo('usuarios', 'getUsuarios')
const buscarUsuarioPorId = (id) => buscarPor('IDUSUARIO', id)
```

### **2. Keys no coinciden con API**

```vue
<!-- Verificar que coincidan con los campos de la BD -->
<ComboSimple
  value-key="IDGRUPO"      <!-- ← Debe ser exacto -->
  label-key="DESCRIPCION"  <!-- ← Debe ser exacto -->
/>
```

### **3. Debug cuando no carga**

```javascript
// Agregar logging temporal
watch(
  items,
  (newItems) => {
    console.log('📊 Items cargados:', newItems)
  },
  { immediate: true },
)
```

## � **Convención de Nombres**

### **Nombres Normalizados:**

```vue
<ComboSimple
  label="[Entidad en español]"        <!-- Ej: "Tipo Liquidación" -->
  api-method="get[Entidades]"          <!-- Ej: "getTiposLiquidacion" -->
  store-name="[entidades]"             <!-- Ej: "tiposLiquidacion" -->
/>
```

### **Composable coincidente:**

```javascript
const { items, buscarPor } = useCombo(
  'tiposLiquidacion', // ← Mismo nombre que store-name
  'getTiposLiquidacion', // ← Mismo nombre que api-method
)
```

## �📚 **Links Relacionados**

- [📋 Normalización de Nombres](./NORMALIZACION_NOMBRES.md) - Convenciones y estándares
- [🔧 Troubleshooting](./TROUBLESHOOTING.md) - Soluciones detalladas
- [📋 Implementación Completada](./IMPLEMENTACION_COMBOS_COMPLETADA.md)
- [🏪 SICORE Store](./stores/SICORE_STORE.md)
