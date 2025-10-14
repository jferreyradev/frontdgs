<template>
  <div class="reportes-view">
    <h1>Reportes</h1>
    <div class="contenido">
      <p>Aquí irán los reportes del sistema DGS</p>
      <div class="placeholder">
        <h3>Tipos de Reportes Disponibles:</h3>
        <ul>
          <li>Reporte de Liquidaciones</li>
          <li>Reporte de Grupos Repartición</li>
          <li>Reporte por Período</li>
          <li>Resumen Mensual</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aquí irá la lógica de reportes
</script>

<style scoped>
.reportes-view {
  padding: 20px;
}

.contenido {
  margin-top: 20px;
}

.placeholder {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.placeholder h3 {
  margin-top: 0;
  color: #2c3e50;
}

.placeholder ul {
  margin: 15px 0;
}

.placeholder li {
  margin: 8px 0;
  color: #555;
}
</style>
