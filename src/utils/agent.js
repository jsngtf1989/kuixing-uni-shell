import { reactive } from "vue";

const state = reactive({
  agentId: "",
  mpOpenid: "",
  upLineAgentId: "",
});

/**
 * Persist and cache the agent referral ID.
 * Called from App.vue on launch / from onLoad on any page.
 */
export function setAgentId(id) {
  if (!id) return;
  state.agentId = String(id);
  try {
    uni.setStorageSync("kuixing_agent_id", state.agentId);
  } catch (_) {
    /* storage unavailable on some platforms during cold start */
  }
}

/**
 * Return the current agent ID (memory-first, falls back to storage).
 */
export function getAgentId() {
  if (state.agentId) return state.agentId;
  try {
    const stored = uni.getStorageSync("kuixing_agent_id");
    if (stored) {
      state.agentId = stored;
      return stored;
    }
  } catch (_) {
    /* ignore */
  }
  return "";
}

// ── Upline Agent ID (inviter) ──

export function setUpLineAgentId(id) {
  if (!id) return;
  state.upLineAgentId = String(id);
  try {
    uni.setStorageSync("kuixing_upline_agent_id", state.upLineAgentId);
  } catch (_) {
    /* ignore */
  }
}

export function getUpLineAgentId() {
  if (state.upLineAgentId) return state.upLineAgentId;
  try {
    const stored = uni.getStorageSync("kuixing_upline_agent_id");
    if (stored) {
      state.upLineAgentId = stored;
      return stored;
    }
  } catch (_) {
    /* ignore */
  }
  return "";
}

// ── OpenID ──

export function getOpenid() {
  if (state.mpOpenid) return state.mpOpenid;
  try {
    const cached = uni.getStorageSync("kuixing_mp_openid");
    if (cached) {
      state.mpOpenid = cached;
      return cached;
    }
  } catch (_) {}
  return "";
}

function storeOpenid(openid) {
  if (!openid) return;
  state.mpOpenid = openid;
  try {
    uni.setStorageSync("kuixing_mp_openid", openid);
  } catch (_) {}
}

/**
 * Preload openid + agentId on app start (WeChat MP only).
 * Runs uni.login → fetches openid → fetches agentId from backend.
 * Safe to call multiple times.
 */
export function preloadOnLaunch() {
  // #ifdef MP-WEIXIN
  const cached = getOpenid();
  if (cached) {
    fetchAgentIdByOpenid(cached);
    return;
  }

  uni.login({
    provider: "weixin",
    success(loginRes) {
      const reqUrl =
        "https://kuixing.cloud/kx/kxapi.action?actionKey=getMiniProgramOpenid&code=" +
        loginRes.code;
      uni.request({
        method: "GET",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        url: reqUrl,
        success(resp) {
          const openidData = resp?.data?.kf?.dataDetail;
          const openid =
            typeof openidData === "object" && openidData?.dataDetail
              ? openidData.dataDetail
              : openidData || "";
          storeOpenid(openid);
          fetchAgentIdByOpenid(openid);
        },
      });
    },
  });
  // #endif
}

// ── Agent ID from backend ──

/**
 * Fetch the agentId from the backend by the user's WeChat MP openid.
 * Fire-and-forget — does not block page loading, just ensures agentId
 * is available for sharing as soon as possible.
 */
export function fetchAgentIdByOpenid(mpOpenid) {
  if (!mpOpenid) return;

  const url =
    "https://kuixing.cloud/kx/kxapi.action?actionKey=getAgentIdByWeChatMpOpenId&mpOpenId=" +
    encodeURIComponent(mpOpenid);

  uni.request({
    method: "GET",
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url,
    success(resp) {
      const detail = resp?.data?.kf?.dataDetail;
      if (detail) {
        setAgentId(
          typeof detail === "object" ? detail.dataDetail || "" : detail,
        );
      }
    },
    fail(err) {
      console.warn("[fetchAgentIdByOpenid] failed:", err);
    },
  });
}

/**
 * Build the full webview URL, appending agentId and optional extra params.
 */
export function buildWebviewUrl(
  base = "https://kuixing.cloud/?from=miniprogram",
  extraParams = {},
) {
  const upLineAgentId = getUpLineAgentId();

  const params = { ...extraParams };
  if (upLineAgentId) params.agentId = upLineAgentId;

  const query = Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  if (!query) return base;
  const sep = base.includes("?") ? "&" : "?";
  const finalUrl = `${base}${sep}${query}`;
  console.log("[buildWebviewUrl]", finalUrl);
  return finalUrl;
}
