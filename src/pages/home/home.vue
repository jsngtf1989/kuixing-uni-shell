<template>
  <view class="home">
    <!-- Status bar spacer -->
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Ambient background orbs -->
    <view class="home__orb home__orb--1" />
    <view class="home__orb home__orb--2" />

    <scroll-view
      scroll-y
      :show-scrollbar="false"
      :enhanced="true"
      class="home__scroll"
    >
      <!-- ─── Header ─── -->
      <view class="home__header">
        <view class="home__logo-mark">
          <image
            class="home__logo-img"
            src="/static/images/kuixinghomelogo.png"
            mode="aspectFit"
          />
        </view>
        <text class="home__title">魁星国学</text>
        <view class="home__rule">
          <view class="home__rule-wing" />
          <view class="home__rule-diamond" />
          <view class="home__rule-wing" />
        </view>
        <text class="home__subtitle">紫微斗数 · 专业命理平台</text>

        <!-- ─── CTA (hero) ─── -->
        <view class="home__cta" @click="onStartJourney">
          <text class="home__cta-text">开启魁星之旅</text>
          <text class="home__cta-arrow">→</text>
        </view>
        <text class="home__cta-hint">点击进入 · 探索紫微星命的奥秘</text>
      </view>

      <!-- ─── Section: 命理视频 ─── -->
      <view class="home__section">
        <view class="home__section-head">
          <view class="home__dash" />
          <text class="home__section-title">命理视频</text>
          <view class="home__dash" />
        </view>

        <view class="home__grid">
          <view class="home__grid-row">
            <FeatureCard
              v-for="item in videoRow1"
              :key="item.label"
              :icon="item.icon"
              :label="item.label"
              class="home__cell"
              @tap="onCardTap(item)"
            />
          </view>
          <view class="home__grid-row">
            <FeatureCard
              v-for="item in videoRow2"
              :key="item.label"
              :icon="item.icon"
              :label="item.label"
              class="home__cell"
              @tap="onCardTap(item)"
            />
          </view>
        </view>
      </view>

      <!-- ─── Section: 实用工具 ─── -->
      <view class="home__section">
        <view class="home__section-head">
          <view class="home__dash" />
          <text class="home__section-title">实用工具</text>
          <view class="home__dash" />
        </view>

        <view class="home__grid-row">
          <FeatureCard
            v-for="item in toolItems"
            :key="item.label"
            :icon="item.icon"
            :label="item.label"
            :subtitle="item.subtitle"
            class="home__cell"
            @tap="onCardTap(item)"
          />
        </view>
      </view>

      <!-- ─── Footer links: 关于/协议/隐私 ─── -->
      <view class="home__footer">
        <view
          v-for="item in footerItems"
          :key="item.label"
          class="home__footer-item"
          @tap="onCardTap(item)"
        >
          <view class="home__footer-icon-wrap">
            <text class="home__footer-icon">{{ item.icon }}</text>
          </view>
          <text class="home__footer-label">{{ item.label }}</text>
          <text class="home__footer-chevron">›</text>
        </view>
      </view>

      <!-- Bottom safe area -->
      <view class="home__safe-bottom" />
    </scroll-view>

    <!-- ─── Portal Transition Overlay ─── -->
    <view v-if="showPortal" class="portal">
      <view class="portal__bg" />

      <!-- Expanding rings -->
      <view class="portal__ring portal__ring--1" />
      <view class="portal__ring portal__ring--2" />
      <view class="portal__ring portal__ring--3" />

      <!-- Central star burst -->
      <view class="portal__star">
        <text class="portal__star-glyph">✦</text>
      </view>

      <!-- Radiating particles -->
      <view class="portal__particle portal__particle--1" />
      <view class="portal__particle portal__particle--2" />
      <view class="portal__particle portal__particle--3" />
      <view class="portal__particle portal__particle--4" />
      <view class="portal__particle portal__particle--5" />
      <view class="portal__particle portal__particle--6" />
      <view class="portal__particle portal__particle--7" />
      <view class="portal__particle portal__particle--8" />

      <!-- Caption text -->
      <view class="portal__caption">
        <text class="portal__caption-text">命运之门已开启</text>
        <text class="portal__caption-sub">· 探索星命 ·</text>
      </view>

      <!-- Final flash wipe -->
      <view class="portal__flash" />
    </view>

    <!-- ─── Video Overlay ─── -->
    <view
      v-if="showVideo && videoSrc"
      class="video-overlay"
      @tap.self="closeVideo"
    >
      <view class="video-overlay__box">
        <video
          v-if="videoSrc"
          class="video-overlay__player"
          :src="videoSrc"
          autoplay
          controls
          show-center-play-btn
          object-fit="contain"
          @ended="closeVideo"
        />
        <view class="video-overlay__close" @tap="closeVideo">
          <text class="video-overlay__close-icon">✕</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import FeatureCard from "../../components/FeatureCard.vue";
