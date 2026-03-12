<template>
  <view class="ed-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="ed-nav">
      <view class="ed-nav__back" @tap="goBack">
        <text class="ed-nav__arrow">←</text>
      </view>
      <text class="ed-nav__title">{{ pageTitle }}</text>
      <view class="ed-nav__spacer" />
    </view>

    <!-- Loading -->
    <view v-if="loading" class="ed-loading">
      <text class="ed-loading__star">✦</text>
      <text class="ed-loading__text">加载中…</text>
    </view>

    <!-- Error -->
    <view v-else-if="error" class="ed-error">
      <text class="ed-error__icon">!</text>
      <text class="ed-error__text">{{ error }}</text>
      <view class="ed-error__btn" @tap="fetchContent">
        <text class="ed-error__btn-text">重试</text>
      </view>
    </view>

    <!-- Content -->
    <scroll-view v-else scroll-y class="ed-scroll">
      <view class="ed-content">
        <text class="ed-content__heading">{{ pageTitle }}</text>
        <view class="ed-content__divider" />
        <rich-text :nodes="content" />
      </view>
      <view class="ed-safe-bottom" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const statusBarHeight = ref(0);
const pageTitle = ref("");
const loading = ref(true);
const error = ref("");
const content = ref("");

let actionKey = "";
let topicId = "";

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

onLoad((options) => {
  pageTitle.value = decodeURIComponent(options?.title || "详情");
  actionKey = options?.actionKey || "getEncyclopediaDetail";
  topicId = options?.topicId || "";
  fetchContent();
});

function fetchContent() {
  loading.value = true;
  error.value = "";

  const url =
    "https://kuixing.cloud/kx/kxapi.action?actionKey=" +
    encodeURIComponent(actionKey) +
    "&topicId=" +
    encodeURIComponent(topicId);

  uni.request({
    method: "GET",
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url,
    success(resp) {
      const detail = resp?.data?.kf?.dataDetail;
      if (detail) {
        content.value = typeof detail === "string" ? detail : JSON.stringify(detail);
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
.ed-page {
  min-height: 100vh;
  background: linear-gradient(175deg, #0d0221 0%, #160d38 35%, #1a0a3e 55%, #110828 100%);
  box-sizing: border-box;
}

.ed-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.ed-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.ed-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.ed-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.ed-nav__spacer {
  width: 64rpx;
}

.ed-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.ed-loading__star {
  font-size: 64rpx;
  color: #c9a84c;
  margin-bottom: 24rpx;
  animation: pulse 1.5s ease-in-out infinite;
}

.ed-loading__text {
  font-size: 28rpx;
  color: #b8a9cc;
  letter-spacing: 4rpx;
}

.ed-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}

.ed-error__icon {
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

.ed-error__text {
  font-size: 28rpx;
  color: #8b7aae;
  margin-bottom: 40rpx;
}

.ed-error__btn {
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
  background: rgba(201, 168, 76, 0.15);
  border: 1rpx solid rgba(201, 168, 76, 0.3);
}

.ed-error__btn-text {
  font-size: 28rpx;
  color: #e8d5a3;
}

.ed-scroll {
  height: calc(100vh - 200rpx);
}

.ed-content {
  padding: 32rpx 36rpx;
}

.ed-content__heading {
  font-size: 40rpx;
  font-weight: 700;
  color: #e8d5a3;
  letter-spacing: 4rpx;
  text-align: center;
  margin-bottom: 24rpx;
}

.ed-content__divider {
  width: 120rpx;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.5), transparent);
  margin: 0 auto 40rpx;
}

.ed-content :deep(rich-text) {
  color: #d4cae6;
  font-size: 28rpx;
  line-height: 1.8;
  letter-spacing: 1rpx;
}

.ed-safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
</style>
