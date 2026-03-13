<template>
  <view class="webview-page">
    <!-- Loading overlay (visible until web-view is ready) -->
    <view v-if="loading" class="webview-page__loading">
      <view class="webview-page__loading-orb" />
      <view class="webview-page__loading-ring" />
      <text class="webview-page__loading-star">✦</text>
      <text class="webview-page__loading-text">加载中…</text>
      <view class="webview-page__loading-dots">
        <view class="webview-page__loading-dot" />
        <view class="webview-page__loading-dot" />
        <view class="webview-page__loading-dot" />
      </view>
    </view>

    <web-view
      v-if="webviewUrl"
      :src="webviewUrl"
      @message="onMessage"
      @load="onLoad"
      @error="onError"
    />
  </view>
</template>

<script setup>
import { ref } from "vue";
import {
  onLoad as onPageLoad,
  onShareAppMessage,
  onShareTimeline,
} from "@dcloudio/uni-app";
import {
  setAgentId,
  getAgentId,
  getOpenid,
  buildWebviewUrl,
} from "../../utils/agent";

const webviewUrl = ref("");
const loading = ref(true);
let loadingTimer = null;

function hideLoading() {
  loading.value = false;
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
}

onPageLoad((options) => {
  loadingTimer = setTimeout(hideLoading, 8000);

  if (options?.url) {
    const overrideUrl = decodeURIComponent(options.url);
    webviewUrl.value = buildWebviewUrl(overrideUrl);
    return;
  }

  // OpenID was already fetched on app launch (preloadOnLaunch).
  // Use cached value to build the webview URL immediately.
  // #ifdef MP-WEIXIN
  const mpOpenid = getOpenid();
  webviewUrl.value = buildWebviewUrl(
    "https://kuixing.cloud/?from=miniprogram",
    mpOpenid ? { mp_openid: mpOpenid } : {},
  );
  // #endif

  // #ifndef MP-WEIXIN
  webviewUrl.value = buildWebviewUrl("https://kuixing.cloud/?from=miniprogram");
  // #endif
});

function onLoad() {
  hideLoading();
}

function onError() {
  hideLoading();
  uni.showToast({
    title: "页面加载失败，请检查网络",
    icon: "none",
    duration: 2500,
  });
}

/**
 * Handle postMessage from the embedded web page.
 *
 * On WeChat MP, @message fires when the user navigates back, shares, or the
 * component is destroyed. Messages are queued and delivered at that moment.
 * Since @message fires BEFORE onShareAppMessage, the agentId posted by the
 * web app is stored in time for the share config to read it.
 */
function onMessage(event) {
  const data = event?.detail?.data;
  if (!data) return;

  const messages = Array.isArray(data) ? data : [data];

  for (const msg of messages) {
    if (msg.action === "setAgentId" && msg.agentId) {
      uni.showToast({
        title: `receive agentId: ` + msg.agentId,
        icon: "none",
        duration: 2500,
      });
      setAgentId(msg.agentId);
    } else if (msg.action === "saveImage" && msg.url) {
      saveImageToAlbum(msg.url);
    }
  }
}

function saveImageToAlbum(imageUrl) {
  uni.showLoading({ title: "保存中…" });

  uni.downloadFile({
    url: imageUrl,
    success(downloadRes) {
      if (downloadRes.statusCode !== 200) {
        uni.hideLoading();
        uni.showToast({ title: "图片下载失败", icon: "none" });
        return;
      }

      uni.saveImageToPhotosAlbum({
        filePath: downloadRes.tempFilePath,
        success() {
          uni.hideLoading();
          uni.showToast({ title: "已保存到相册", icon: "success" });
        },
        fail(err) {
          uni.hideLoading();
          if (err.errMsg?.includes("deny") || err.errMsg?.includes("auth")) {
            uni.showModal({
              title: "需要相册权限",
              content: "请在设置中开启相册写入权限",
              confirmText: "去设置",
              success(modalRes) {
                if (modalRes.confirm) {
                  uni.openSetting();
                }
              },
            });
          } else {
            uni.showToast({ title: "保存失败", icon: "none" });
          }
        },
      });
    },
    fail() {
      uni.hideLoading();
      uni.showToast({ title: "图片下载失败", icon: "none" });
    },
  });
}

// ── Sharing ──
// On WeChat MP, @message fires BEFORE onShareAppMessage, so the agentId
// posted by the web app is stored in time for the share config to read it.

function buildSharePath() {
  const agentId = getAgentId();
  return agentId
    ? `/pages/splash/splash?agentId=${agentId}`
    : "/pages/splash/splash";
}

onShareAppMessage(() => ({
  title: "魁星国学 · 紫微斗数专业命理平台",
  path: buildSharePath(),
}));

onShareTimeline(() => {
  const agentId = getAgentId();
  return {
    title: "魁星国学 · 紫微斗数专业命理平台",
    query: agentId ? `agentId=${agentId}` : "",
  };
});
</script>

<style lang="scss" scoped>
.webview-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #0d0221;
}

.webview-page__loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: radial-gradient(
    circle at 50% 42%,
    #1a0a3e 0%,
    #0d0221 60%,
    #000 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.webview-page__loading-orb {
  position: absolute;
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(201, 168, 76, 0.08) 0%,
    transparent 70%
  );
  filter: blur(40rpx);
  animation: orb-breathe 3s ease-in-out infinite;
}

@keyframes orb-breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

.webview-page__loading-ring {
  position: absolute;
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(201, 168, 76, 0.15);
  animation: ring-spin 4s linear infinite;
}

@keyframes ring-spin {
  0% {
    transform: rotate(0deg) scale(1);
    border-color: rgba(201, 168, 76, 0.15);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    border-color: rgba(201, 168, 76, 0.3);
  }
  100% {
    transform: rotate(360deg) scale(1);
    border-color: rgba(201, 168, 76, 0.15);
  }
}

.webview-page__loading-star {
  font-size: 72rpx;
  color: #f0d76e;
  margin-bottom: 32rpx;
  text-shadow:
    0 0 16rpx rgba(240, 215, 110, 0.6),
    0 0 48rpx rgba(201, 168, 76, 0.3);
  animation: star-pulse 2s ease-in-out infinite;
  z-index: 2;
}

@keyframes star-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.15) rotate(15deg);
  }
}

.webview-page__loading-text {
  font-size: 28rpx;
  color: #b8a9cc;
  letter-spacing: 6rpx;
  z-index: 2;
}

.webview-page__loading-dots {
  display: flex;
  gap: 16rpx;
  margin-top: 32rpx;
  z-index: 2;
}

.webview-page__loading-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #c9a84c;
  animation: dot-bounce 1.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
