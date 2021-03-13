<template>
  <div class="slider">
    <div class="ui-wrapper">
      <div class="inverse-left" :style="slidersStyles.leftSlider" />
      <div class="inverse-right" :style="slidersStyles.rightSlider" />
      <div class="range" :style="slidersStyles.range" />
      <span class="thumb" :style="slidersStyles.leftThumb" />
      <span class="thumb" :style="slidersStyles.rightThumb" />
    </div>
    <input
      type="range"
      tabindex="1"
      :value="internalMin"
      :max="max"
      :min="min"
      :step="step"
      @input.prevent="handleRangeChange($event, 'min')"
    >
    <input
      type="range"
      tabindex="2"
      :value="internalMax"
      :max="max"
      :min="min"
      :step="step"
      @input.prevent="handleRangeChange($event, 'max')"
    >
    <div v-if="label" class="labels-wrapper">
      <div>{{ min }}</div>
      <div>{{ max }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    min: {
      type: Number,
      default: () => 0
    },
    max: {
      type: Number,
      default: () => 100
    },
    step: {
      type: Number,
      default: () => 1
    },
    minValue: {
      type: Number,
      default: () => 0

    },
    maxValue: {
      type: Number,
      default: () => 0
    },
    label: {
      type: Boolean
    }
  },
  data: () => ({
    internalMin: 0,
    internalMax: 0
  }),
  computed: {
    slidersStyles (): Record<string, Record<string, string>> {
      const left =
        (100 / (this.max - this.min)) * this.internalMin -
        (100 / (this.max - this.min)) * this.min
      const right =
        (100 / (this.max - this.min)) * this.internalMax -
        (100 / (this.max - this.min)) * this.min
      return {
        range: {
          left: `${left}%`,
          right: `${100 - right}%`
        },
        leftSlider: {
          width: `${left}%`
        },
        rightSlider: {
          width: `${100 - right}%`
        },
        leftThumb: {
          left: `${left}%`
        },
        rightThumb: {
          left: `${right}%`
        }
      }
    }
  },
  watch: {
    minValue (val: number, oldVal: number) {
      if (val !== oldVal) {
        this.internalMin = Math.min(val, this.internalMax)
      }
    },
    maxValue (val: number, oldVal: number) {
      if (val !== oldVal) {
        this.internalMax = Math.max(val, this.internalMin)
      }
    },
    internalMin (val: number, oldVal: Number) {
      if (val < this.min) {
        this.internalMin = this.min
      }
      if (val !== oldVal) {
        this.$emit('update:min-value', val)
      }
    },
    internalMax (val: number, oldVal: Number) {
      if (val > this.max) {
        this.internalMax = this.max
      }
      if (val !== oldVal) {
        this.$emit('update:max-value', val)
      }
    }
  },
  created () {
    this.internalMin = this.minValue
    this.internalMax = this.maxValue || Math.round(this.max / 3 * 2)
  },
  methods: {
    handleRangeChange (event: InputEvent, type: 'min' | 'max') {
      const value = Number((event.target as HTMLInputElement).value)
      switch (type) {
        case 'min': {
          const newValue = Math.min(value, this.internalMax)
          this.internalMin = newValue
          break
        }
        case 'max': {
          const newValue = Math.max(value, this.internalMin)
          this.internalMax = newValue
          break
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  // height: 14px;
  border-radius: 10px;
  text-align: left;

  > .ui-wrapper {
    position: absolute;
    left: 5px;
    right: 5px;
    height: 14px;

    > .inverse-left {
      position: absolute;
      left: 0;
      height: 14px;
      border-radius: 10px;
      background-color: #fff;
      // margin: 0 7px;
    }

    > .inverse-right {
      position: absolute;
      right: 0;
      height: 14px;
      border-radius: 10px;
      background-color: #fff;
      // margin: 0 7px;
    }

    > .range {
      position: absolute;
      left: 0;
      height: 14px;
      border-radius: 14px;
      background: #ee3c6b;
    }

    > .thumb {
      position: absolute;
      top: -7px;
      z-index: 2;
      height: 27px;
      width: 27px;
      transform: translateX(-14px);
      text-align: left;
      box-shadow: 0 0 15px rgba(75,163,218,.06), 0 1px 40px rgba(0,0,0,.1);
      background-color: #FFF;
      border-radius: 50%;
      outline: none;
      pointer-events: none;

      &:before {
        content: '';
        width: 13px;
        height: 13px;
        border-radius: 100%;
        position: absolute;
        background: #ee3c6b;
        box-shadow: inset 0 1px 1px rgba(0,0,0,.22);
        left: 7px;
        top: 7px;
        margin: auto;
        display: inline-block;
      }
    }

  }

  > .labels-wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 23px 17px 0;
    color: grey;
    font-size: 14px;
    user-select: none;
  }

  > input[type=range] {
    position: absolute;
    pointer-events: none;
    -webkit-appearance: none;
    z-index: 3;
    height: 14px;
    top: -2px;
    width: 100%;
    filter: opacity(0);

    &::-ms-track {
      -webkit-appearance: none;
      background: transparent;
      color: transparent;
    }

    &::-moz-range-track {
      -moz-appearance: none;
      background: transparent;
      color: transparent;
    }

    &:focus::-webkit-slider-runnable-track {
      background: transparent;
      border: transparent;
    }

    &:focus {
      outline: none;
    }

    &::-ms-thumb {
      pointer-events: all;
      width: 28px;
      height: 28px;
      border: 0 none;
      cursor: pointer;
      background: red;
    }

    &::-moz-range-thumb {
      pointer-events: all;
      width: 28px;
      height: 28px;
      cursor: pointer;
      border: 0 none;
      background: red;
    }

    &::-webkit-slider-thumb {
      pointer-events: all;
      width: 28px;
      height: 28px;
      border: 0 none;
      background: red;
      cursor: pointer;
      -webkit-appearance: none;
    }

    &::-ms-fill-lower {
      background: transparent;
      border: 0 none;
    }

    &::-ms-fill-upper {
      background: transparent;
      border: 0 none;
    }

    &::-ms-tooltip {
      display: none;
    }
  }

}

</style>
