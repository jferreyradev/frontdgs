# 🔧 Troubleshooting - Problemas Comunes y Soluciones

## 🚨 Problemas Resueltos Recientemente

### **1. Error: `buscarTipoPorId is not a function`**

**Problema:**

```
TypeError: buscarTipoPorId is not a function
at PanelFiltros.vue:101
```

**Causa:**
El composable `useCombo` exporta `buscarPor(key, value)` pero no `buscarPorId(id)`.

**Solución:**

```vue
<!-- ❌ INCORRECTO -->
const { items: tipos, buscarPorId: buscarTipoPorId } = useCombo( 'tiposLiquidacion',
'getTiposLiquidacion' )

<!-- ✅ CORRECTO -->
const { items: tipos, buscarPor: buscarTipoPor } = useCombo( 'tiposLiquidacion',
'getTiposLiquidacion' ) // Crear función auxiliar const buscarTipoPorId = (id) =>
buscarTipoPor('IDTIPOLIQUIDACION', id)
```

**Estado:** ✅ **RESUELTO** - 21/10/2025

---

### **2. SICORE Grupos No Cargan**

**Problema:**
Los grupos SICORE no se muestran en el combo después de migrar a `ComboSimple`.

**Síntomas:**

- Combo aparece vacío
- No hay errores en consola
- API funciona correctamente

**Diagnóstico:**
Agregamos logging detallado para rastrear el flujo de datos:

```vue
// Debug logging agregado watch(grupos, (newGrupos) => { console.log('🔍 Grupos SICORE cargados:',
newGrupos) }, { immediate: true }) watch(loading, (isLoading) => { console.log('⏳ Loading SICORE:',
isLoading) }, { immediate: true }) watch(error, (errorMsg) => { if (errorMsg) console.error('❌
Error SICORE:', errorMsg) }, { immediate: true })
```

**Estado:** 🔄 **EN PROGRESO** - Debugging activo

---

### **3. Grupo Repartición No Aparece en Filtros**

**Problema:**
El combo de "Grupo Repartición" no muestra datos o no se sincroniza correctamente con el store.

**Causa:**
Inconsistencia entre la clave usada en el componente (`value-key="IDGRUPO"`) y la función de búsqueda (`buscarGrupoPor('IDGRUPOREPARTICION', id)`).

**Diagnóstico:**

```javascript
// En PanelFiltros.vue - INCONSISTENCIA
;<ComboSimple value-key="IDGRUPO" /> // ← Usa IDGRUPO
const buscarGrupoPorId = (id) => buscarGrupoPor('IDGRUPOREPARTICION', id) // ← Busca IDGRUPOREPARTICION
```

**Solución:**

```javascript
// ✅ CORRECTO - Usar la misma clave en ambos lados
const buscarGrupoPorId = (id) => buscarGrupoPor('IDGRUPO', id)
```

**Verificación:**
Confirmar que el store usa la clave correcta:

```javascript
// En filtrosActivos.js
grupo: filtros.grupoReparticionActivo?.IDGRUPO || null // ← Confirma que es IDGRUPO
```

**Estado:** ✅ **RESUELTO** - 21/10/2025

---

## 🛠️ Herramientas de Diagnóstico

### **1. Verificar Estado del Composable**

```javascript
// En cualquier componente que use useCombo
onMounted(() => {
  console.log('📊 Estado del composable:')
  console.log('  Items:', items.value)
  console.log('  Loading:', loading.value)
  console.log('  Error:', error.value)
  console.log('  Cantidad:', items.value.length)
})
```

### **2. Verificar API Response**

```javascript
// En useDgsApi.js - agregar logging temporal
async function getGruposSicore() {
  const result = await ejecutarConsulta(sqlQuery)
  console.log('🔍 API Response getGruposSicore:', result)
  return result
}
```

### **3. Verificar Store State**

```javascript
// En componente
watch(
  () => store.grupoSicoreActivo,
  (nuevoGrupo) => {
    console.log('🏪 Store actualizado:', nuevoGrupo)
  },
  { immediate: true, deep: true },
)
```

---

## ⚡ Mejores Prácticas

### **1. Siempre Usar Funciones Auxiliares**

```javascript
// ✅ CORRECTO - Crear wrapper functions
const { items, buscarPor } = useCombo('usuarios', 'getUsuarios')
const buscarUsuarioPorId = (id) => buscarPor('IDUSUARIO', id)

// ❌ INCORRECTO - Asumir funciones que no existen
const { buscarPorId } = useCombo('usuarios', 'getUsuarios')
```

### **2. Verificar Keys de API**

```javascript
// Verificar que las keys coincidan con la API
value-key="IDGRUPOSICORE"    // ← Debe coincidir con campo de BD
label-key="DESCRIPCION"      // ← Debe coincidir con campo de BD
```

### **3. Logging Estructurado**

```javascript
// Usar emojis y prefijos consistentes
console.log('🚀 Iniciando componente')
console.log('📊 Datos cargados:', data)
console.log('⏳ Estado loading:', loading)
console.log('❌ Error encontrado:', error)
console.log('✅ Operación completada')
```

---

## 🔍 Debug Checklist

Cuando un combo no funciona, verificar en orden:

- [ ] **1. API Method existe** - `grep_search "getNombreMetodo"`
- [ ] **2. Keys correctas** - `value-key` y `label-key` coinciden con BD
- [ ] **3. Store name único** - No hay conflictos de nombres
- [ ] **4. Composable response** - Verificar estructura de `items`
- [ ] **5. Network requests** - DevTools → Network → XHR
- [ ] **6. Console logs** - Buscar errores o warnings
- [ ] **7. Store sync** - Verificar sincronización con stores

---

## 📚 Enlaces Relacionados

- [Guía Rápida Combos](./COMBOS_GUIA_RAPIDA.md)
- [Implementación Completada](./IMPLEMENTACION_COMBOS_COMPLETADA.md)
- [Análisis de Componentes](./COMPONENTES_ANALISIS.md)
- [SICORE Store](./stores/SICORE_STORE.md)
