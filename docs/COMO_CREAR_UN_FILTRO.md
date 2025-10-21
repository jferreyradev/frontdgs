# 🎯 Guía Rápida: Cómo Crear un Filtro

## ⚡ **Método Más Rápido (2 minutos)**

### **Paso 1: Agregar a FiltroLiq.vue existente**

```vue
<!-- En src/components/filters/FiltroLiq.vue -->
const combosConfigurados = [ // ... combos existentes // ✅ AGREGAR NUEVO FILTRO AQUÍ: { storeName:
'miNuevoFiltro', // Nombre único apiMethod: 'getMisDatos', // Método de API existente label: 'Mi
Filtro', // Texto que ve el usuario placeholder: 'Seleccione...', // Placeholder del combo valueKey:
'IDMIDATO', // Campo ID de la BD labelKey: 'DESCRIPCION' // Campo de descripción } ]
```

### **Paso 2: Verificar que el método API existe**

```javascript
// En src/composables/api/useDgsApi.js
async function getMisDatos() {
  return await executeQuery('SELECT IDMIDATO, DESCRIPCION FROM mi_tabla ORDER BY 1')
}
```

### **Paso 3: ¡Usar el filtro!**

```vue
<FiltroLiq @filtro-cambiado="manejarCambio" />
```

**¡Listo!** Tu filtro ya está funcionando.

---

## 🎨 **Métodos Disponibles**

### **1. 📋 Agregar a FiltroLiq existente**

- ⭐⭐⭐⭐⭐ **Facilidad**
- ⭐⭐⭐ **Flexibilidad**
- ✅ **Mejor para:** Agregar filtros comunes

### **2. 🎯 Crear filtro personalizado**

- ⭐⭐⭐ **Facilidad**
- ⭐⭐⭐⭐⭐ **Flexibilidad**
- ✅ **Mejor para:** Filtros específicos con lógica propia

### **3. 🎮 Usar composable dinámico**

- ⭐⭐ **Facilidad**
- ⭐⭐⭐⭐⭐ **Flexibilidad**
- ✅ **Mejor para:** Filtros que cambian en tiempo real

### **4. ⚙️ Configuración específica**

- ⭐⭐⭐⭐ **Facilidad**
- ⭐⭐⭐⭐ **Flexibilidad**
- ✅ **Mejor para:** Diferentes contextos (ventas, SICORE, etc.)

---

## 🛠️ **Plantillas Listas para Usar**

### **🔥 Plantilla Básica**

```javascript
{
  storeName: 'miEntidad',
  apiMethod: 'getMiEntidad',
  label: 'Mi Entidad',
  placeholder: 'Seleccione mi entidad',
  valueKey: 'IDMIENTIDAD',
  labelKey: 'DESCRIPCION'
}
```

### **🔥 Plantilla con Store**

```javascript
{
  storeName: 'miEntidad',
  apiMethod: 'getMiEntidad',
  label: 'Mi Entidad',
  valueKey: 'IDMIENTIDAD',
  labelKey: 'DESCRIPCION',
  storeProperty: 'miEntidadActiva',  // ← Conecta con store
  storeMethod: 'setMiEntidad'        // ← Método del store
}
```

### **🔥 Plantilla de Usuario/Vendedor**

```javascript
{
  storeName: 'usuarios',
  apiMethod: 'getUsuarios',
  label: 'Usuario',
  valueKey: 'IDUSUARIO',
  labelKey: 'NOMBRE'
}
```

### **🔥 Plantilla de Ubicación**

```javascript
{
  storeName: 'provincias',
  apiMethod: 'getProvincias',
  label: 'Provincia',
  valueKey: 'IDPROVINCIA',
  labelKey: 'DESCRIPCION'
}
```

---

## 🎯 **Casos de Uso Específicos**

### **📊 Para Reportes de Ventas**

```javascript
const filtrosVentas = [
  {
    storeName: 'vendedores',
    apiMethod: 'getUsuarios',
    label: 'Vendedor',
    valueKey: 'IDUSUARIO',
    labelKey: 'NOMBRE',
  },
  {
    storeName: 'clientes',
    apiMethod: 'getClientes',
    label: 'Cliente',
    valueKey: 'IDCLIENTE',
    labelKey: 'RAZONSOCIAL',
  },
  {
    storeName: 'productos',
    apiMethod: 'getProductos',
    label: 'Producto',
    valueKey: 'IDPRODUCTO',
    labelKey: 'DESCRIPCION',
  },
]
```

### **🏢 Para Análisis SICORE**

```javascript
const filtrosSicore = [
  {
    storeName: 'tiposLiquidacion',
    apiMethod: 'getTiposLiquidacion',
    label: 'Tipo Liquidación',
    valueKey: 'IDTIPOLIQUIDACION',
    labelKey: 'DESCRIPCION',
  },
  {
    storeName: 'gruposSicore',
    apiMethod: 'getGruposSicore',
    label: 'Grupo SICORE',
    valueKey: 'IDGRUPOSICORE',
    labelKey: 'DESCRIPCION',
  },
]
```

### **📍 Para Filtros Geográficos**

```javascript
const filtrosGeo = [
  {
    storeName: 'paises',
    apiMethod: 'getPaises',
    label: 'País',
    valueKey: 'IDPAIS',
    labelKey: 'DESCRIPCION',
  },
  {
    storeName: 'provincias',
    apiMethod: 'getProvincias',
    label: 'Provincia',
    valueKey: 'IDPROVINCIA',
    labelKey: 'DESCRIPCION',
  },
  {
    storeName: 'ciudades',
    apiMethod: 'getCiudades',
    label: 'Ciudad',
    valueKey: 'IDCIUDAD',
    labelKey: 'DESCRIPCION',
  },
]
```

---

## 🚀 **Próximos Pasos**

### **1. Probar los ejemplos:**

```bash
# Ir a la vista de ejemplo
http://localhost:5173/#/ejemplo-filtros
```

### **2. Agregar tu primer filtro:**

- Edita `FiltroLiq.vue`
- Agrega tu configuración
- ¡Prueba inmediatamente!

### **3. Crear filtro específico:**

- Copia `MiFiltroPersonalizado.vue`
- Personaliza según tu necesidad
- Úsalo en tu vista

---

## ❓ **Preguntas Frecuentes**

### **¿Cómo agregar validaciones?**

```javascript
{
  // ... configuración normal
  required: true,                    // Campo requerido
  validator: (value) => value > 0,   // Validación personalizada
  errorMessage: 'Campo requerido'    // Mensaje de error
}
```

### **¿Cómo hacer filtros dependientes?**

```javascript
// En el composable
watch(
  () => valoresSeleccionados.provincia,
  (nuevaProvincia) => {
    // Recargar ciudades cuando cambie provincia
    if (nuevaProvincia) {
      registrarCombo({
        id: 'ciudades',
        // ... configuración
        apiParams: { provinciaId: nuevaProvincia }, // Pasar parámetros
      })
    }
  },
)
```

### **¿Cómo personalizar estilos?**

```vue
<!-- En tu componente -->
<FiltroLiqDinamico :combos="miConfig" class="mi-estilo-personalizado" />

<style scoped>
.mi-estilo-personalizado .filtros-container {
  background: #custom-color;
  /* Tus estilos personalizados */
}
</style>
```

---

## 🎯 **¡Empieza Ahora!**

**Método más rápido:** Edita `FiltroLiq.vue` y agrega tu configuración.
**Más potencia:** Usa `FiltroConComposable.vue` para filtros dinámicos.
**Máxima flexibilidad:** Crea tu propio filtro basado en las plantillas.
