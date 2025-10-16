import { ref } from 'vue'

export function useApiFetch() {
  const loading = ref(false)
  const error = ref(null)
  const result = ref(null)

  async function apiFetch(url, options = {}) {
    loading.value = true
    error.value = null
    result.value = null

    // Log detallado para diagnóstico
    console.log('🚀 Iniciando petición apiFetch:', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body ? JSON.parse(options.body) : null,
    })

    try {
      const res = await fetch(url, options)

      console.log('📡 Respuesta recibida:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        url: res.url,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error ${res.status}: ${res.statusText}. ${errorText}`)
      }
      const data = await res.json()
      result.value = data

      console.log('✅ Datos procesados exitosamente:', data)
      return data
    } catch (e) {
      console.error('❌ Error en apiFetch:', {
        url,
        options,
        error: e.message,
        errorType: e.constructor.name,
      })

      // Diagnóstico específico para errores de red
      if (e.message.includes('NetworkError') || e.message.includes('fetch')) {
        console.error('🔍 Diagnóstico de error de red:', {
          'URL completa': new URL(url, window.location.origin).href,
          'Servidor actual': window.location.origin,
          'Endpoint solicitado': url,
          Recomendación: 'Verificar que el servidor backend esté corriendo',
        })
      }

      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, result, apiFetch }
}

// Alias para compatibilidad
export function useSimpleFetch() {
  return useApiFetch()
}
