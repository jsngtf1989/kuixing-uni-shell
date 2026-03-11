<template>
  <view class="fc" :class="{ 'fc--wide': wide }" @click="$emit('tap')">
    <!-- Decorative corner accents -->
    <view class="fc__corner fc__corner--tl" />
    <view class="fc__corner fc__corner--br" />

    <!-- Icon container with double-ring ornament -->
    <view class="fc__icon-outer">
      <view class="fc__icon-ring">
        <view class="fc__icon-bg">
          <text class="fc__icon">{{ icon }}</text>
        </view>
      </view>
    </view>

    <!-- Label -->
    <text class="fc__label">{{ label }}</text>

    <!-- Optional subtitle for wider cards -->
    <text v-if="subtitle" class="fc__subtitle">{{ subtitle }}</text>
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '✦' },
  label: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})

defineEmits(['tap'])
</script>

<style lang="scss" scoped>
.fc {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #261358 0%, #1A0B42 60%, #15093A 100%);
  border: 1rpx solid rgba(201, 168, 76, 0.12);
  border-radius: 28rpx;
  padding: 36rpx 16rpx 28rpx;
  box-shadow:
    0 10rpx 40rpx rgba(0, 0, 0, 0.4),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(201, 168, 76, 0.04) 0%, transparent 100%);
    pointer-events: none;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.6);
  }

  &--wide {
    flex-direction: row;
    justify-content: flex-start;
    padding: 28rpx 32rpx;
    gap: 24rpx;
  }

  &--wide .fc__icon-outer {
    margin-bottom: 0;
  }

  &--wide .fc__label {
    font-size: 28rpx;
    margin-bottom: 0;
  }

  &--wide .fc__subtitle {
    margin-top: 0;
  }
}

/* Corner ornaments */
.fc__corner {
  position: absolute;
  width: 28rpx;
  height: 28rpx;
  pointer-events: none;

  &--tl {
    top: 10rpx;
    left: 10rpx;
    border-top: 2rpx solid rgba(201, 168, 76, 0.2);
    border-left: 2rpx solid rgba(201, 168, 76, 0.2);
    border-top-left-radius: 6rpx;
  }

  &--br {
    bottom: 10rpx;
    right: 10rpx;
    border-bottom: 2rpx solid rgba(201, 168, 76, 0.2);
    border-right: 2rpx solid rgba(201, 168, 76, 0.2);
    border-bottom-right-radius: 6rpx;
  }
}

/* Double-ring icon container */
.fc__icon-outer {
  margin-bottom: 18rpx;
  padding: 6rpx;
  border-radius: 50%;
  border: 1rpx solid rgba(201, 168, 76, 0.12);
}

.fc__icon-ring {
  padding: 4rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.25) 0%, rgba(201, 168, 76, 0.05) 100%);
}

.fc__icon-bg {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(13, 2, 33, 0.9) 0%, rgba(26, 10, 62, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fc__icon {
  font-size: 40rpx;
  color: #D4B05E;
  line-height: 1;
}

.fc__label {
  font-size: 26rpx;
  font-weight: 500;
  color: #E8D5A3;
  letter-spacing: 4rpx;
  text-align: center;
}

.fc__subtitle {
  font-size: 20rpx;
  color: #8B7AAE;
  letter-spacing: 2rpx;
  margin-top: 6rpx;
  text-align: center;
}
</style>
