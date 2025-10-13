import { ref } from 'vue'

export function useApiFetch() {
  const loading = ref(false)
  const error = ref(null)
  const result = ref(null)

  async function apiFetch(url, options = {}) {
    loading.value = true
    error.value = null
    result.value = null
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error('Error en la petición')
      const data = await res.json()
      result.value = data
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, result, apiFetch }
}
