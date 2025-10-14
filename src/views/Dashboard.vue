<template>
  <div class="dashboard-view">
    <h1>Dashboard</h1>
    <div class="contenido">
      <p>Panel de control principal</p>
      <div class="dashboard-grid">
        <div class="card">
          <h3>Resumen de Actividad</h3>
          <p>Datos en tiempo real del sistema</p>
        </div>
        <div class="card">
          <h3>Estadísticas</h3>
          <p>Métricas y gráficos</p>
        </div>
        <div class="card">
          <h3>Accesos Rápidos</h3>
          <p>Funciones más utilizadas</p>
        </div>
        <div class="card">
          <h3>Notificaciones</h3>
          <p>Alertas y avisos del sistema</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aquí irá la lógica del dashboard
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
}

.contenido {
  margin-top: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 10px;
}

.card p {
  color: #666;
  margin: 0;
}
</style>
