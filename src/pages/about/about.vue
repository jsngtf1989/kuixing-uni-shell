<template>
  <view class="about-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="about-nav">
      <view class="about-nav__back" @tap="goBack">
        <text class="about-nav__arrow">←</text>
      </view>
      <text class="about-nav__title">关于我们</text>
      <view class="about-nav__spacer" />
    </view>

    <!-- Loading -->
    <view v-if="loading" class="about-loading">
      <text class="about-loading__star">✦</text>
      <text class="about-loading__text">加载中…</text>
    </view>

    <!-- Error -->
    <view v-else-if="error" class="about-error">
      <text class="about-error__icon">!</text>
      <text class="about-error__text">{{ error }}</text>
      <view class="about-error__btn" @tap="fetchContent">
        <text class="about-error__btn-text">重试</text>
      </view>
    </view>

    <!-- Content -->
    <scroll-view
      v-else
      scroll-y
      :show-scrollbar="false"
      :enhanced="true"
      class="about-scroll"
    >
      <!-- Header: Logo + company -->
      <view class="about-header">
        <view class="about-header__logo-wrap">
          <image
            class="about-header__logo"
            src="/static/images/kuixinghomelogo.png"
            mode="aspectFit"
          />
        </view>
        <text class="about-header__company"
          >魁星创元(南京)文化科技有限公司</text
        >
        <text class="about-header__license">许可证号：合字B2-20260042</text>
      </view>

      <!-- Section: 什么是魁星国学 -->
      <view class="about-section">
        <view class="about-section__head">
          <view class="about-section__dot" />
          <text class="about-section__title">什么是魁星国学？</text>
        </view>
        <view class="about-section__body">
          <rich-text :nodes="sectionOne" />
        </view>
      </view>

      <!-- Section: 公司资料 -->
      <view class="about-section">
        <view class="about-section__head">
          <view class="about-section__dot" />
          <text class="about-section__title">公司资料</text>
        </view>
        <view class="about-section__body">
          <rich-text :nodes="sectionTwo" />
        </view>
      </view>

      <view class="about-safe-bottom" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const statusBarHeight = ref(0);
const loading = ref(true);
const error = ref("");
const sectionOne = ref("");
const sectionTwo = ref("");

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

onLoad(() => {
  fetchContent();
});

function fetchContent() {
  loading.value = true;
  error.value = "";

  const url =
    "https://kuixing.cloud/kx/kxapi.action?actionKey=getSingleDataByDocTypeAllContent&dataType=aboutus";

  uni.request({
    method: "GET",
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url,
    success(resp) {
      const list = resp?.data?.kf?.kxDataList;
      if (Array.isArray(list) && list.length > 0) {
        const raw = list[0].content || "";
        const parts = raw.split("[split]");
        sectionOne.value = (parts[0] || "").trim().replace(/\n/g, "<br/>");
        sectionTwo.value = (parts[1] || "").trim().replace(/\n/g, "<br/>");
      } else {
        error.value = "暂无内容";
      }
      loading.value = false;
    },
    fail() {
      error.value = "网络请求失败，请检查网络";
      loading.value = false;
    },
  });
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}
</script>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(
    175deg,
    #0d0221 0%,
    #160d38 35%,
    #1a0a3e 55%,
    #110828 100%
  );
  box-sizing: border-box;
}

/* Nav */
.about-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.about-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.about-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.about-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.about-nav__spacer {
  width: 64rpx;
}

/* Loading */
.about-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.about-loading__star {
  font-size: 64rpx;
  color: #c9a84c;
  margin-bottom: 24rpx;
  animation: pulse 1.5s ease-in-out infinite;
}

.about-loading__text {
  font-size: 28rpx;
  color: #b8a9cc;
  letter-spacing: 4rpx;
}

/* Error */
.about-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}

.about-error__icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(201, 168, 76, 0.1);
  color: #c9a84c;
  font-size: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.about-error__text {
  font-size: 28rpx;
  color: #8b7aae;
  margin-bottom: 40rpx;
}

.about-error__btn {
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
  background: rgba(201, 168, 76, 0.15);
  border: 1rpx solid rgba(201, 168, 76, 0.3);
}

.about-error__btn-text {
  font-size: 28rpx;
  color: #e8d5a3;
}

/* Scroll */
.about-scroll {
  height: calc(100vh - 200rpx);
}

/* Header */
.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 36rpx 40rpx;
}

.about-header__logo-wrap {
  margin-bottom: 28rpx;
}

.about-header__logo {
  width: 160rpx;
  height: 160rpx;
}

.about-header__company {
  font-size: 30rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 2rpx;
  text-align: center;
  margin-bottom: 12rpx;
}

.about-header__license {
  font-size: 22rpx;
  color: #8b7aae;
  letter-spacing: 1rpx;
}

/* Sections */
.about-section {
  margin: 0 36rpx 32rpx;
  background: linear-gradient(
    160deg,
    rgba(38, 19, 88, 0.6) 0%,
    rgba(26, 11, 66, 0.5) 60%,
    rgba(21, 9, 58, 0.5) 100%
  );
  border: 1rpx solid rgba(201, 168, 76, 0.1);
  border-radius: 24rpx;
  overflow: hidden;
}

.about-section__head {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx 0;
  gap: 14rpx;
}

.about-section__dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #c9a84c;
  flex-shrink: 0;
}

.about-section__title {
  font-size: 30rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 2rpx;
}

.about-section__body {
  padding: 20rpx 28rpx 28rpx;
  color: #c4b6da;
  font-size: 26rpx;
  line-height: 1.8;
  letter-spacing: 1rpx;
}

/* Safe area */
.about-safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>
