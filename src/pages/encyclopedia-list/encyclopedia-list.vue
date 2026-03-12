<template>
  <view class="el-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="el-nav">
      <view class="el-nav__back" @tap="goBack">
        <text class="el-nav__arrow">←</text>
      </view>
      <text class="el-nav__title">{{ pageTitle }}</text>
      <view class="el-nav__spacer" />
    </view>

    <!-- Topic list -->
    <scroll-view scroll-y class="el-scroll">
      <view class="el-list">
        <view
          v-for="(topic, index) in topics"
          :key="topic.id"
          class="el-item"
          @tap="onTopicTap(topic)"
        >
          <view class="el-item__idx">
            <text class="el-item__idx-text">{{ index + 1 }}</text>
          </view>
          <view class="el-item__body">
            <text class="el-item__title">{{ topic.title }}</text>
            <text class="el-item__desc">{{ topic.desc }}</text>
          </view>
          <text class="el-item__chevron">›</text>
        </view>
      </view>
      <view class="el-safe-bottom" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const statusBarHeight = ref(0);
const pageTitle = ref("");
const topics = ref([]);

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

const ziweiTopics = [
  { id: "zw001", title: "紫微斗数简介", desc: "了解紫微斗数的起源与发展", actionKey: "getEncyclopediaDetail" },
  { id: "zw002", title: "十四主星详解", desc: "紫微、天机、太阳等主星性格特点", actionKey: "getEncyclopediaDetail" },
  { id: "zw003", title: "命宫与十二宫位", desc: "十二宫位的含义与排列方法", actionKey: "getEncyclopediaDetail" },
  { id: "zw004", title: "四化飞星入门", desc: "化禄、化权、化科、化忌详解", actionKey: "getEncyclopediaDetail" },
  { id: "zw005", title: "紫微斗数格局", desc: "常见格局类型与吉凶分析", actionKey: "getEncyclopediaDetail" },
];

const baziTopics = [
  { id: "bz001", title: "八字基础入门", desc: "什么是八字，如何排盘", actionKey: "getEncyclopediaDetail" },
  { id: "bz002", title: "天干地支详解", desc: "十天干与十二地支的含义", actionKey: "getEncyclopediaDetail" },
  { id: "bz003", title: "五行生克关系", desc: "金木水火土的相生相克", actionKey: "getEncyclopediaDetail" },
  { id: "bz004", title: "十神含义解读", desc: "正官、偏财、食神等十神详解", actionKey: "getEncyclopediaDetail" },
  { id: "bz005", title: "大运流年分析", desc: "如何分析大运与流年的影响", actionKey: "getEncyclopediaDetail" },
];

onLoad((options) => {
  const type = options?.type || "ziwei";
  pageTitle.value = type === "ziwei" ? "紫微百科" : "八字百科";
  topics.value = type === "ziwei" ? ziweiTopics : baziTopics;
});

function onTopicTap(topic) {
  uni.navigateTo({
    url: `/pages/encyclopedia-detail/encyclopedia-detail?topicId=${topic.id}&title=${encodeURIComponent(topic.title)}&actionKey=${topic.actionKey}`,
  });
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}
</script>

<style lang="scss" scoped>
.el-page {
  min-height: 100vh;
  background: linear-gradient(175deg, #0d0221 0%, #160d38 35%, #1a0a3e 55%, #110828 100%);
  box-sizing: border-box;
}

.el-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.el-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.el-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.el-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.el-nav__spacer {
  width: 64rpx;
}

.el-scroll {
  height: calc(100vh - 200rpx);
}

.el-list {
  padding: 20rpx 36rpx;
}

.el-item {
  display: flex;
  align-items: center;
  padding: 32rpx 28rpx;
  margin-bottom: 20rpx;
  background: linear-gradient(160deg, #261358 0%, #1a0b42 60%, #15093a 100%);
  border: 1rpx solid rgba(201, 168, 76, 0.1);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.el-item__idx {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.2), rgba(201, 168, 76, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 24rpx;
}

.el-item__idx-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #d4b05e;
}

.el-item__body {
  flex: 1;
  min-width: 0;
}

.el-item__title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 2rpx;
  margin-bottom: 8rpx;
}

.el-item__desc {
  display: block;
  font-size: 22rpx;
  color: #8b7aae;
  letter-spacing: 1rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-item__chevron {
  font-size: 36rpx;
  color: rgba(201, 168, 76, 0.4);
  margin-left: 16rpx;
  flex-shrink: 0;
}

.el-safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
