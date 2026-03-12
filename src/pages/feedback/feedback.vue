<template>
  <view class="fb-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="fb-nav">
      <view class="fb-nav__back" @tap="goBack">
        <text class="fb-nav__arrow">←</text>
      </view>
      <text class="fb-nav__title">意见反馈</text>
      <view class="fb-nav__spacer" />
    </view>

    <scroll-view scroll-y class="fb-scroll">
      <!-- Subject picker -->
      <view class="fb-field">
        <text class="fb-field__label">反馈类型</text>
        <view class="fb-select" @tap="showSubjectPicker = true">
          <text
            class="fb-select__text"
            :class="{ 'fb-select__text--placeholder': !selectedSubject }"
          >
            {{ selectedSubject || "请选择反馈类型" }}
          </text>
          <text class="fb-select__arrow">›</text>
        </view>
      </view>

      <!-- Content input -->
      <view class="fb-field">
        <text class="fb-field__label">反馈内容</text>
        <textarea
          v-model="feedbackContent"
          class="fb-textarea"
          placeholder="请详细描述您的问题或建议…"
          placeholder-class="fb-textarea__placeholder"
          :maxlength="1000"
          auto-height
          :style="{ minHeight: '240rpx' }"
        />
        <text class="fb-field__count">{{ feedbackContent.length }}/1000</text>
      </view>

      <!-- Submit button -->
      <view class="fb-submit-wrap">
        <view
          class="fb-submit"
          :class="{ 'fb-submit--disabled': !canSubmit }"
          @tap="onSubmit"
        >
          <text class="fb-submit__text">{{
            submitting ? "提交中…" : "提交反馈"
          }}</text>
        </view>
      </view>

      <view class="fb-safe-bottom" />
    </scroll-view>

    <!-- Subject picker overlay -->
    <view
      v-if="showSubjectPicker"
      class="fb-picker-mask"
      @tap.self="showSubjectPicker = false"
    >
      <view class="fb-picker">
        <view class="fb-picker__header">
          <text class="fb-picker__title">选择反馈类型</text>
        </view>
        <view
          v-for="subj in subjects"
          :key="subj"
          class="fb-picker__item"
          :class="{ 'fb-picker__item--active': subj === selectedSubject }"
          @tap="selectSubject(subj)"
        >
          <text class="fb-picker__item-text">{{ subj }}</text>
          <text v-if="subj === selectedSubject" class="fb-picker__check"
            >✓</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

const statusBarHeight = ref(0);

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

const subjects = ["功能建议", "问题反馈", "内容纠错", "使用体验", "其他"];
const selectedSubject = ref("");
const feedbackContent = ref("");
const submitting = ref(false);
const showSubjectPicker = ref(false);

const canSubmit = computed(() => {
  return (
    selectedSubject.value &&
    feedbackContent.value.trim().length > 0 &&
    !submitting.value
  );
});

function selectSubject(subj) {
  selectedSubject.value = subj;
  showSubjectPicker.value = false;
}

function onSubmit() {
  if (!canSubmit.value) return;

  submitting.value = true;

  const url =
    "https://kuixing.cloud/kx/kxapi.action?actionKey=submitSupportTicket" +
    "&subject=" +
    encodeURIComponent(selectedSubject.value) +
    "&description=" +
    encodeURIComponent(feedbackContent.value.trim()) +
    "&ticketType=" +
    encodeURIComponent("feedback") +
    "&uid=" +
    encodeURIComponent("mpfeedback");

  uni.request({
    method: "GET",
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url,
    success(resp) {
      submitting.value = false;
      const result = resp?.data?.kf?.dataDetail;
      if (result || resp?.data?.kf) {
        uni.showToast({
          title: "感谢您的反馈！",
          icon: "success",
          duration: 2000,
        });
        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 1500);
      } else {
        uni.showToast({ title: "提交失败，请稍后重试", icon: "none" });
      }
    },
    fail() {
      submitting.value = false;
      uni.showToast({ title: "网络请求失败", icon: "none" });
    },
  });
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}
</script>

<style lang="scss" scoped>
.fb-page {
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

/* Nav */
.fb-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.fb-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.fb-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.fb-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.fb-nav__spacer {
  width: 64rpx;
}

/* Scroll */
.fb-scroll {
  height: calc(100vh - 200rpx);
  padding: 20rpx 0;
}

/* Fields */
.fb-field {
  margin-bottom: 36rpx;
}

.fb-field__label {
  display: block;
  font-size: 26rpx;
  color: #9b8abf;
  letter-spacing: 2rpx;
  margin-bottom: 16rpx;
}

.fb-field__count {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: #5e4d7a;
  margin-top: 8rpx;
}

/* Select */
.fb-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  background: linear-gradient(160deg, #261358 0%, #1a0b42 60%, #15093a 100%);
  border: 1rpx solid rgba(201, 168, 76, 0.12);
  border-radius: 20rpx;

  &:active {
    background: rgba(38, 19, 88, 0.8);
  }
}

.fb-select__text {
  font-size: 28rpx;
  color: #e8d5a3;

  &--placeholder {
    color: #5e4d7a;
  }
}

.fb-select__arrow {
  font-size: 36rpx;
  color: rgba(201, 168, 76, 0.4);
}

/* Textarea */
.fb-textarea {
  width: 100%;
  padding: 24rpx 28rpx;
  background: linear-gradient(160deg, #261358 0%, #1a0b42 60%, #15093a 100%);
  border: 1rpx solid rgba(201, 168, 76, 0.12);
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #e8d5a3;
  line-height: 1.7;
  box-sizing: border-box;
}

.fb-textarea__placeholder {
  color: #5e4d7a;
}

/* Submit */
.fb-submit-wrap {
  padding: 32rpx 0;
}

.fb-submit {
  width: 100%;
  height: 96rpx;
  border-radius: 48rpx;
  background: linear-gradient(135deg, #d4b05e 0%, #b8923a 50%, #c9a84c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8rpx 40rpx rgba(201, 168, 76, 0.25),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  transition:
    transform 0.2s,
    opacity 0.2s;

  &:active {
    transform: scale(0.97);
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.fb-submit__text {
  font-size: 32rpx;
  font-weight: 600;
  color: #0d0221;
  letter-spacing: 6rpx;
}

/* Picker overlay */
.fb-picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}

.fb-picker {
  width: 100%;
  background: linear-gradient(175deg, #1a0a3e, #0d0221);
  border-radius: 32rpx 32rpx 0 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.fb-picker__header {
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid rgba(201, 168, 76, 0.1);
}

.fb-picker__title {
  font-size: 30rpx;
  color: #e8d5a3;
  font-weight: 600;
  letter-spacing: 4rpx;
}

.fb-picker__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.03);

  &--active {
    background: rgba(201, 168, 76, 0.08);
  }

  &:active {
    background: rgba(201, 168, 76, 0.06);
  }
}

.fb-picker__item-text {
  font-size: 28rpx;
  color: #b8a9cc;
}

.fb-picker__item--active .fb-picker__item-text {
  color: #e8d5a3;
}

.fb-picker__check {
  font-size: 28rpx;
  color: #d4b05e;
}

.fb-safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
