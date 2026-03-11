import { reactive } from 'vue'

const state = reactive({
  agentId: '',
})

/**
 * Persist and cache the agent referral ID.
 * Called from App.vue on launch / from onLoad on any page.
 */
export function setAgentId(id) {
  if (!id) return
  state.agentId = String(id)
  try {
    uni.setStorageSync('kuixing_agent_id', state.agentId)
  } catch (_) {
    /* storage unavailable on some platforms during cold start */
  }
}

/**
 * Return the current agent ID (memory-first, falls back to storage).
 */
export function getAgentId() {
  if (state.agentId) return state.agentId
  try {
    const stored = uni.getStorageSync('kuixing_agent_id')
    if (stored) {
      state.agentId = stored
      return stored
    }
  } catch (_) {
    /* ignore */
  }
  return ''
}

/**
 * Build the full webview URL, appending agentId and optional extra params.
 */
export function buildWebviewUrl(base = 'https://kuixing.cloud/?from=miniprogram', extraParams = {}) {
  // TODO: remove hardcoded agentId after testing
  const agentId = '52502700' // getAgentId()

  const params = { ...extraParams }
  if (agentId) params.agentId = agentId

  const query = Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  if (!query) return base
  const sep = base.includes('?') ? '&' : '?'
  const finalUrl = `${base}${sep}${query}`
  console.log('[buildWebviewUrl]', finalUrl)
  return finalUrl
}
