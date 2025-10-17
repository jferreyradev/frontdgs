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
  width: var(--sidebar-width, 140px);
  min-width: var(--sidebar-min-width, 120px);
  max-width: var(--sidebar-max-width, 180px);
  flex-shrink: 0;

  /* Anchos predefinidos - descomenta el que prefieras */
  /* --sidebar-width: 100px; /* Muy compacto */
  /* --sidebar-width: 120px; /* Compacto */
  /* --sidebar-width: 140px; /* Estándar (actual) */
  /* --sidebar-width: 160px; /* Cómodo */
  /* --sidebar-width: 180px; /* Amplio */
}

.nav-header {
  padding: 0 0 0.4rem 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 0.4rem;
}

.nav-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 0.8rem;
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
  gap: 0.4rem;
  padding: 0.4rem 0;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
  border-radius: 4px;
  margin-bottom: 0.05rem;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #495057;
  padding-left: 0.2rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.nav-item.router-link-active {
  background-color: #e3f2fd;
  color: #1976d2;
  border-left-color: #1976d2;
  font-weight: 500;
  padding-left: 0.2rem;
  box-shadow: 0 1px 3px rgba(25, 118, 210, 0.1);
}

.nav-icon {
  font-size: 0.85rem;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.nav-label {
  font-size: 0.75rem;
  line-height: 1.3;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .sidebar-nav {
    --sidebar-width: 120px;
    --sidebar-min-width: 100px;
  }
}

@media (max-width: 768px) {
  .sidebar-nav {
    --sidebar-width: 50px;
    --sidebar-min-width: 50px;
  }

  .nav-item {
    padding: 0.75rem 0;
    font-size: 0.9rem;
  }

  .nav-item:hover,
  .nav-item.router-link-active {
    padding-left: 0.5rem;
  }

  .nav-icon {
    font-size: 1rem;
    width: 20px;
  }

  .nav-label {
    font-size: 0.85rem;
    font-weight: 500;
  }
}

@media (max-width: 480px) {
  .sidebar-nav {
    --sidebar-width: 80px;
    --sidebar-min-width: 70px;
  }

  .nav-header h3 {
    font-size: 0.8rem;
  }

  .nav-item {
    padding: 0.6rem 0;
  }

  .nav-icon {
    font-size: 0.9rem;
    width: 18px;
  }

  .nav-label {
    font-size: 0.7rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .nav-item {
    padding: 0.75rem 0;
    min-height: 40px; /* Más compacto pero aún accesible */
  }

  .nav-item:active {
    background-color: #f1f3f4;
  }
}
</style>
