<template>
  <view class="cal-page">
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- Nav bar -->
    <view class="cal-nav">
      <view class="cal-nav__back" @tap="goBack">
        <text class="cal-nav__arrow">←</text>
      </view>
      <text class="cal-nav__title">老黄历</text>
      <view class="cal-nav__today" @tap="goToday">
        <text class="cal-nav__today-text">今</text>
      </view>
    </view>

    <!-- Lunar year info banner -->
    <view class="cal-banner" v-if="lunarInfo">
      <text class="cal-banner__year">
        农历 {{ lunarInfo.yearGanZhi }}年 【{{ lunarInfo.shengXiao }}年】
      </text>
    </view>

    <!-- Year / Month selector -->
    <view class="cal-selector">
      <view class="cal-selector__btn" @tap="prevMonth">
        <text class="cal-selector__arrow">‹</text>
      </view>
      <view class="cal-selector__center" @tap="showYearPicker = true">
        <text class="cal-selector__label">{{ currentYear }}年 {{ currentMonth }}月</text>
      </view>
      <view class="cal-selector__btn" @tap="nextMonth">
        <text class="cal-selector__arrow">›</text>
      </view>
    </view>

    <!-- Weekday headers -->
    <view class="cal-weekdays">
      <text
        v-for="wd in weekdays"
        :key="wd"
        class="cal-weekdays__item"
        :class="{ 'cal-weekdays__item--weekend': wd === '日' || wd === '六' }"
      >{{ wd }}</text>
    </view>

    <!-- Calendar grid -->
    <scroll-view scroll-y class="cal-grid-scroll">
      <view class="cal-grid">
        <view v-for="(week, wi) in weeks" :key="wi" class="cal-week">
          <view
            v-for="(cell, ci) in week"
            :key="ci"
            class="cal-cell"
            :class="{
              'cal-cell--empty': !cell,
              'cal-cell--today': cell && cell.isToday,
              'cal-cell--first': cell && cell.isFirstOfLunarMonth,
            }"
            @tap="cell && onDayTap(cell)"
          >
            <template v-if="cell">
              <text class="cal-cell__day">{{ cell.day }}</text>
              <text class="cal-cell__lunar">{{ cell.isFirstOfLunarMonth ? cell.lunarMonth : cell.lunarDay }}</text>
              <text class="cal-cell__ganzhi">{{ cell.ganZhi }}</text>
            </template>
          </view>
        </view>
      </view>

      <!-- Selected day detail -->
      <view v-if="selectedDay" class="cal-detail">
        <view class="cal-detail__header">
          <text class="cal-detail__date">
            {{ currentYear }}年{{ currentMonth }}月{{ selectedDay.day }}日
          </text>
          <text class="cal-detail__ganzhi-big">{{ selectedDay.ganZhi }}日</text>
        </view>
        <view class="cal-detail__row">
          <text class="cal-detail__label">农历</text>
          <text class="cal-detail__value">{{ selectedDay.lunarMonth }}{{ selectedDay.lunarDay }}</text>
        </view>
        <view class="cal-detail__row">
          <text class="cal-detail__label">日柱</text>
          <text class="cal-detail__value">{{ selectedDay.ganZhi }}</text>
        </view>
      </view>

      <view class="cal-safe-bottom" />
    </scroll-view>

    <!-- Year/Month picker overlay -->
    <view v-if="showYearPicker" class="cal-picker-mask" @tap.self="showYearPicker = false">
      <view class="cal-picker">
        <view class="cal-picker__header">
          <text class="cal-picker__cancel" @tap="showYearPicker = false">取消</text>
          <text class="cal-picker__title">选择年月</text>
          <text class="cal-picker__confirm" @tap="confirmPicker">确定</text>
        </view>
        <view class="cal-picker__body">
          <view class="cal-picker__col">
            <scroll-view scroll-y class="cal-picker__scroller">
              <view
                v-for="y in yearRange"
                :key="y"
                class="cal-picker__item"
                :class="{ 'cal-picker__item--active': y === pickerYear }"
                @tap="pickerYear = y"
              >
                <text class="cal-picker__item-text">{{ y }}年</text>
              </view>
            </scroll-view>
          </view>
          <view class="cal-picker__col">
            <scroll-view scroll-y class="cal-picker__scroller">
              <view
                v-for="m in 12"
                :key="m"
                class="cal-picker__item"
                :class="{ 'cal-picker__item--active': m === pickerMonth }"
                @tap="pickerMonth = m"
              >
                <text class="cal-picker__item-text">{{ m }}月</text>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { buildMonthCalendar, getLunarMonthInfo } from "../../utils/lunar.js";

const statusBarHeight = ref(0);

uni.getSystemInfo({
  success(res) {
    statusBarHeight.value = res.statusBarHeight || 0;
  },
});

const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth() + 1);

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const weeks = ref([]);
const lunarInfo = ref(null);
const selectedDay = ref(null);

const showYearPicker = ref(false);
const pickerYear = ref(currentYear.value);
const pickerMonth = ref(currentMonth.value);

const yearRange = computed(() => {
  const result = [];
  for (let y = 1901; y <= 2099; y++) result.push(y);
  return result;
});

function refreshCalendar() {
  weeks.value = buildMonthCalendar(currentYear.value, currentMonth.value);
  lunarInfo.value = getLunarMonthInfo(currentYear.value, currentMonth.value);

  // Auto-select today if in current month, otherwise first day
  const todayCell = weeks.value.flat().find((c) => c && c.isToday);
  const firstCell = weeks.value.flat().find((c) => c);
  selectedDay.value = todayCell || firstCell || null;
}

