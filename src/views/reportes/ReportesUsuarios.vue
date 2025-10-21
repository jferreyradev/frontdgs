<template>
  <div class="reportes-usuarios">
    <div class="page-header">
      <h1>👥 Reportes de Usuarios</h1>
      <p class="page-description">
        Gestión y análisis de usuarios, roles y actividades del sistema
      </p>
    </div>

    <div class="content-grid">
      <div class="report-section">
        <ReporteSimple
          titulo="Actividad de Usuarios"
          :variables="variablesUsuarios"
          selection-mode="single"
          :show-checkboxes="false"
          @seleccion-cambio="manejarSeleccionUsuarios"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReporteSimple from '@/components/ReporteSimple.vue'

// Variables para el reporte de usuarios
const variablesUsuarios = ref([
  { nombre: 'rol', tipo: 'text', valor: '', label: 'Rol' },
  { nombre: 'activo', tipo: 'boolean', valor: true, label: 'Usuario Activo' },
  { nombre: 'fecha_registro', tipo: 'date', valor: '2024-01-01', label: 'Fecha Registro' },
])

// Función para manejar selección
const manejarSeleccionUsuarios = (seleccion) => {
  console.log('👤 Usuario seleccionado:', seleccion)
}
</script>

<style scoped>
.reportes-usuarios {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  margin: 0;
}

.content-grid {
  display: grid;
  gap: 1.5rem;
}

.report-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
