<template>
  <view class="webview-page">
    <!-- Loading overlay (shows while page is loading) -->
    <view v-if="loading" class="webview-page__loading">
      <text class="webview-page__loading-star">✦</text>
      <text class="webview-page__loading-text">加载中…</text>
    </view>

    <!--
      web-view is the uni-app cross-platform webview component.
      On WeChat Mini Program it renders <web-view>.
      On App it renders the native WKWebView / Android WebView.
      On H5 it renders an <iframe>.
    -->
    <web-view
      :src="webviewUrl"
      @message="onMessage"
      @load="onLoad"
      @error="onError"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad as onPageLoad } from '@dcloudio/uni-app'
import { setAgentId, buildWebviewUrl } from '../../utils/agent'

const webviewUrl = ref('')
const loading = ref(true)

onPageLoad((options) => {
  if (options?.agentId) {
    setAgentId(options.agentId)
  }

  // Allow overriding the URL (e.g. after payment redirect)
  if (options?.url) {
    const overrideUrl = decodeURIComponent(options.url)
    webviewUrl.value = buildWebviewUrl(overrideUrl)
    return
  }

  // On WeChat MP: login to get openid, then load the webview with it
  // #ifdef MP-WEIXIN
  uni.login({
    provider: 'weixin',
    success(loginRes) {
      uni.request({
        method: 'GET',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: 'https://kuixing.cloud/kx/kxapi.action?actionKey=getMiniProgramOpenid&code=' + loginRes.code,
        success(resp) {
          const mpOpenid = resp?.data?.kf?.dataDetail || ''
          
          webviewUrl.value = buildWebviewUrl('https://kuixing.cloud/?from=miniprogram', {
            mp_openid: mpOpenid,
          })
        },
        fail() {
          webviewUrl.value = buildWebviewUrl('https://kuixing.cloud/?from=miniprogram')
        },
      })
    },
    fail() {
      webviewUrl.value = buildWebviewUrl('https://kuixing.cloud/?from=miniprogram')
    },
  })
  // #endif

  // On other platforms: load directly without wx.login
  // #ifndef MP-WEIXIN
  webviewUrl.value = buildWebviewUrl('https://kuixing.cloud/?from=miniprogram')
  // #endif
})

function onLoad() {
  loading.value = false
}

function onError() {
  loading.value = false
  uni.showToast({ title: '页面加载失败，请检查网络', icon: 'none', duration: 2500 })
}

/**
 * Handle postMessage from the embedded web page.
 * WeChat: wx.miniProgram.postMessage({ data: { action: 'saveImage', url: '...' } })
 *
 * On WeChat MP, @message fires when the user navigates back or the mini program
 * calls a share. event.detail.data is an array of all queued messages.
 */
function onMessage(event) {
  const data = event?.detail?.data
  alert(data)
  if (!data) return

  const messages = Array.isArray(data) ? data : [data]
  
  for (const msg of messages) {
    alert(msg.action)
    if (msg.action === 'saveImage' && msg.url) {
      alert('saveimage')
      saveImageToAlbum(msg.url)
    }
  }
}

function saveImageToAlbum(imageUrl) {
  uni.showLoading({ title: '保存中…' })

  // Download the image first, then save to album
  uni.downloadFile({
    url: imageUrl,
    success(downloadRes) {
      if (downloadRes.statusCode !== 200) {
        uni.hideLoading()
        uni.showToast({ title: '图片下载失败', icon: 'none' })
        return
      }

      uni.saveImageToPhotosAlbum({
        filePath: downloadRes.tempFilePath,
        success() {
          uni.hideLoading()
          uni.showToast({ title: '已保存到相册', icon: 'success' })
        },
        fail(err) {
          uni.hideLoading()
          // User denied permission — guide them to settings
          if (err.errMsg?.includes('deny') || err.errMsg?.includes('auth')) {
            uni.showModal({
              title: '需要相册权限',
              content: '请在设置中开启相册写入权限',
              confirmText: '去设置',
              success(modalRes) {
                if (modalRes.confirm) {
                  uni.openSetting()
                }
              },
            })
          } else {
            uni.showToast({ title: '保存失败', icon: 'none' })
          }
        },
      })
    },
    fail() {
      uni.hideLoading()
      uni.showToast({ title: '图片下载失败', icon: 'none' })
    },
  })
}
</script>

<style lang="scss" scoped>
.webview-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #0D0221;
}

.webview-page__loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: #0D0221;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.webview-page__loading-star {
  font-size: 64rpx;
  color: #C9A84C;
  margin-bottom: 24rpx;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.webview-page__loading-text {
  font-size: 28rpx;
  color: #B8A9CC;
  letter-spacing: 4rpx;
}
</style>
