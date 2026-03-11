<template>
  <view class="pay-page">
    <view v-if="loading" class="pay-page__loading">
      <text class="pay-page__loading-star">✦</text>
      <text class="pay-page__loading-text">正在发起支付...</text>
    </view>
    <view v-if="error" class="pay-page__error">
      <text class="pay-page__error-icon">✕</text>
      <text class="pay-page__error-text">{{ error }}</text>
      <view class="pay-page__error-btn" @tap="goBack">返回</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const loading = ref(true)
const error = ref('')

onLoad((options) => {
  const qty = options?.qty
  const uid = decodeURIComponent(options?.uid || '')

  if (!qty || !uid) {
    loading.value = false
    error.value = '参数缺失'
    return
  }

  startPayment(qty, uid)
})

async function startPayment(qty, uid) {
  try {
    // #ifdef MP-WEIXIN
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject,
      })
    })

    const res = await new Promise((resolve, reject) => {
      uni.request({
        method: 'GET',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url:
          'https://kuixing.cloud/kx/kxapi.action?actionKey=startMakingPaymentByWxMiniProgram' +
          '&code=' + loginRes.code +
          '&qty=' + qty +
          '&uid=' + encodeURIComponent(uid),
        success: (r) => resolve(r.data),
        fail: reject,
      })
    })

    const pay = res.kf.dataDetail

    await new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: pay.timeStamp,
        nonceStr: pay.nonceStr,
        package: pay.packageValue,
        signType: pay.signType,
        paySign: pay.paySign,
        success: resolve,
        fail: (err) => {
          if (err.errMsg && err.errMsg.includes('cancel')) {
            reject(new Error('cancel'))
          } else {
            reject(err)
          }
        },
      })
    })

    uni.redirectTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent('https://kuixing.cloud/topupsuccess'),
    })
    // #endif

    // #ifndef MP-WEIXIN
    loading.value = false
    error.value = '微信支付仅在小程序内可用'
    // #endif
  } catch (err) {
    if (err.message === 'cancel') {
      uni.navigateBack()
      return
    }
    loading.value = false
    error.value = '支付失败: ' + (err.errMsg || err.message || JSON.stringify(err))
  }
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.pay-page {
  width: 100vw;
  height: 100vh;
  background: #0D0221;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pay-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pay-page__loading-star {
  font-size: 64rpx;
  color: #C9A84C;
  margin-bottom: 24rpx;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.pay-page__loading-text {
  font-size: 28rpx;
  color: #B8A9CC;
  letter-spacing: 4rpx;
}

.pay-page__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.pay-page__error-icon {
  font-size: 80rpx;
  color: #E74C3C;
  margin-bottom: 24rpx;
}

.pay-page__error-text {
  font-size: 28rpx;
  color: #B8A9CC;
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.6;
}

.pay-page__error-btn {
  padding: 16rpx 64rpx;
  background: rgba(201, 168, 76, 0.15);
  border: 1rpx solid #C9A84C;
  border-radius: 40rpx;
  color: #C9A84C;
  font-size: 28rpx;
  letter-spacing: 2rpx;
}
</style>
