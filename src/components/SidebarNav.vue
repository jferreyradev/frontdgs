<template>
  <nav class="sidebar-nav">
    <div class="nav-header">
      <h3>Navegación</h3>
    </div>

    <ul class="nav-list">
      <li>
        <router-link to="/" class="nav-item">
          <span class="nav-icon">🏠</span>
          <span class="nav-label">Inicio</span>
        </router-link>
      </li>
      <li>
        <router-link to="/dashboard" class="nav-item">
          <span class="nav-icon">📊</span>
          <span class="nav-label">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/reportes" class="nav-item">
          <span class="nav-icon">📋</span>
          <span class="nav-label">Reportes</span>
        </router-link>
      </li>
      <li>
        <router-link to="/consultas" class="nav-item">
          <span class="nav-icon">🔍</span>
          <span class="nav-label">Consultas</span>
        </router-link>
      </li>
      <li>
        <router-link to="/configuracion" class="nav-item">
          <span class="nav-icon">⚙️</span>
          <span class="nav-label">Configuración</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
// Navegación lateral
</script>

<style scoped>
.sidebar-nav {
  background-color: transparent;
  padding: 0;
  margin-bottom: 1rem;
}

.nav-header {
  padding: 0 0 1rem 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 1rem;
}

.nav-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  border-radius: 6px;
  margin-bottom: 0.25rem;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #495057;
  padding-left: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-item.router-link-active {
  background-color: #e3f2fd;
  color: #1976d2;
  border-left-color: #1976d2;
  font-weight: 500;
  padding-left: 0.5rem;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.1);
}

.nav-icon {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.nav-label {
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-item {
    padding: 1rem 0;
    font-size: 1rem;
  }

  .nav-item:hover,
  .nav-item.router-link-active {
    padding-left: 0.75rem;
  }

  .nav-icon {
    font-size: 1.2rem;
    width: 26px;
  }

  .nav-label {
    font-size: 1rem;
    font-weight: 500;
  }
}

@media (max-width: 480px) {
  .nav-header h3 {
    font-size: 1.1rem;
  }

  .nav-item {
    padding: 1.25rem 0;
  }

  .nav-icon {
    font-size: 1.3rem;
    width: 28px;
  }

  .nav-label {
    font-size: 1.1rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .nav-item {
    padding: 1rem 0;
    min-height: 48px; /* Accessibility guideline for touch targets */
  }

  .nav-item:active {
    background-color: #f1f3f4;
  }
}
</style>
