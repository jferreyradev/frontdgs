/**
 * Utilidad para diagnosticar problemas de conectividad con el backend
 */

export async function diagnosticarConectividad() {
  console.log('🔍 === DIAGNÓSTICO DE CONECTIVIDAD ===')

  const resultados = {
    proxy: null,
    endpoints: [],
    recomendaciones: [],
  }

  // 1. Verificar configuración actual
  console.log('📍 Configuración actual:')
  console.log('  - Frontend URL:', window.location.origin)
  console.log('  - Configuración Vite proxy: /api -> http://10.6.46.114:3011')

  // 2. Probar diferentes endpoints
  const endpointsAProbar = [
    { url: '/api/exec', metodo: 'POST', descripcion: 'Endpoint principal SQL' },
    { url: '/api/health', metodo: 'GET', descripcion: 'Health check' },
    { url: '/api/status', metodo: 'GET', descripcion: 'Status check' },
    { url: '/exec', metodo: 'POST', descripcion: 'Directo sin /api' },
    { url: '/health', metodo: 'GET', descripcion: 'Health directo' },
  ]

  for (const endpoint of endpointsAProbar) {
    console.log(`\n🔍 Probando ${endpoint.descripcion}: ${endpoint.url}`)

    try {
      const opciones = {
        method: endpoint.metodo,
        signal: AbortSignal.timeout(5000),
      }

      if (endpoint.metodo === 'POST') {
        opciones.headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer apiDG$prod',
        }
        opciones.body = JSON.stringify({ query: 'SELECT 1 FROM DUAL' })
      }

      const response = await fetch(endpoint.url, opciones)

      const resultado = {
        url: endpoint.url,
        status: response.status,
        statusText: response.statusText,
        disponible: true,
        headers: Object.fromEntries(response.headers.entries()),
      }

      console.log(`  ✅ Respuesta: ${response.status} ${response.statusText}`)
      resultados.endpoints.push(resultado)

      if (response.status === 200) {
        console.log(`  🎯 ¡Endpoint funcionando correctamente!`)
      }
    } catch (error) {
      const resultado = {
        url: endpoint.url,
        disponible: false,
        error: error.message,
        tipo: error.constructor.name,
      }

      console.log(`  ❌ Error: ${error.message}`)
      resultados.endpoints.push(resultado)
    }
  }

  // 3. Verificar servidor backend directamente
  console.log('\n🔍 Probando conexión directa al servidor backend:')

  const servidoresAProbar = [
    'http://10.6.46.114:3011',
    'http://10.6.46.114:3013',
    'http://localhost:3011',
    'http://localhost:3013',
  ]

  for (const servidor of servidoresAProbar) {
    try {
      console.log(`  Probando: ${servidor}`)
      const response = await fetch(`${servidor}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
        mode: 'cors',
      })

      console.log(`  ✅ ${servidor} responde: ${response.status}`)
    } catch (error) {
      console.log(`  ❌ ${servidor} no disponible: ${error.message}`)
    }
  }

  // 4. Generar recomendaciones
  console.log('\n💡 === RECOMENDACIONES ===')

  const endpointsFuncionando = resultados.endpoints.filter((e) => e.disponible)

  if (endpointsFuncionando.length === 0) {
    console.log('❌ Ningún endpoint está disponible')
    console.log('🔧 Acciones sugeridas:')
    console.log('  1. Verificar que el servidor backend esté corriendo')
    console.log('  2. Comprobar el puerto correcto (¿3011 o 3013?)')
    console.log('  3. Verificar la IP del servidor (10.6.46.114)')
    console.log('  4. Revisar configuración del proxy en vite.config.js')

    resultados.recomendaciones = [
      'Verificar servidor backend',
      'Comprobar puerto',
      'Revisar configuración proxy',
    ]
  } else {
    console.log('✅ Endpoints disponibles encontrados:')
    endpointsFuncionando.forEach((e) => {
      console.log(`  - ${e.url} (${e.status})`)
    })
  }

  console.log('\n📋 === COMANDOS ÚTILES ===')
  console.log('// En la consola del navegador:')
  console.log('window.diagnosticarConectividad()')
  console.log('window.consultasAPI.verificarServidorDisponible()')

  return resultados
}

// Exponer globalmente para debugging
if (typeof window !== 'undefined') {
  window.diagnosticarConectividad = diagnosticarConectividad
}
