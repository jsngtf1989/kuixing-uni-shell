<template>
  <view class="follow-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="follow-nav">
      <view class="follow-nav__back" @tap="goBack">
        <text class="follow-nav__arrow">←</text>
      </view>
      <text class="follow-nav__title">关注公众号</text>
      <view class="follow-nav__spacer" />
    </view>

    <view class="follow-content">
      <!-- 公众号关注组件：仅在能渲染时显示；不能渲染时隐藏，改显下方自定义卡片 -->
      <view v-if="showOfficialBlock" class="follow-official-wrap">
        <text class="follow-official-wrap__label">一键关注</text>
        <view class="follow-official-wrap__box">
          <official-account @load="onOfficialLoad" @error="onOfficialError" />
        </view>
      </view>

      <!-- 不能渲染时：提示 + 自定义卡片 -->
      <template v-if="!officialRendered">
        <view v-if="officialError?.status === '5'" class="follow-hint">
          <text class="follow-hint__msg">从当前入口无法显示关注按钮，请使用下方方式关注公众号</text>
        </view>
        <view v-else-if="officialError" class="follow-error">
          <text class="follow-error__title">公众号组件未显示</text>
          <text class="follow-error__code">status: {{ officialError.status }}</text>
          <text class="follow-error__msg">{{ officialError.message }}</text>
        </view>

        <view class="follow-card">
        <view class="follow-card__inner">
          <view class="follow-card__logo-wrap">
            <image
              class="follow-card__logo"
              src="/static/images/kuixinghomelogo.png"
              mode="aspectFit"
            />
          </view>
          <text class="follow-card__title">关注魁星国学公众号</text>
          <text class="follow-card__desc">获取更多国学内容与活动推送</text>
          <view class="follow-card__name-row">
            <text class="follow-card__name-label">公众号名称：</text>
            <text class="follow-card__name-value">魁星国学</text>
          </view>
          <view class="follow-card__copy" @tap="copyName">
            <text class="follow-card__copy-text">复制公众号名称</text>
          </view>
        </view>
      </view>
      </template>

      <view class="follow-back" @tap="goBack">
        <text class="follow-back__text">返回</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

const OFFICIAL_NAME = "魁星国学";
const statusBarHeight = ref(0);
const officialError = ref(null);
const officialRendered = ref(false);

// 先挂载官方组件以触发 load/error；确定不能渲染后再隐藏
const showOfficialBlock = computed(
  () => officialRendered.value || officialError.value === null
);

const STATUS_MSG = {
  0: "加载成功",
  "-2": "网络错误",
  "-1": "数据解析错误",
  1: "小程序关注公众号功能被封禁",
  2: "关联公众号被封禁",
  3: "关联关系解除或未选中关联公众号",
  4: "未开启关注公众号功能",
  5: "场景值错误（当前入口不支持显示，可复制下方公众号名称搜索关注）",
  6: "重复创建",
};

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

function setError(status) {
  const code = status != null ? String(status) : "?";
  officialError.value = {
    status: code,
    message: STATUS_MSG[code] || `未知错误(${code})`,
  };
}

function onOfficialLoad(e) {
  const status = e?.detail?.status;
  if (status === 0) {
    officialRendered.value = true;
    officialError.value = null;
  } else if (status !== undefined) {
    officialRendered.value = false;
    setError(status);
  } else {
    officialRendered.value = true;
    officialError.value = null;
  }
}

function onOfficialError(e) {
  const status = e?.detail?.status;
  officialRendered.value = false;
  setError(status != null ? status : "error");
}

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

function goBack() {
  uni.navigateBack({ delta: 1 });
}
</script>

<style lang="scss" scoped>
.follow-page {
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

.follow-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.follow-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.follow-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.follow-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.follow-nav__spacer {
  width: 64rpx;
}

.follow-content {
  padding: 32rpx 0;
}

/* 包一层，弱化微信原生白底与背景的对比 */
.follow-official-wrap {
  margin-bottom: 24rpx;
  padding: 24rpx;
  background: linear-gradient(
    165deg,
    rgba(38, 19, 88, 0.6) 0%,
    rgba(26, 11, 66, 0.5) 50%,
    rgba(21, 9, 58, 0.5) 100%
  );
  border: 1rpx solid rgba(201, 168, 76, 0.25);
  border-radius: 24rpx;
  overflow: hidden;
}

.follow-official-wrap__label {
  display: block;
  font-size: 26rpx;
  color: #9b8abf;
  letter-spacing: 4rpx;
  margin-bottom: 16rpx;
}

.follow-official-wrap__box {
  min-height: 84px;
  border-radius: 12rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}

.follow-hint {
  margin-top: 24rpx;
  padding: 20rpx 28rpx;
  background: rgba(201, 168, 76, 0.08);
  border: 1rpx solid rgba(201, 168, 76, 0.25);
  border-radius: 16rpx;
}

.follow-hint__msg {
  font-size: 26rpx;
  color: #b8a9cc;
  line-height: 1.5;
  letter-spacing: 1rpx;
}

.follow-error {
  margin-top: 24rpx;
  padding: 24rpx 28rpx;
  background: rgba(180, 80, 80, 0.15);
  border: 1rpx solid rgba(220, 100, 100, 0.35);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.follow-error__title {
  font-size: 28rpx;
  font-weight: 600;
  color: #e8a0a0;
  letter-spacing: 2rpx;
}

.follow-error__code {
  font-size: 24rpx;
  color: #c89090;
  font-family: monospace;
}

.follow-error__msg {
  font-size: 26rpx;
  color: #b88080;
  line-height: 1.5;
  letter-spacing: 1rpx;
}

/* 关注卡片（始终显示） */
.follow-card {
  margin-top: 32rpx;
}

.follow-card__inner {
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

.follow-card__logo-wrap {
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

.follow-card__logo {
  width: 112rpx;
  height: 112rpx;
}

.follow-card__title {
  font-size: 34rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
  margin-bottom: 12rpx;
}

.follow-card__desc {
  font-size: 26rpx;
  color: #9b8abf;
  letter-spacing: 2rpx;
  margin-bottom: 32rpx;
}

.follow-card__name-row {
  width: 100%;
  padding: 20rpx 24rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.follow-card__name-label {
  font-size: 26rpx;
  color: #8b7aae;
  letter-spacing: 2rpx;
}

.follow-card__name-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #e8d5a3;
  letter-spacing: 2rpx;
}

.follow-card__copy {
  padding: 20rpx 48rpx;
  border: 1rpx solid rgba(201, 168, 76, 0.4);
  border-radius: 40rpx;
  background: rgba(201, 168, 76, 0.08);
}

.follow-card__copy-text {
  font-size: 28rpx;
  color: #d4b05e;
  letter-spacing: 2rpx;
}

.follow-card__copy:active {
  opacity: 0.85;
}

.follow-back {
  margin-top: 48rpx;
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  border: 1rpx solid rgba(201, 168, 76, 0.4);
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.follow-back:active {
  transform: scale(0.98);
  background: rgba(0, 0, 0, 0.25);
}

.follow-back__text {
  font-size: 28rpx;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}
</style>