import { getAgentId } from "../../utils/agent";

const statusBarHeight = ref(0);

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

const showVideo = ref(false);
const videoSrc = ref("");
const showPortal = ref(false);

// ── Section 1: 命理视频 (6 cards) ──
const videoRow1 = [
  {
    icon: "紫",
    label: "紫微",
    action: "video",
    video: "https://kuixing.cloud/videos/ziwei-intro.mp4",
  },
  {
    icon: "命",
    label: "八字",
    action: "video",
    video: "https://kuixing.cloud/videos/bazi-intro.mp4",
  },
  {
    icon: "运",
    label: "大运",
    action: "video",
    video: "https://kuixing.cloud/videos/dayun-intro.mp4",
  },
];

const videoRow2 = [
  {
    icon: "年",
    label: "流年",
    action: "video",
    video: "https://kuixing.cloud/videos/liunian-intro.mp4",
  },
  {
    icon: "月",
    label: "流月",
    action: "video",
    video: "https://kuixing.cloud/videos/liuyue-intro.mp4",
  },
  {
    icon: "日",
    label: "流日",
    action: "video",
    video: "https://kuixing.cloud/videos/liuri-intro.mp4",
  },
];

// ── Section 2: 实用工具 (2 cards) ──
const toolItems = [
  {
    icon: "历",
    label: "老黄历",
    subtitle: "天干地支万年历",
    action: "navigate",
    url: "/pages/calendar/calendar",
  },
  {
    icon: "言",
    label: "意见反馈",
    subtitle: "帮助我们改进",
    action: "navigate",
    url: "/pages/feedback/feedback",
  },
];

// ── Footer: 关于/协议/隐私 (3 list items) ──
const footerItems = [
  {
    icon: "魁",
    label: "关于我们",
    action: "navigate",
    url: "/pages/about/about",
  },
  {
    icon: "约",
    label: "用户协议",
    action: "content",
    actionKey: "getSingleDataByDocType&dataType=user-terms-zh",
  },
  {
    icon: "私",
    label: "隐私政策",
    action: "content",
    actionKey: "getSingleDataByDocType&dataType=privacy-policy-zh",
  },
];

let navigating = false;

function onCardTap(item) {
  if (item.action === "video") {
    videoSrc.value = item.video;
    showVideo.value = true;
    return;
  }

  if (navigating) return;
  navigating = true;
  setTimeout(() => {
    navigating = false;
  }, 600);

  if (item.action === "navigate") {
    uni.navigateTo({ url: item.url });
  } else if (item.action === "content") {
    uni.navigateTo({
      url: `/pages/content-detail/content-detail?actionKey=${item.actionKey}&title=${encodeURIComponent(item.label)}`,
    });
  }
}

function closeVideo() {
  showVideo.value = false;
  videoSrc.value = "";
}

function onStartJourney() {
  if (showPortal.value) return;
  showPortal.value = true;

  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/webview/webview",
      success() {
        setTimeout(() => {
          showPortal.value = false;
        }, 300);
      },
      fail() {
        showPortal.value = false;
      },
    });
  }, 1800);
}

// ── Sharing ──

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
.home {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(
    175deg,
    #0d0221 0%,
    #160d38 35%,
    #1a0a3e 55%,
    #110828 100%
  );
  padding: 0 36rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.home__scroll {
  height: 100vh;
}

/* ── Ambient background orbs ── */
.home__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80rpx);
  z-index: 0;

  &--1 {
    width: 400rpx;
    height: 400rpx;
    top: 8%;
    right: -15%;
    background: radial-gradient(
      circle,
      rgba(123, 79, 191, 0.12) 0%,
      transparent 70%
    );
  }

  &--2 {
    width: 350rpx;
    height: 350rpx;
    bottom: 20%;
    left: -12%;
    background: radial-gradient(
      circle,
      rgba(201, 168, 76, 0.08) 0%,
      transparent 70%
    );
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.home__logo-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.home__title {
  font-size: 52rpx;
  font-weight: 700;
  color: #e8d5a3;
  letter-spacing: 12rpx;
  margin-bottom: 20rpx;
}

.home__rule {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.home__rule-wing {
  width: 80rpx;
  height: 1rpx;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(201, 168, 76, 0.5) 100%
  );

  &:last-child {
    background: linear-gradient(
      90deg,
      rgba(201, 168, 76, 0.5) 0%,
      transparent 100%
    );
  }
}

.home__rule-diamond {
  width: 10rpx;
  height: 10rpx;
  background: #c9a84c;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.home__subtitle {
  font-size: 24rpx;
  color: #9b8abf;
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
  color: #7e6b9e;
  letter-spacing: 8rpx;
  white-space: nowrap;
}

.home__dash {
  width: 56rpx;
  height: 1rpx;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(126, 107, 158, 0.4) 50%,
    transparent 100%
  );
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

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
}

