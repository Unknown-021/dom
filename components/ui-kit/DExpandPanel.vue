<template>
  <div class="popularFaq__item">
    <div class="popularFaq__item-toggler" @click="show = !show">
      <div class="popularFaq__item-title">
        <slot name="title" />
      </div>
      <div class="popularFaq__item-icon">
        <img :class="['arrow', show ? 'rotated' : '']" src="~/assets/images/sprite-svg/arrow-down-grey.svg" alt="">
      </div>
    </div>
    <div class="popularFaq__item-content" :class="{ closed: !show }">
      <transition-expand>
        <div v-if="show">
          <slot />
        </div>
      </transition-expand>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    show: false
  })
})
</script>

<style lang="scss" scoped>
.arrow {
  transition: transform .4s linear;
  transform-origin: center 30%;

  &.rotated {
    transform: rotate(180deg);
  }
}
.popularFaq__item-content {
  &.closed {
    margin: 0!important;
    padding-top: 0!important;
    padding-bottom: 0!important;
  }
}
</style>
