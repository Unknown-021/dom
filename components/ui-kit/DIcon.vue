<template>
  <div :style="divStyles">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        v-for="(path, index) in iconPathes"
        :key="index"
        :fill="color"
        :d="path"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    width: {
      type: Number,
      default: () => 14
    },
    height: {
      type: Number,
      default: () => 14
    },
    color: {
      type: String,
      default: () => '#000000'
    }
  },
  computed: {
    divStyles (): Record<string, string> {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    },
    iconPathes (): string[] {
      const [data] = (this.$slots?.default || [])
      const text = (data ? data.text || '' : '').trim()
      return text.split(',')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
