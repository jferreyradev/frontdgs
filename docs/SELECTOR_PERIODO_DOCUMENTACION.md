# 🗓️ SelectorPeriodo.vue - Documentación

## 📋 **Descripción**

Componente moderno para selección de período (mes/año) que utiliza:

- **ComboSimple** para una UX consistente
- **Store de período** para sincronización automática
- **Composable especializado** para manejo de datos temporales

## 🚀 **Características**

### ✨ **Funcionalidades Principales**

- ✅ **Selección de mes y año** con combos intuitivos
- ✅ **Sincronización automática** con el store de período
- ✅ **Controles rápidos** (Hoy, Limpiar)
- ✅ **Validación de períodos** y detección de fechas futuras
- ✅ **Generación automática** de fechas ISO
- ✅ **Control programático** mediante ref
- ✅ **Responsive** y accesible

### 🎯 **Ventajas vs FiltroMesAño**

- **Más consistente:** Usa ComboSimple como otros filtros
- **Mejor UX:** Combos más usables que selects nativos
- **Más potente:** Múltiples eventos y métodos expuestos
- **Moderno:** Composition API y mejores prácticas
- **Flexible:** Configuración granular y control programático

---

## 🔧 **Uso Básico**

### **📦 Importación**

```vue
<script setup>
import SelectorPeriodo from '@/components/filters/SelectorPeriodo.vue'
</script>
```

### **🎯 Uso Simple**

```vue
<template>
  <SelectorPeriodo @cambio="manejarCambio" />
</template>

<script setup>
function manejarCambio(datos) {
  console.log('Período seleccionado:', datos)
  // datos = { mes, año, mesNombre, textoCompleto, fechaInicioISO, fechaFinISO, ... }
}
</script>
```

---

## ⚙️ **Props Disponibles**

| Prop            | Tipo            | Defecto | Descripción                         |
| --------------- | --------------- | ------- | ----------------------------------- |
| `mesInicial`    | `Number/String` | `null`  | Mes inicial seleccionado (1-12)     |
| `añoInicial`    | `Number/String` | `null`  | Año inicial seleccionado            |
| `añoMinimo`     | `Number`        | `2020`  | Año mínimo en el combo              |
| `añoMaximo`     | `Number`        | `2030`  | Año máximo en el combo              |
| `conectarStore` | `Boolean`       | `true`  | Sincronizar con store de período    |
| `iniciarConHoy` | `Boolean`       | `false` | Establecer período actual al montar |

---

## 📤 **Eventos Emitidos**

### **🔄 `@cambio`** - Evento principal

```javascript
// Se emite en cada cambio (mes o año)
{
  mes: 10,                    // Número del mes (1-12)
  año: 2025,                  // Año seleccionado
  mesNombre: "Octubre",       // Nombre completo del mes
  textoCompleto: "Octubre 2025", // Texto legible
  valido: true,               // Si el período está completo
  fechaInicioISO: "2025-10-01T00:00:00.000Z", // Fecha inicio ISO
  fechaFinISO: "2025-10-31T23:59:59.999Z",    // Fecha fin ISO
  esFuturo: false             // Si es período futuro
}
```

### **✅ `@periodo-completo`** - Solo cuando mes Y año están seleccionados

```javascript
// Se emite solo cuando ambos valores están presentes
// Útil para activar botones o procesos que requieren período completo
```

### **📊 `@update:mes` / `@update:año`** - Eventos individuales

```javascript
// Para v-model individual si se necesita
// @update:mes="nuevoMes => { ... }"
// @update:año="nuevoAño => { ... }"
```

---

## 🎮 **Métodos Expuestos (via ref)**

```vue
<template>
  <SelectorPeriodo ref="selector" />
  <button @click="controlarSelector">Controlar</button>
</template>

<script setup>
import { ref } from 'vue'

const selector = ref(null)

function controlarSelector() {
  // Establecer período específico
  selector.value.establecerPeriodo(3, 2024) // Marzo 2024

  // Establecer período actual
  selector.value.establecerHoy()

  // Limpiar selección
  selector.value.limpiarSeleccion()

  // Obtener datos actuales
  const datos = selector.value.obtenerDatos()
  console.log(datos)
}
</script>
```

---

## 🏪 **Integración con Store**

### **🔄 Sincronización Automática**

```vue
<template>
  <!-- Se sincroniza automáticamente con usePeriodoStore() -->
  <SelectorPeriodo :conectar-store="true" />

  <!-- Sin sincronización (modo standalone) -->
  <SelectorPeriodo :conectar-store="false" />
</template>
```

### **📊 Acceso al Store**

