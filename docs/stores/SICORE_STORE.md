# 🏛️ Store SICORE

Store de Pinia para la gestión de grupos SICORE en la aplicación DGS.

## 📋 Funcionalidades

### Estados Reactivos

- `grupos`: Array con todos los grupos SICORE disponibles
- `grupoSeleccionado`: Grupo actualmente seleccionado
- `loading`: Estado de carga durante las peticiones
- `error`: Mensajes de error en caso de fallo

### Computadas

- `gruposActivos`: Solo grupos que no están marcados como inactivos
- `hasGrupos`: Booleano indicando si hay grupos cargados
- `gruposPorNombre`: Grupos ordenados alfabéticamente por descripción
- `informacionGrupoSeleccionado`: Información completa del grupo seleccionado

### Acciones Principales

- `cargarGrupos()`: Carga todos los grupos desde la API
- `seleccionarGrupo(grupo)`: Establece el grupo seleccionado
- `limpiarSeleccion()`: Limpia la selección actual
- `refrescar()`: Recarga los datos desde la API

### Utilidades

- `buscarGrupoPorId(id)`: Busca un grupo por su ID
- `buscarGrupoPorCodigo(codigo)`: Busca un grupo por su código
- `existeGrupo(id)`: Verifica si existe un grupo con el ID dado
- `obtenerEstadisticas()`: Retorna estadísticas de uso

## 🚀 Uso en Componentes

### Importación básica

```javascript
import { useSicoreStore } from '@/stores/sicore.js'

const sicoreStore = useSicoreStore()
```

### Cargar datos

```javascript
import { onMounted } from 'vue'

onMounted(async () => {
  await sicoreStore.cargarGrupos()
})
```

### Usar en template

```vue
<template>
  <div v-if="sicoreStore.loading">Cargando grupos SICORE...</div>
  <div v-else-if="sicoreStore.error">Error: {{ sicoreStore.error }}</div>

  <select v-else @change="onGrupoChange">
    <option value="">Seleccione grupo</option>
    <option
      v-for="grupo in sicoreStore.gruposPorNombre"
      :key="grupo.IDGRUPOSICORE"
      :value="grupo.IDGRUPOSICORE"
    >
      {{ grupo.DESCRIPCION }}
    </option>
  </select>
</template>
```

### Manejar selección

```javascript
function onGrupoChange(event) {
  const grupoId = event.target.value
  if (grupoId) {
    const grupo = sicoreStore.buscarGrupoPorId(grupoId)
    sicoreStore.seleccionarGrupo(grupo)
  } else {
    sicoreStore.limpiarSeleccion()
  }
}
```

### Información del grupo seleccionado

```javascript
// Acceder a información detallada
const info = sicoreStore.informacionGrupoSeleccionado
if (info) {
  console.log(`Grupo: ${info.descripcion} (ID: ${info.id})`)
}
```

## 🔄 Integración con Filtros

El store SICORE se integra con el store de filtros activos:

```javascript
import { useFiltrosActivosStore } from '@/stores/filters/filtrosActivos.js'
import { useSicoreStore } from '@/stores/sicore.js'

const filtros = useFiltrosActivosStore()
const sicoreStore = useSicoreStore()

// Establecer grupo en ambos stores
function seleccionarGrupoSicore(grupo) {
  sicoreStore.seleccionarGrupo(grupo)
  filtros.setGrupoSicore(grupo)
}
```

## 📊 Estructura de Datos

### Formato de Grupo SICORE

```javascript
{
  IDGRUPOSICORE: 1,
  DESCRIPCION: "Grupo Principal",
  CODIGO: "GP01",
  ACTIVO: true,
  FECHA_CREACION: "2024-01-01",
  USUARIO_CREACION: "admin"
}
```

### Estadísticas

```javascript
const stats = sicoreStore.obtenerEstadisticas()
// Retorna:
{
  total: 15,
  activos: 12,
  inactivos: 3,
  conSeleccion: true
}
```

## 🎯 Casos de Uso Comunes

### 1. Selector de Grupo en Filtros

```vue
<script setup>
const sicoreStore = useSicoreStore()
const filtros = useFiltrosActivosStore()

onMounted(() => sicoreStore.cargarGrupos())

function aplicarFiltroSicore(grupoId) {
  const grupo = sicoreStore.buscarGrupoPorId(grupoId)
  filtros.setGrupoSicore(grupo)
}
</script>
```

### 2. Validación de Grupo Existente

```javascript
function validarGrupo(id) {
  if (!sicoreStore.existeGrupo(id)) {
    throw new Error(`Grupo SICORE ${id} no encontrado`)
  }
  return sicoreStore.buscarGrupoPorId(id)
}
```

### 3. Búsqueda por Código

```javascript
function buscarPorCodigo(codigo) {
  const grupo = sicoreStore.buscarGrupoPorCodigo(codigo)
  if (grupo) {
    sicoreStore.seleccionarGrupo(grupo)
    return grupo
  }
  return null
}
```

## ⚡ Rendimiento

- Los datos se cargan una sola vez y se mantienen en cache
- Las computed se recalculan solo cuando cambian las dependencias
- La búsqueda por ID y código es optimizada para acceso rápido

## 🔧 Debugging

```javascript
// Ver estado completo
console.log('Estado SICORE:', sicoreStore.$state)

// Estadísticas rápidas
console.log('Stats:', sicoreStore.obtenerEstadisticas())

// Grupo seleccionado
console.log('Seleccionado:', sicoreStore.informacionGrupoSeleccionado)
```
