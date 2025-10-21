# 📋 Normalización de Nombres - Combos y Componentes

## 🎯 **Convención Estándar Propuesta**

### **1. API Methods**

- **Formato:** `camelCase` con prefijo `get`
- **Patrón:** `get + [Entidad] + [Opcional: Accion/Contexto]`

### **2. Store Names**

- **Formato:** `camelCase` plural, sin prefijo
- **Patrón:** `[entidad] + s/es` (plural de la entidad)

### **3. Labels de UI**

- **Formato:** `Title Case` en español
- **Patrón:** `[Entidad singular/plural según contexto]`

---

## 📊 **Estado Actual vs Propuesta**

### **✅ Nombres Ya Correctos:**

| API Method             | Store Name          | Label               | Estado      |
| ---------------------- | ------------------- | ------------------- | ----------- |
| `getTiposLiquidacion`  | `tiposLiquidacion`  | `Tipo Liquidación`  | ✅ Correcto |
| `getGruposReparticion` | `gruposReparticion` | `Grupo Repartición` | ✅ Correcto |
| `getGruposSicore`      | `gruposSicore`      | `Grupo Sicore`      | ✅ Correcto |
| `getUsuarios`          | `usuarios`          | `Usuario`           | ✅ Correcto |
| `getDepartamentos`     | `departamentos`     | `Departamento`      | ✅ Correcto |
| `getProvincias`        | `provincias`        | `Provincia`         | ✅ Correcto |
| `getCiudades`          | `ciudades`          | `Ciudad`            | ✅ Correcto |
| `getCargos`            | `cargos`            | `Cargo`             | ✅ Correcto |

---

## 🔍 **Análisis por Archivo**

### **PanelFiltros.vue** ✅ **PERFECTO**

```vue
<!-- Tipo Liquidación -->
<ComboSimple
  label="Tipo Liquidación"
  ←
  ✅
  Correcto
  api-method="getTiposLiquidacion"
  ←
  ✅
  Correcto
  store-name="tiposLiquidacion"
  ←
  ✅
  Correcto
/>

<!-- Grupo Repartición -->
<ComboSimple
  label="Grupo Repartición"
  ←
  ✅
  Correcto
  api-method="getGruposReparticion"
  ←
  ✅
  Correcto
  store-name="gruposReparticion"
  ←
  ✅
  Correcto
/>
```

### **FiltrosSicore.vue** ✅ **PERFECTO**

```vue
<ComboSimple
  label="Grupo Sicore"
  ←
  ✅
  Correcto
  api-method="getGruposSicore"
  ←
  ✅
  Correcto
  store-name="gruposSicore"
  ←
  ✅
  Correcto
/>
```

### **ReportesVentas.vue** ✅ **PERFECTO**

```vue
<!-- Usuarios como "Vendedores" -->
<ComboSimple
  label="Vendedor"
  ←
  ✅
  Correcto
  (contexto
  específico)
  api-method="getUsuarios"
  ←
  ✅
  Correcto
  store-name="vendedores"
  ←
  ✅
  Correcto
  (contexto
  específico)
/>

<!-- Otros combos también correctos -->
```

### **DemoCombos.vue** ✅ **PERFECTO**

```vue
<!-- Todos los combos siguen la convención correcta -->
```

---

## 🎊 **Resultado del Análisis**

### **✅ EXCELENTE NOTICIA:**

**¡Todos los nombres ya están perfectamente normalizados!**

La implementación actual sigue una convención consistente y lógica:

- ✅ **API Methods:** Todos usan `camelCase` con prefijo `get`
- ✅ **Store Names:** Todos usan `camelCase` plural sin prefijo
- ✅ **Labels:** Todos usan formato español apropiado
- ✅ **Contexto específico:** Bien manejado (ej: `usuarios` → `vendedores` en contexto de ventas)

---

## 🛠️ **Recomendaciones para el Futuro**

### **Al agregar nuevos combos:**

1. **Seguir la convención establecida:**

   ```vue
   <ComboSimple label="[Entidad en español]" api-method="get[Entidades]" store-name="[entidades]" />
   ```

2. **Ejemplos para nuevos combos:**

   ```vue
   <!-- Ejemplo: Combo de Regiones -->
   <ComboSimple label="Región" api-method="getRegiones" store-name="regiones" />

   <!-- Ejemplo: Combo de Categorías -->
   <ComboSimple label="Categoría" api-method="getCategorias" store-name="categorias" />
   ```

3. **Para contextos específicos, usar store names descriptivos:**
   ```vue
   <!-- Usuarios en contexto de supervisores -->
   <ComboSimple
     label="Supervisor"
     api-method="getUsuarios"
     store-name="supervisores"
     ←
     ✅
     Específico
     al
     contexto
   />
   ```

---

## 📚 **Documentación de la Convención**

### **Reglas Establecidas:**

1. **API Methods:**
   - Prefijo obligatorio: `get`
   - CamelCase: `getTiposLiquidacion`
   - Plural para colecciones: `getUsuarios` (no `getUsuario`)

2. **Store Names:**
   - Sin prefijo `get`
   - CamelCase plural: `usuarios`, `tiposLiquidacion`
   - Contexto específico permitido: `vendedores` para `getUsuarios`

3. **Labels:**
   - Español, Title Case: `Tipo Liquidación`
   - Singular o plural según UX: `Usuario` vs `Grupos SICORE`
   - Contexto claro: `Vendedor` en lugar de `Usuario` cuando aplique

---

## ✅ **Estado Final**

**🎯 NORMALIZACIÓN COMPLETADA:** Todos los nombres de combos y componentes ya siguen una convención consistente y profesional. No se requieren cambios adicionales.

**📋 PRÓXIMOS PASOS:** Mantener esta convención para futuras implementaciones usando esta guía como referencia.