```vue
<script setup>
import { usePeriodoStore } from '@/stores/filters/periodo.js'

const periodoStore = usePeriodoStore()

// El store se actualiza automáticamente cuando cambia el selector
// Acceso directo: periodoStore.mesSeleccionado, periodoStore.añoSeleccionado
</script>
```

---

## 📋 **Ejemplos de Uso**

### **1️⃣ Selector Básico**

```vue
<SelectorPeriodo @cambio="(datos) => console.log(datos)" />
```

### **2️⃣ Con Valores Iniciales**

```vue
<SelectorPeriodo :mes-inicial="10" :año-inicial="2025" @periodo-completo="procesarPeriodo" />
```

### **3️⃣ Con Rango Personalizado**

```vue
<SelectorPeriodo :año-minimo="2015" :año-maximo="2035" :iniciar-con-hoy="true" />
```

### **4️⃣ Standalone (Sin Store)**

```vue
<SelectorPeriodo :conectar-store="false" @cambio="manejarLocal" />
```

### **5️⃣ Control Programático**

```vue
<template>
  <SelectorPeriodo ref="miSelector" />
  <button @click="irAEnero">Enero 2024</button>
</template>

<script setup>
const miSelector = ref(null)

function irAEnero() {
  miSelector.value.establecerPeriodo(1, 2024)
}
</script>
```

---

## 🎨 **Personalización CSS**

### **🎯 Clases Principales**

```css
.selector-periodo {
} /* Contenedor principal */
.combos-periodo {
} /* Contenedor de combos */
.combo-mes {
} /* Combo de mes */
.combo-año {
} /* Combo de año */
.controles-periodo {
} /* Controles (botones) */
.btn-periodo {
} /* Botones base */
.btn-hoy {
} /* Botón "Hoy" */
.btn-limpiar {
} /* Botón "Limpiar" */
.indicador-periodo {
} /* Indicador de selección */
.badge-futuro {
} /* Badge de período futuro */
```

### **📱 Responsive**

```css
@media (max-width: 640px) {
  .combos-periodo {
    flex-direction: column; /* Combos verticales en móvil */
  }
}
```

---

## 🔍 **Comparativa con FiltroMesAño**

| Característica           | FiltroMesAño                 | SelectorPeriodo           |
| ------------------------ | ---------------------------- | ------------------------- |
| **UI Base**              | `<select>` nativo            | `ComboSimple`             |
| **Consistencia**         | ❌ Diferente a otros filtros | ✅ Igual que otros combos |
| **Accesibilidad**        | ⚠️ Limitada                  | ✅ Completa               |
| **Personalización**      | ⚠️ Limitada                  | ✅ Total                  |
| **Eventos**              | 1 evento básico              | 4 eventos especializados  |
| **Control programático** | ⚠️ Básico                    | ✅ Completo               |
| **Validaciones**         | ⚠️ Manuales                  | ✅ Automáticas            |
| **Mobile UX**            | ❌ Pobre                     | ✅ Excelente              |

---

## 🧪 **Testing**

### **🔗 URL de Prueba**

```
http://localhost:5173/ejemplos/selector-periodo
```

### **✅ Casos de Prueba**

- [ ] Selección de mes y año
- [ ] Botón "Hoy" establece período actual
- [ ] Botón "Limpiar" resetea selección
- [ ] Sincronización con store
- [ ] Validación de períodos futuros
- [ ] Control programático
- [ ] Responsive en móvil

---

## 🚀 **Migración desde FiltroMesAño**

### **1️⃣ Reemplazar Componente**

```vue
<!-- Antes -->
<FiltroMesAño @cambio="manejar" />

<!-- Después -->
<SelectorPeriodo @cambio="manejar" />
```

### **2️⃣ Actualizar Manejadores**

```javascript
// El formato de datos es similar, pero con más información
function manejar(datos) {
  // Antes: datos.mes, datos.año
  // Después: datos.mes, datos.año + más campos útiles
  console.log(datos.textoCompleto) // "Octubre 2025"
  console.log(datos.fechaInicioISO) // "2025-10-01T00:00:00.000Z"
}
```

### **3️⃣ Aprovechar Nuevas Características**

```vue
<SelectorPeriodo :iniciar-con-hoy="true" @periodo-completo="activarFiltros" ref="selector" />
```

---

## 📈 **Próximas Mejoras**

- [ ] **Presets rápidos** (Este mes, Mes anterior, Último trimestre)
- [ ] **Validación de rangos** (no permitir fechas futuras)
- [ ] **Selector de trimestre** como variante
- [ ] **Integración con date-fns** para i18n
- [ ] **Temas visuales** predefinidos

---

**✨ Listo para usar - Compatible con todo el ecosistema de filtros dinámicos**