/* ── CTA Button (inside header) ── */
.home__cta {
  margin-top: 40rpx;
  width: 100%;
  max-width: 600rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background: linear-gradient(135deg, #d4b05e 0%, #b8923a 50%, #c9a84c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow:
    0 8rpx 40rpx rgba(201, 168, 76, 0.3),
    0 2rpx 8rpx rgba(201, 168, 76, 0.2),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.25);
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease;
  margin-bottom: 20rpx;
  animation: cta-glow 2.5s ease-in-out infinite;

  &:active {
    transform: scale(0.95);
    box-shadow:
      0 4rpx 16rpx rgba(201, 168, 76, 0.15),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
  }
}

@keyframes cta-glow {
  0%,
  100% {
    box-shadow:
      0 8rpx 40rpx rgba(201, 168, 76, 0.3),
      0 2rpx 8rpx rgba(201, 168, 76, 0.2),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.25);
  }
  50% {
    box-shadow:
      0 10rpx 60rpx rgba(201, 168, 76, 0.45),
      0 4rpx 16rpx rgba(201, 168, 76, 0.3),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.3);
  }
}

.home__cta-text {
  font-size: 34rpx;
  font-weight: 600;
  color: #0d0221;
  letter-spacing: 8rpx;
}

.home__cta-arrow {
  font-size: 36rpx;
  font-weight: 700;
  color: #0d0221;
  animation: arrow-nudge 1.5s ease-in-out infinite;
}

@keyframes arrow-nudge {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(8rpx);
  }
}

.home__cta-hint {
  font-size: 20rpx;
  color: rgba(155, 138, 191, 0.6);
  letter-spacing: 4rpx;
}

/* ── Footer list items ── */
.home__footer {
  position: relative;
  z-index: 1;
  margin-top: 36rpx;
  background: rgba(26, 11, 66, 0.4);
  border: 1rpx solid rgba(201, 168, 76, 0.08);
  border-radius: 24rpx;
  overflow: hidden;
}

.home__footer-item {
  display: flex;
  align-items: center;
  padding: 28rpx 28rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.03);
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: rgba(201, 168, 76, 0.05);
  }
}

