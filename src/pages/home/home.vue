<template>
  <view class="home">
    <!-- Status bar spacer -->
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Ambient background orbs -->
    <view class="home__orb home__orb--1" />
    <view class="home__orb home__orb--2" />

    <!-- ─── Header ─── -->
    <view class="home__header">
      <view class="home__logo-mark">
        <text class="home__logo-char">魁</text>
      </view>
      <text class="home__title">魁星命理</text>
      <view class="home__rule">
        <view class="home__rule-wing" />
        <view class="home__rule-diamond" />
        <view class="home__rule-wing" />
      </view>
      <text class="home__subtitle">紫微斗数 · 专业命理平台</text>
    </view>

    <!-- ─── Section: Core Features ─── -->
    <view class="home__section">
      <view class="home__section-head">
        <view class="home__dash" />
        <text class="home__section-title">命理功能</text>
        <view class="home__dash" />
      </view>

      <view class="home__grid">
        <view class="home__grid-row">
          <FeatureCard
            v-for="item in topRow1"
            :key="item.label"
            :icon="item.icon"
            :label="item.label"
            class="home__cell"
            @tap="onCardTap(item)"
          />
        </view>
        <view class="home__grid-row">
          <FeatureCard
            v-for="item in topRow2"
            :key="item.label"
            :icon="item.icon"
            :label="item.label"
            class="home__cell"
            @tap="onCardTap(item)"
          />
        </view>
      </view>
    </view>

    <!-- ─── Section: Info ─── -->
    <view class="home__section">
      <view class="home__section-head">
        <view class="home__dash" />
        <text class="home__section-title">了解更多</text>
        <view class="home__dash" />
      </view>

      <view class="home__grid-row">
        <FeatureCard
          v-for="item in infoItems"
          :key="item.label"
          :icon="item.icon"
          :label="item.label"
          class="home__cell"
          @tap="onCardTap(item)"
        />
      </view>
    </view>

    <!-- ─── CTA ─── -->
    <view class="home__cta-section">
      <view class="home__cta-ornament">
        <view class="home__cta-line" />
        <text class="home__cta-ornament-char">✦</text>
        <view class="home__cta-line" />
      </view>

      <view class="home__cta" @click="onStartJourney">
        <text class="home__cta-text">开启魁星之旅</text>
      </view>

      <text class="home__cta-hint">探索紫微星命的奥秘</text>
    </view>

    <!-- Bottom safe area -->
    <view class="home__safe-bottom" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FeatureCard from '../../components/FeatureCard.vue'

const statusBarHeight = ref(0)

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0
  },
})

const topRow1 = [
  { icon: '紫', label: '紫微', action: 'webview' },
  { icon: '命', label: '八字', action: 'webview' },
  { icon: '运', label: '大运', action: 'webview' },
]

const topRow2 = [
  { icon: '年', label: '流年', action: 'webview' },
  { icon: '月', label: '流月', action: 'webview' },
  { icon: '日', label: '流日', action: 'webview' },
]

const infoItems = [
  { icon: '缘', label: '联系我们', action: 'contact' },
  { icon: '魁', label: '关于魁星', action: 'about' },
]

function onCardTap(item) {
  if (item.action === 'webview') {
    uni.navigateTo({ url: '/pages/webview/webview' })
  } else if (item.action === 'contact') {
    uni.showModal({
      title: '联系我们',
      content: '请访问 kuixing.cloud 获取联系方式',
      showCancel: false,
    })
  } else if (item.action === 'about') {
    uni.showModal({
      title: '关于魁星',
      content: '魁星命理 — 专业紫微斗数命理平台\n版本 1.0.0',
      showCancel: false,
    })
  }
}

