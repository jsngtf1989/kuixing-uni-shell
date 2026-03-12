<template>
  <view class="cd-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="cd-nav">
      <view class="cd-nav__back" @tap="goBack">
        <text class="cd-nav__arrow">←</text>
      </view>
      <text class="cd-nav__title">{{ pageTitle }}</text>
      <view class="cd-nav__spacer" />
    </view>

    <!-- Loading -->
    <view v-if="loading" class="cd-loading">
      <text class="cd-loading__star">✦</text>
      <text class="cd-loading__text">加载中…</text>
    </view>

    <!-- Error -->
    <view v-else-if="error" class="cd-error">
      <text class="cd-error__icon">!</text>
      <text class="cd-error__text">{{ error }}</text>
      <view class="cd-error__btn" @tap="fetchContent">
        <text class="cd-error__btn-text">重试</text>
      </view>
    </view>

    <!-- Content -->
    <scroll-view v-else scroll-y class="cd-scroll">
      <view class="cd-content">
        <rich-text :nodes="content" />
      </view>
      <view class="cd-safe-bottom" />
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
let dataType = "";
uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

onLoad((options) => {
  pageTitle.value = decodeURIComponent(options?.title || "详情");
  actionKey = options?.actionKey || "";
  dataType = options?.dataType || "";
  if (actionKey) {
    fetchContent();
  } else {
    error.value = "参数缺失";
    loading.value = false;
  }
});

function fetchContent() {
  loading.value = true;
  error.value = "";

  const url =
    "https://kuixing.cloud/kx/kxapi.action?actionKey=" +
    encodeURIComponent(actionKey) +
    "&dataType=" +
    encodeURIComponent(dataType);

  uni.request({
    method: "GET",
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url,
    success(resp) {
      const list = resp?.data?.kf?.kxDataList;
      const detail =
        Array.isArray(list) && list.length > 0 ? list[0].content : null;
      if (detail) {
        content.value =
          typeof detail === "string"
            ? detail.replace(/\n/g, "<br/>")
            : JSON.stringify(detail);
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
.cd-page {
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

.cd-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.cd-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.cd-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.cd-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.cd-nav__spacer {
  width: 64rpx;
}

.cd-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.cd-loading__star {
  font-size: 64rpx;
  color: #c9a84c;
  margin-bottom: 24rpx;
  animation: pulse 1.5s ease-in-out infinite;
}

.cd-loading__text {
  font-size: 28rpx;
  color: #b8a9cc;
  letter-spacing: 4rpx;
}

.cd-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}

.cd-error__icon {
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

.cd-error__text {
  font-size: 28rpx;
  color: #8b7aae;
  margin-bottom: 40rpx;
}

.cd-error__btn {
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
  background: rgba(201, 168, 76, 0.15);
  border: 1rpx solid rgba(201, 168, 76, 0.3);
}

.cd-error__btn-text {
  font-size: 28rpx;
  color: #e8d5a3;
}

.cd-scroll {
  height: calc(100vh - 200rpx);
}

.cd-content {
  padding: 32rpx 36rpx;
  color: #d4cae6;
  font-size: 28rpx;
  line-height: 1.8;
  letter-spacing: 1rpx;
}

.cd-safe-bottom {
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