.home__footer-icon-wrap {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(201, 168, 76, 0.15),
    rgba(201, 168, 76, 0.05)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.home__footer-icon {
  font-size: 24rpx;
  color: #d4b05e;
}

.home__footer-label {
  flex: 1;
  font-size: 28rpx;
  color: #b8a9cc;
  letter-spacing: 2rpx;
}

.home__footer-chevron {
  font-size: 32rpx;
  color: rgba(201, 168, 76, 0.3);
  flex-shrink: 0;
}

/* ── Safe area ── */
.home__safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* ── Video Overlay ── */
.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-overlay__box {
  position: relative;
  width: 90%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.video-overlay__player {
  width: 100%;
  height: 100%;
}

.video-overlay__close {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.video-overlay__close-icon {
  font-size: 28rpx;
  color: #fff;
  line-height: 1;
}

/* ══════════════════════════════════════════
   Portal transition
   ══════════════════════════════════════════ */
.portal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

.portal__bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 45%,
    #1a0a3e 0%,
    #0d0221 60%,
    #000 100%
  );
  animation: portal-bg-in 0.5s ease-out forwards;
}

@keyframes portal-bg-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* ── Central star ── */
.portal__star {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: star-entrance 1.6s ease-out forwards;
}

.portal__star-glyph {
  font-size: 80rpx;
  color: #f0d76e;
  text-shadow:
    0 0 20rpx rgba(240, 215, 110, 0.9),
    0 0 60rpx rgba(201, 168, 76, 0.6),
    0 0 120rpx rgba(201, 168, 76, 0.3);
  animation: star-pulse 1.6s ease-in-out forwards;
}

@keyframes star-entrance {
  0% {
    transform: translate(-50%, -55%) scale(0);
    opacity: 0;
  }
  20% {
    transform: translate(-50%, -55%) scale(1.3);
    opacity: 1;
  }
  35% {
    transform: translate(-50%, -55%) scale(1);
  }
  80% {
    transform: translate(-50%, -55%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -55%) scale(3);
    opacity: 0;
  }
}

@keyframes star-pulse {
  0% {
    font-size: 0rpx;
  }
  20% {
    font-size: 100rpx;
  }
  35% {
    font-size: 80rpx;
  }
  80% {
    font-size: 90rpx;
  }
  100% {
    font-size: 200rpx;
  }
}

/* ── Expanding rings ── */
.portal__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2rpx solid rgba(201, 168, 76, 0.5);
  transform: translate(-50%, -55%) scale(0);
  z-index: 5;

  &--1 {
    width: 200rpx;
    height: 200rpx;
    border-color: rgba(201, 168, 76, 0.6);
    animation: ring-expand 1.4s 0.2s ease-out forwards;
  }
  &--2 {
    width: 400rpx;
    height: 400rpx;
    border-color: rgba(155, 138, 191, 0.4);
    animation: ring-expand 1.4s 0.4s ease-out forwards;
  }
  &--3 {
    width: 700rpx;
    height: 700rpx;
    border-color: rgba(123, 79, 191, 0.25);
    animation: ring-expand 1.4s 0.6s ease-out forwards;
  }
}

@keyframes ring-expand {
  0% {
    transform: translate(-50%, -55%) scale(0);
    opacity: 1;
  }
  70% {
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -55%) scale(2.5);
    opacity: 0;
  }
}

/* ── Radiating particles ── */
.portal__particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #f0d76e;
  box-shadow: 0 0 12rpx rgba(240, 215, 110, 0.8);
  z-index: 8;
  opacity: 0;

  &--1 {
    animation: particle-fly 1.2s 0.3s ease-out forwards;
    --px: -200rpx;
    --py: -300rpx;
  }
  &--2 {
    animation: particle-fly 1.2s 0.35s ease-out forwards;
    --px: 200rpx;
    --py: -280rpx;
  }
  &--3 {
    animation: particle-fly 1.2s 0.4s ease-out forwards;
    --px: -300rpx;
    --py: 50rpx;
  }
  &--4 {
    animation: particle-fly 1.2s 0.45s ease-out forwards;
    --px: 300rpx;
    --py: 80rpx;
  }
  &--5 {
    animation: particle-fly 1.2s 0.5s ease-out forwards;
    --px: -120rpx;
    --py: 320rpx;
  }
  &--6 {
    animation: particle-fly 1.2s 0.55s ease-out forwards;
    --px: 150rpx;
    --py: 300rpx;
  }
  &--7 {
    animation: particle-fly 1.2s 0.38s ease-out forwards;
    --px: -280rpx;
    --py: -120rpx;
  }
  &--8 {
    animation: particle-fly 1.2s 0.42s ease-out forwards;
    --px: 260rpx;
    --py: -150rpx;
  }
}

@keyframes particle-fly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--px), var(--py)) scale(0);
    opacity: 0;
  }
}

/* ── Caption text ── */
.portal__caption {
  position: absolute;
  top: 58%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  animation: caption-fade 1.6s ease-out forwards;
}

.portal__caption-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 10rpx;
  text-shadow: 0 0 24rpx rgba(201, 168, 76, 0.5);
}

.portal__caption-sub {
  margin-top: 16rpx;
  font-size: 22rpx;
  color: #9b8abf;
  letter-spacing: 8rpx;
}

@keyframes caption-fade {
  0% {
    opacity: 0;
    transform: translateY(30rpx);
  }
  30% {
    opacity: 0;
    transform: translateY(30rpx);
  }
  55% {
    opacity: 1;
    transform: translateY(0);
  }
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* ── Final flash wipe ── */
.portal__flash {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 45%, #f0d76e, #0d0221 70%);
  z-index: 20;
  opacity: 0;
  animation: flash-wipe 1.8s ease-in forwards;
}

@keyframes flash-wipe {
  0% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
    background: #0d0221;
  }
}
</style>
