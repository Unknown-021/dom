<template>
  <div class="tooltip-wrapper">
    <slot ref="activator" name="activator" :on="events">
      <i class="icon-info" v-on="events" />
    </slot>
    <transition name="fade" tag="div">
      <div ref="body" class="tooltip-body" :class="[show ? 'visible' : '', tooltipPosition]" :style="styles">
        <slot :close="closeTooltip" />
      </div>
    </transition>
    <div v-if="show" class="tooltip-overlay" @click="show = false" />
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    color: {
      type: String,
      default: () => '#000000'
    },
    background: {
      type: String,
      default: () => '#ffffff'
    },
    opacity: {
      type: Number,
      default: 1
    },
    position: {
      validator: val => ['top', 'bottom', 'left', 'right', 'default'].includes(val),
      default: () => 'default'
    },
    denseX: {
      type: Number,
      default: () => 20
    },
    denseY: {
      type: Number,
      default: () => 10
    },
    hover: {
      type: Boolean,
      default: () => false
    },
    click: {
      type: Boolean,
      default: () => true
    }
  },
  data: () => ({
    show: false,
    absoluteStyles: Object(),
    tooltipCalculatedPos: ''
  }),
  computed: {
    styles () {
      return {
        backgroundColor: this.background,
        color: this.color,
        opacity: this.opacity,
        ...this.absoluteStyles
      }
    },
    tooltipPosition () {
      return this.position !== 'default' ? this.position : this.tooltipCalculatedPos
    },
    events () {
      return {
        ...(this.hover && !this.$device.isMobileOrTablet ? {
          mouseenter: () => this.processShow(),
          mouseleave: () => { this.show = false }
        } : {}),
        ...(this.click || this.$device.isMobileOrTablet ? {
          click: () => this.processShow()
        } : {})
      }
    }
    /* events () {
      return {
        click: () => this.processShow()
      }
    } */
  },
  watch: {
    value (val) {
      this.show = val
    }
  },
  methods: {
    getPositiontop (tip, parent) {
      return {
        top: -tip.height - this.denseY - 10 + 'px',
        right: (parent.width - 32) + 'px'
      }
    },
    getPositionbottom (tip, parent) {
      return {
        bottom: -tip.height - this.denseY - 5 + 'px',
        right: (parent.width - 32) + 'px'
      }
    },
    getPositionleft (tip, parent) {
      return {
        right: this.denseX + 'px',
        top: (parent.height - tip.height) / 2 + 'px'
      }
    },
    getPositionright (tip, parent) {
      return {
        left: this.denseX + 'px',
        top: (parent.height - tip.height) / 2 + 'px'
      }
    },
    getPositionStyle () {
      const tooltipPos = this.$refs.body.getBoundingClientRect()
      const parentPos = this.$el.getBoundingClientRect()
      const win = {
        w: window.innerWidth,
        h: window.innerHeight
      }
      if (this.position !== 'default') {
        this.absoluteStyles = { ...this[`getPosition${this.position}`](tooltipPos, parentPos) }
      } else {
        if (win.h - tooltipPos.top - tooltipPos.height - this.denseY < 0) {
          this.absoluteStyles = { ...this.getPositiontop(tooltipPos, parentPos) }
          this.tooltipCalculatedPos = 'top'
          return
        }
        this.absoluteStyles = { ...this.getPositionbottom(tooltipPos, parentPos) }
        this.tooltipCalculatedPos = 'bottom'
      }
    },
    processShow () {
      this.getPositionStyle()
      this.show = true
    },
    closeTooltip () {
      this.show = false
    }
  }
})
</script>
<style lang="scss" scoped>
  .icon-info {
    width: 20px;
    height: 20px;
    background-image: url('~assets/images/sprite-svg/icon-tooltip.svg');
    background-size: contain;
    display: inline-block;
    filter: invert(1);
    cursor: pointer;
    line-height: 0;
  }
  .tooltip-wrapper {
    display: inline-block;
    position: relative;
    line-height: 0;
  }
  .tooltip-body {
    min-width: 254px;
    max-width: 300px;
    width: auto;
    position: absolute;
    pointer-events: none;
    padding: 16px;
    padding-right: 33px;
    border: inherit;
    filter: opacity(0);
    transition: filter .2s linear;
    z-index: 50;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    border-radius: 4px;
    box-shadow: 0px 1px 24px rgba(0, 0, 0, 0.05), 0px 1px 25px rgba(0, 0, 0, 0.1);
    &::before{
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      background: inherit;
      position: absolute;
      transform: rotate(45deg) translateY(3px);
      z-index: 0;
      border-bottom: inherit;
      border-right: inherit;
    }
    &.top::before {
      right: 10px;
      bottom: -8px;
    }
    &.bottom::before {
      right: 10px;
      top: -10px;
    }
    &.left::before {
      right: -10px;
      top: calc(50% - 10px);
    }
    &.right::before {
      left: -10px;
      top: calc(50% - 10px);
    }
    &.visible {
      filter: opacity(1);
      pointer-events: all;
    }

    p {
      margin-top: 0;
    }
  }

  .tooltip-close {
    position: absolute;
    top: 2px;
    right: 6px;
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.55555 8L15 2.55556L13.4444 1L8 6.44444L2.55558 1.00002L1.00002 2.55558L6.44444 8L1 13.4444L2.55556 15L8 9.55555L13.4445 15L15 13.4445L9.55555 8Z' fill='%23808080'/%3E%3C/svg%3E%0A");
    cursor: pointer;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
    width: 30px;
    height: 30px;
  }

  .tooltip-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 49;
  }
</style>
