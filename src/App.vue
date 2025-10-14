<script setup>
import { ref } from 'vue'
import FiltrosActivos from '@/components/filters/FiltrosActivos.vue'
import SidebarNav from '@/components/SidebarNav.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <button class="sidebar-toggle" @click="toggleSidebar" aria-label="Toggle navigation">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        <h1>Sistema DGS</h1>
      </div>
    </header>

    <div class="app-body">
      <aside class="app-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <SidebarNav />
        <FiltrosActivos />
      </aside>

      <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="toggleSidebar"></div>

      <main class="app-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid #34495e;
  position: relative;
  z-index: 1001;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.sidebar-toggle {
  display: none;
  background: none;
  border: 1px solid #5a6c7d;
  color: #ffffff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  flex-direction: column;
  gap: 3px;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #7f8c8d;
}

.hamburger-line {
  width: 18px;
  height: 2px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.app-body {
  display: flex;
  flex: 1;
  position: relative;
}

.app-sidebar {
  width: 320px;
  background-color: #ffffff;
  border-right: 1px solid #e9ecef;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.app-main {
  flex: 1;
  padding: 1rem;
  min-width: 0; /* Permite que el contenido se reduzca */
  background-color: #f8f9fa;
}

/* Tablet */
@media (max-width: 1024px) {
  .app-sidebar {
    width: 280px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar-toggle {
    display: flex;
  }

  .app-body {
    position: relative;
  }

  .app-sidebar {
    position: fixed;
    top: 80px; /* Altura del header */
    left: 0;
    width: 280px;
    height: calc(100vh - 80px);
    transform: translateX(-100%);
    z-index: 1000;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
  }

  .app-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay.active {
    display: block;
    opacity: 1;
  }

  .app-main {
    width: 100%;
    padding: 1rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .app-header {
    padding: 0.75rem;
  }

  .app-header h1 {
    font-size: 1.25rem;
  }

  .app-sidebar {
    width: 100%;
    top: 70px; /* Altura reducida del header */
    height: calc(100vh - 70px);
  }

  .app-main {
    padding: 0.75rem;
    background-color: #f8f9fa;
  }
}

/* Large screens */
@media (min-width: 1200px) {
  .app-sidebar {
    width: 350px;
  }
}
</style>
