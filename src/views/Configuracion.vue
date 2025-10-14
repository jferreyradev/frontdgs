<template>
  <div class="configuracion-view">
    <h1>Configuración</h1>
    <div class="contenido">
      <p>Configuración del sistema</p>
      <div class="placeholder">
        <h3>Opciones de Configuración:</h3>
        <ul>
          <li>Configuración de Usuario</li>
          <li>Parámetros del Sistema</li>
          <li>Configuración de API</li>
          <li>Preferencias de Interfaz</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aquí irá la lógica de configuración
</script>

<style scoped>
.configuracion-view {
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
