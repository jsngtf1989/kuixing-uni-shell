<template>
  <view class="splash" :class="{ 'splash--visible': visible, 'splash--fade-out': fadeOut }">
    <!-- Decorative background particles -->
    <view class="splash__particle splash__particle--1" />
    <view class="splash__particle splash__particle--2" />
    <view class="splash__particle splash__particle--3" />

    <!-- Centered logo area -->
    <view class="splash__content">
      <view class="splash__logo-ring">
        <view class="splash__logo-inner">
          <text class="splash__star">✦</text>
        </view>
      </view>

      <text class="splash__title">魁星</text>
      <text class="splash__subtitle">紫微斗数 · 命理平台</text>

      <view class="splash__divider" />

      <text class="splash__tagline">探索星命奥秘</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { setAgentId } from '../../utils/agent'

const visible = ref(false)
const fadeOut = ref(false)

onLoad((options) => {
  if (options?.agentId) {
    setAgentId(options.agentId)
  }
  if (options?.scene) {
    try {
      const scene = decodeURIComponent(options.scene)
      const params = new URLSearchParams(scene)
      if (params.get('agentId')) {
        setAgentId(params.get('agentId'))
      }
    } catch (_) { /* ignore */ }
  }
})

onMounted(() => {
  // Fade in
  setTimeout(() => {
    visible.value = true
  }, 100)

  // After 2.4 s start fading out, then navigate
  setTimeout(() => {
    fadeOut.value = true
  }, 2400)

  setTimeout(() => {
    uni.reLaunch({ url: '/pages/home/home' })
  }, 3000)
})
</script>

<style lang="scss" scoped>
.splash {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(170deg, #0D0221 0%, #1A0A3E 40%, #12082E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.8s ease;
  overflow: hidden;

  &--visible {
    opacity: 1;
  }

  &--fade-out {
    opacity: 0;
    transition: opacity 0.6s ease;
  }
}

/* Floating decorative dots */
.splash__particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.3) 0%, transparent 70%);

  &--1 {
    width: 300rpx;
    height: 300rpx;
    top: 10%;
    left: -8%;
    animation: float-slow 6s ease-in-out infinite;
  }

  &--2 {
    width: 200rpx;
    height: 200rpx;
    top: 60%;
    right: -5%;
    animation: float-slow 5s ease-in-out infinite reverse;
  }

  &--3 {
    width: 150rpx;
    height: 150rpx;
    bottom: 15%;
    left: 20%;
    animation: float-slow 7s ease-in-out infinite;
  }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30rpx); }
}

.splash__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.splash__logo-ring {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(201, 168, 76, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48rpx;
  box-shadow: 0 0 60rpx rgba(201, 168, 76, 0.15), inset 0 0 40rpx rgba(201, 168, 76, 0.08);
  animation: ring-pulse 3s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% { box-shadow: 0 0 60rpx rgba(201, 168, 76, 0.15), inset 0 0 40rpx rgba(201, 168, 76, 0.08); }
  50% { box-shadow: 0 0 80rpx rgba(201, 168, 76, 0.3), inset 0 0 60rpx rgba(201, 168, 76, 0.15); }
}

.splash__logo-inner {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(201, 168, 76, 0.2) 0%, rgba(201, 168, 76, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash__star {
  font-size: 72rpx;
  color: #C9A84C;
}

.splash__title {
  font-size: 72rpx;
  font-weight: 700;
  color: #E8D5A3;
  letter-spacing: 16rpx;
  margin-bottom: 16rpx;
}

.splash__subtitle {
  font-size: 28rpx;
  color: #B8A9CC;
  letter-spacing: 6rpx;
  margin-bottom: 40rpx;
}

.splash__divider {
  width: 120rpx;
  height: 2rpx;
  background: linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%);
  margin-bottom: 40rpx;
}

.splash__tagline {
  font-size: 24rpx;
  color: rgba(201, 168, 76, 0.6);
  letter-spacing: 8rpx;
}
</style>
