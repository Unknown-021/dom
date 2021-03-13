<template>
  <transition
    name="expand"
    duration="300"
    @enter="enter"
    @leave="leave"
    @before-enter="beforeEnter"
  >
    <slot />
  </transition>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    beforeEnter (el: HTMLElement) {
      el.style.maxHeight = '0px'
    },
    enter (el: HTMLElement) {
      requestAnimationFrame(() => {
        el.style.maxHeight = `${el.scrollHeight}px`
      })
    },
    leave (el: HTMLElement) {
      el.style.maxHeight = '0px'
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