watch([currentYear, currentMonth], refreshCalendar, { immediate: true });

function prevMonth() {
  if (currentMonth.value === 1) {
    if (currentYear.value <= 1901) return;
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    if (currentYear.value >= 2099) return;
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
}

function goToday() {
  const today = new Date();
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth() + 1;
}

function confirmPicker() {
  currentYear.value = pickerYear.value;
  currentMonth.value = pickerMonth.value;
  showYearPicker.value = false;
}

function onDayTap(cell) {
  selectedDay.value = cell;
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}
</script>

<style lang="scss" scoped>
.cal-page {
  min-height: 100vh;
  background: linear-gradient(175deg, #0d0221 0%, #160d38 35%, #1a0a3e 55%, #110828 100%);
  box-sizing: border-box;
}

/* Nav */
.cal-nav {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.cal-nav__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.cal-nav__arrow {
  font-size: 36rpx;
  color: #e8d5a3;
}

.cal-nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.cal-nav__today {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(201, 168, 76, 0.15);
}

.cal-nav__today-text {
  font-size: 26rpx;
  color: #d4b05e;
  font-weight: 600;
}

/* Banner */
.cal-banner {
  text-align: center;
  padding: 12rpx 0 16rpx;
}

.cal-banner__year {
  font-size: 24rpx;
  color: #9b8abf;
  letter-spacing: 4rpx;
}

/* Selector */
.cal-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 36rpx 20rpx;
  gap: 32rpx;
}

.cal-selector__btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.cal-selector__arrow {
  font-size: 44rpx;
  color: #c9a84c;
  line-height: 1;
}

.cal-selector__center {
  padding: 8rpx 32rpx;
  border-radius: 32rpx;
  background: rgba(201, 168, 76, 0.08);
  border: 1rpx solid rgba(201, 168, 76, 0.15);
}

.cal-selector__label {
  font-size: 30rpx;
  font-weight: 600;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

/* Weekday headers */
.cal-weekdays {
  display: flex;
  padding: 0 16rpx;
  margin-bottom: 8rpx;
}

.cal-weekdays__item {
  flex: 1;
  text-align: center;
  font-size: 22rpx;
  color: #7e6b9e;
  letter-spacing: 2rpx;
  padding: 8rpx 0;

  &--weekend {
    color: #c9a84c;
  }
}

/* Grid */
.cal-grid-scroll {
  height: calc(100vh - 480rpx);
}

.cal-grid {
  padding: 0 8rpx;
}

.cal-week {
  display: flex;
}

.cal-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx 2rpx;
  margin: 4rpx;
  border-radius: 16rpx;
  min-height: 130rpx;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.2s;

  &--empty {
    background: transparent;
  }

  &--today {
    background: rgba(201, 168, 76, 0.15);
    border: 1rpx solid rgba(201, 168, 76, 0.35);
  }

  &--first .cal-cell__lunar {
    color: #d4b05e;
    font-weight: 600;
  }

  &:active:not(&--empty) {
    background: rgba(201, 168, 76, 0.1);
  }
}

.cal-cell__day {
  font-size: 30rpx;
  font-weight: 600;
  color: #e8d5a3;
  line-height: 1.2;
}

.cal-cell__lunar {
  font-size: 18rpx;
  color: #8b7aae;
  line-height: 1.3;
  margin-top: 2rpx;
}

.cal-cell__ganzhi {
  font-size: 16rpx;
  color: rgba(201, 168, 76, 0.6);
  line-height: 1.2;
  margin-top: 2rpx;
}

/* Selected day detail */
.cal-detail {
  margin: 24rpx 24rpx 0;
  padding: 28rpx 32rpx;
  background: linear-gradient(160deg, #261358 0%, #1a0b42 60%, #15093a 100%);
  border: 1rpx solid rgba(201, 168, 76, 0.12);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.cal-detail__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(201, 168, 76, 0.1);
}

.cal-detail__date {
  font-size: 28rpx;
  color: #b8a9cc;
}

.cal-detail__ganzhi-big {
  font-size: 36rpx;
  font-weight: 700;
  color: #e8d5a3;
  letter-spacing: 4rpx;
}

.cal-detail__row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
}

.cal-detail__label {
  font-size: 26rpx;
  color: #7e6b9e;
}

.cal-detail__value {
  font-size: 26rpx;
  color: #d4cae6;
  letter-spacing: 2rpx;
}

.cal-safe-bottom {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Year/Month Picker */
.cal-picker-mask {
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

.cal-picker {
  width: 100%;
  background: linear-gradient(175deg, #1a0a3e, #0d0221);
  border-radius: 32rpx 32rpx 0 0;
  overflow: hidden;
}

.cal-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid rgba(201, 168, 76, 0.1);
}

.cal-picker__cancel {
  font-size: 28rpx;
  color: #8b7aae;
}

.cal-picker__title {
  font-size: 30rpx;
  color: #e8d5a3;
  font-weight: 600;
}

.cal-picker__confirm {
  font-size: 28rpx;
  color: #d4b05e;
  font-weight: 600;
}

.cal-picker__body {
  display: flex;
  height: 500rpx;
}

.cal-picker__col {
  flex: 1;
}

.cal-picker__scroller {
  height: 500rpx;
}

.cal-picker__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;

  &--active {
    background: rgba(201, 168, 76, 0.1);
  }
}

.cal-picker__item-text {
  font-size: 28rpx;
  color: #b8a9cc;
}

.cal-picker__item--active .cal-picker__item-text {
  color: #e8d5a3;
  font-weight: 600;
}
</style>