function onStartJourney() {
  uni.navigateTo({ url: '/pages/webview/webview' })
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(175deg, #0D0221 0%, #160D38 35%, #1A0A3E 55%, #110828 100%);
  padding: 0 36rpx;
  box-sizing: border-box;
  overflow: hidden;
}

/* ── Ambient background orbs ── */
.home__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80rpx);

  &--1 {
    width: 400rpx;
    height: 400rpx;
    top: 8%;
    right: -15%;
    background: radial-gradient(circle, rgba(123, 79, 191, 0.12) 0%, transparent 70%);
  }

  &--2 {
    width: 350rpx;
    height: 350rpx;
    bottom: 20%;
    left: -12%;
    background: radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%);
  }
}

/* ── Header ── */
.home__header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0 40rpx;
  z-index: 1;
}

.home__logo-mark {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(201, 168, 76, 0.35);
  background: linear-gradient(145deg, rgba(42, 22, 96, 0.8) 0%, rgba(26, 10, 62, 0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  box-shadow: 0 0 50rpx rgba(201, 168, 76, 0.1);
}

.home__logo-char {
  font-size: 48rpx;
  font-weight: 700;
  color: #D4B05E;
  line-height: 1;
}

.home__title {
  font-size: 52rpx;
  font-weight: 700;
  color: #E8D5A3;
  letter-spacing: 12rpx;
  margin-bottom: 20rpx;
}

/* Decorative horizontal rule with diamond */
.home__rule {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.home__rule-wing {
  width: 80rpx;
  height: 1rpx;
  background: linear-gradient(90deg, transparent 0%, rgba(201, 168, 76, 0.5) 100%);

  &:last-child {
    background: linear-gradient(90deg, rgba(201, 168, 76, 0.5) 0%, transparent 100%);
  }
}

.home__rule-diamond {
  width: 10rpx;
  height: 10rpx;
  background: #C9A84C;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.home__subtitle {
  font-size: 24rpx;
  color: #9B8ABF;
  letter-spacing: 6rpx;
}

/* ── Sections ── */
.home__section {
  position: relative;
  z-index: 1;
  margin-bottom: 12rpx;
}

.home__section-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.home__section-title {
  font-size: 22rpx;
  color: #7E6B9E;
  letter-spacing: 8rpx;
  white-space: nowrap;
}

.home__dash {
  width: 56rpx;
  height: 1rpx;
  background: linear-gradient(90deg, transparent 0%, rgba(126, 107, 158, 0.4) 50%, transparent 100%);
}

/* ── Grid ── */
.home__grid {
  margin-bottom: 0;
}

.home__grid-row {
  display: flex;
  margin-bottom: 20rpx;
}

.home__cell {
  flex: 1;
  margin: 0 10rpx;
  min-height: 190rpx;

  &:first-child { margin-left: 0; }
  &:last-child { margin-right: 0; }
}


/* ── CTA Section ── */
.home__cta-section {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 0 12rpx;
}

.home__cta-ornament {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 36rpx;
}

.home__cta-ornament-char {
  font-size: 22rpx;
  color: rgba(201, 168, 76, 0.35);
}

.home__cta-line {
  width: 100rpx;
  height: 1rpx;
  background: linear-gradient(90deg, transparent 0%, rgba(201, 168, 76, 0.2) 50%, transparent 100%);
}

.home__cta {
  width: 100%;
  max-width: 600rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background: linear-gradient(135deg, #D4B05E 0%, #B8923A 50%, #C9A84C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8rpx 40rpx rgba(201, 168, 76, 0.25),
    0 2rpx 8rpx rgba(201, 168, 76, 0.15),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s ease;
  margin-bottom: 20rpx;

  &:active {
    transform: scale(0.97);
    box-shadow:
      0 4rpx 20rpx rgba(201, 168, 76, 0.15),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
  }
}

.home__cta-text {
  font-size: 34rpx;
  font-weight: 600;
  color: #0D0221;
  letter-spacing: 8rpx;
}

.home__cta-hint {
  font-size: 20rpx;
  color: rgba(155, 138, 191, 0.6);
  letter-spacing: 4rpx;
}

/* ── Safe area ── */
.home__safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
