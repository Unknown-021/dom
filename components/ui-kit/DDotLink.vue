<template>
  <a
    class="link link_dotted"
    :class="accent ? 'link_accent' : ''"
    @click="$emit('click', $event)"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div v-if="$scopedSlots.prependIcon" class="link__icon">
      <slot name="prependIcon" :hover="hover" />
    </div>
    <div class="link__text" :style="{ borderBottom: `1px dashed ${iconColor}` }">
      <slot />
    </div>
    <div v-if="$scopedSlots.appendIcon" class="link__icon">
      <slot name="appendIcon" :hover="hover" />
    </div>
  </a>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    accent: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    hover: false
  }),
  computed: {
    iconColor ():string {
      return this.hover
        ? (this.accent ? '#1e4e9d' : '#EE3C6B')
        : (this.accent ? '#4ba3da' : '#1e4e9d')
    }
  }
})
</script>

<style lang="scss" scoped>
  .link_dotted {
    height: auto;
    text-decoration: none;
    text-underline-position: unset;

    .link__text {
      text-decoration: none;
      height: auto;
      text-underline-position: unset;
    }
  }
</style>
