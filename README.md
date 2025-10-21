# frontdgs

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Compile and Minify for Production

```sh
bun run build
```

## 📚 Documentación

Consulta la documentación completa en [`/docs`](./docs/):

- **🚀 [Guía Rápida de Combos](./docs/COMBOS_GUIA_RAPIDA.md)** - Como usar ComboSimple y ComboAvanzado
- **✅ [Implementación Completada](./docs/IMPLEMENTACION_COMBOS_COMPLETADA.md)** - Resumen de migración exitosa
- **🔧 [Troubleshooting](./docs/TROUBLESHOOTING.md)** - Problemas comunes y soluciones
- **📋 [Índice Completo](./docs/README.md)** - Navegación de toda la documentación

## 🏗️ Arquitectura

Este proyecto usa **Vue 3** con **Composition API** y incluye:

- **Componentes avanzados** de UI (ComboSimple, ComboAvanzado)
- **Composables reutilizables** con cache y retry automático
- **Stores Pinia** para manejo de estado global
- **API layer** con useDgsApi para comunicación con backend
