<template>
  <view class="sub-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="sub-nav">
      <view class="sub-nav__back" @tap="goBack">
        <text class="sub-nav__arrow">←</text>
      </view>
      <text class="sub-nav__title">订阅与关注</text>
      <view class="sub-nav__spacer" />
    </view>

    <scroll-view scroll-y class="sub-scroll">
      <!-- Follow card -->
      <view class="sub-card">
        <view class="sub-card__inner">
          <view class="sub-card__logo-wrap">
            <image
              class="sub-card__logo"
              src="/static/images/kuixinghomelogo.png"
              mode="aspectFit"
            />
          </view>
          <text class="sub-card__title">关注魁星国学公众号</text>
          <text class="sub-card__desc">获取更多国学内容与活动推送</text>
          <view class="sub-card__name-row">
            <text class="sub-card__name-label">公众号名称：</text>
            <text class="sub-card__name-value">魁星国学</text>
          </view>
          <view class="sub-card__copy" @tap="copyName">
            <text class="sub-card__copy-text">复制公众号名称</text>
          </view>
        </view>
      </view>

      <!-- Subscribe message CTA -->
      <view class="sub-cta">
        <text class="sub-cta__hint">接收小程序订阅消息，及时获取重要通知</text>
        <view
          class="sub-cta__btn"
          :class="{ 'sub-cta__btn--disabled': subscribing }"
          @tap="requestSubscribe"
        >
          <text class="sub-cta__btn-text">
            {{ subscribing ? "处理中…" : "允许接收订阅消息" }}
          </text>
          <text class="sub-cta__btn-arrow">→</text>
        </view>

        <view class="sub-back" @tap="goBack">
          <text class="sub-back__text">返回</text>
        </view>
      </view>

      <view class="sub-safe-bottom" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { getOpenid } from "../../utils/agent.js";

// 在微信公众平台-订阅消息中配置的模板 ID，可填多个；一次弹窗内用户对每个模板分别勾选允许/拒绝
const SUBSCRIBE_TEMPLATE_IDS = ["ke_BKlSGGwp-51H9Og3N-KKdwkn5PA_11UK8FEofRTE"];

const statusBarHeight = ref(0);
const subscribing = ref(false);

const OFFICIAL_NAME = "魁星国学";

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

function copyName() {
  uni.setClipboardData({
    data: OFFICIAL_NAME,
    success() {
      uni.showToast({ title: "已复制公众号名称", icon: "success" });
    },
    fail() {
      uni.showToast({ title: "复制失败", icon: "none" });
    },
  });
}

function requestSubscribe() {
  if (subscribing.value) return;

  // #ifdef MP-WEIXIN
  subscribing.value = true;
  uni.requestSubscribeMessage({
    tmplIds: SUBSCRIBE_TEMPLATE_IDS,
    success(res) {
      // 一个弹窗里可多选；至少有一个选「允许」则传 yes，否则 no
      const accepted = SUBSCRIBE_TEMPLATE_IDS.some(
        (id) => res[id] === "accept",
      );
      submitConsent(accepted ? "yes" : "no");
    },
    fail(err) {
      subscribing.value = false;
      if (err.errMsg && err.errMsg.includes("cancel")) {
        submitConsent("no");
      } else {
        uni.showToast({
          title: err.errMsg || "请求失败",
          icon: "none",
        });
      }
    },
  });
  // #endif

  // #ifndef MP-WEIXIN
  uni.showToast({ title: "仅支持在微信小程序内使用", icon: "none" });
  // #endif
}

function submitConsent(answer) {
  const openid = getOpenid();
  if (!openid) {
    subscribing.value = false;
    uni.showToast({ title: "请先登录", icon: "none" });
    return;
  }

  const url =
    "https://kuixing.cloud/kx/kxapi.action?actionKey=KuixingUpdateUserSubscribeByMpOpenId" +
    "&mpOpenId=" +
    encodeURIComponent(openid) +
    "&answer=" +
    encodeURIComponent(answer);

  uni.request({
    method: "GET",
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url,
    success() {
      subscribing.value = false;
      uni.showToast({
        title: answer === "yes" ? "已开启订阅" : "已记录",
        icon: "success",
      });
    },
    fail() {
      subscribing.value = false;
      uni.showToast({ title: "提交失败，请稍后重试", icon: "none" });
    },
  });
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}
</script>

<style lang="scss" scoped>
.sub-page {
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
}

.sub-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.sub-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.sub-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.sub-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.sub-nav__spacer {
  width: 64rpx;
}

.sub-scroll {
  height: calc(100vh - 200rpx);
  padding: 24rpx 0;
}

/* Follow card */
.sub-card {
  margin-bottom: 40rpx;
}

.sub-card__inner {
  background: linear-gradient(
    165deg,
    rgba(38, 19, 88, 0.85) 0%,
    rgba(26, 11, 66, 0.75) 50%,
    rgba(21, 9, 58, 0.8) 100%
  );
  border: 1rpx solid rgba(201, 168, 76, 0.2);
  border-radius: 28rpx;
  padding: 48rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.25);
}

.sub-card__logo-wrap {
  width: 128rpx;
  height: 128rpx;
  border-radius: 28rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  margin-bottom: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sub-card__logo {
  width: 112rpx;
  height: 112rpx;
}

.sub-card__title {
  font-size: 34rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
  margin-bottom: 12rpx;
}

.sub-card__desc {
  font-size: 26rpx;
  color: #9b8abf;
  letter-spacing: 2rpx;
  margin-bottom: 32rpx;
}

.sub-card__name-row {
  width: 100%;
  padding: 20rpx 24rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.sub-card__name-label {
  font-size: 26rpx;
  color: #8b7aae;
  letter-spacing: 2rpx;
}

.sub-card__name-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #e8d5a3;
  letter-spacing: 2rpx;
}

.sub-card__copy {
  padding: 20rpx 48rpx;
  border: 1rpx solid rgba(201, 168, 76, 0.4);
  border-radius: 40rpx;
  background: rgba(201, 168, 76, 0.08);
}

.sub-card__copy-text {
  font-size: 28rpx;
  color: #d4b05e;
  letter-spacing: 2rpx;
}

.sub-card__copy:active {
  opacity: 0.85;
}

/* CTA */
.sub-cta {
  padding: 16rpx 0;
}

.sub-cta__hint {
  display: block;
  font-size: 26rpx;
  color: #8b7aae;
  letter-spacing: 2rpx;
  margin-bottom: 24rpx;
  text-align: center;
}

.sub-cta__btn {
  width: 100%;
  height: 96rpx;
  border-radius: 48rpx;
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
  animation: sub-cta-glow 2.5s ease-in-out infinite;
}

.sub-cta__btn:active {
  transform: scale(0.98);
  box-shadow:
    0 4rpx 16rpx rgba(201, 168, 76, 0.15),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
}

.sub-cta__btn--disabled {
  opacity: 0.7;
  pointer-events: none;
}

.sub-cta__btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #0d0221;
  letter-spacing: 4rpx;
}

.sub-cta__btn-arrow {
  font-size: 32rpx;
  font-weight: 700;
  color: #0d0221;
  animation: sub-arrow-nudge 1.5s ease-in-out infinite;
}

@keyframes sub-cta-glow {
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

@keyframes sub-arrow-nudge {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(8rpx);
  }
}

.sub-back {
  margin-top: 24rpx;
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  border: 1rpx solid rgba(201, 168, 76, 0.4);
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sub-back:active {
  transform: scale(0.98);
  background: rgba(0, 0, 0, 0.25);
}

.sub-back__text {
  font-size: 28rpx;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.sub-safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
