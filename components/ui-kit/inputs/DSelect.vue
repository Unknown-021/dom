<template>
  <client-only>
    <div class="inputSelect" style="max-height: 64px" :class="[...classList, openned ? 'is-opened' : '']">
      <input
        ref="input"
        v-model="scopedSearchValue"
        :readonly="!filter"
        class="inputSelect__entry"
        :class="label ? 'has-label' : ''"
        type="text"
        @focus="focusHandler"
        @blur="blurHandler"
        @keydown.down.prevent.stop="arrowDownHandler"
        @keydown.up.prevent.stop="arrowUpHandler"
        @keydown.enter.prevent.stop="enterHandler"
        @keydown.esc.prevent.stop="openned = false"
        @keydown="focusHandler"
      >
      <div class="inputSelect__value" :class="label ? 'has-label' : ''">
        <template v-if="stateValue || openned">
          <div v-if="!openned && !searchValue && stateValue">
            <slot name="selected" :item="stateValue">
              {{ stateValue[itemName] }}
            </slot>
          </div>
        </template>
        <template v-else-if="filteredItems.length">
          <slot name="no-select">
            <div />
          </slot>
        </template>
        <!-- <template v-else-if="!scopedSearchValue">
        <slot name="empty">
          <span>Нет вариантов выбора</span>
        </slot>
      </template> -->
        <slot v-if="!noIcon && !loading" name="icon" :openned="openned">
          <img
            alt="image"
            class="icon"
            :class="[openned ? 'openned' : '']"
            src="~/assets/images/sprite-svg/arrow-down.svg"
          >
        </slot>
      </div>
      <div class="inputSelect__content">
        <div class="inputSelect__list">
          <div
            v-for="(item, index) in filteredItems"
            :key="item[itemValue]"
            ref="items"
            class="inputSelect__option"
            :class="selectedItemIndex === index ? 'hover' : ''"
            @click.stop="selectHandler(item)"
          >
            <slot
              name="item"
              :item="item"
            >
              {{ item[itemName] }}
            </slot>
          </div>
        </div>
      </div>
      <div v-if="label" class="inputSelect__label">
        {{ label }}
      </div>
      <transition name="fade">
        <div v-if="loading" class="loading-icon">
          <slot name="loading">
            <img src="~/assets/images/checking.svg">
          </slot>
        </div>
      </transition>
    </div>
  </client-only>
</template>

<script lang="ts">
/* eslint-disable eqeqeq */
import { PropType } from 'vue'
import BaseInput from './BaseInput'
// eslint-disable-next-line camelcase
import { arrow_down } from '~/assets/js/icons'

export default BaseInput.extend({
  props: {
    value: {
      validator: val => ['string', 'object', 'number'].includes(typeof val)
    },
    itemValue: {
      type: String,
      default: () => 'id'
    },
    itemName: {
      type: String,
      default: () => 'name'
    },
    items: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    searchValue: {
      type: String,
      default: () => ''
    },
    loading: {
      type: Boolean
    },
    noIcon: {
      type: Boolean
    },
    filter: {
      type: Boolean
    },
    serverFilter: {
      type: Boolean
    },
    mandatory: {
      type: Boolean
    },
    returnObject: {
      type: Boolean
    },
    clearSearchOnBlur: {
      type: Boolean,
      default: () => true
    }
  },
  watch: {
    stateValue (val: any, oldval: any) {
      if (!oldval || val[this.itemValue] != oldval[this.itemValue]) {
        this.$emit('input', this.returnObject ? val : val[this.itemValue])
      }
    },
    value () {
      this.setIntervalValueFromProp()
    },
    scopedSearchValue (val: string, oldval: string) {
      if (val !== oldval && val !== this.searchValue) {
        this.$emit('update:search-value', val)
      }
    },
    searchValue (val: string) {
      if (val !== this.scopedSearchValue) {
        this.selectedItemIndex = 0
        this.scopedSearchValue = val
      }
    }
  },
  data: () => ({
    openned: false,
    stateValue: undefined as any,
    icons: {
      arrow_down
    },
    scopedSearchValue: '',
    selectedItemIndex: 0
  }),
  computed: {
    filteredItems (): any[] {
      if (!this.scopedSearchValue || this.serverFilter) {
        return this.items
      }
      const scopedSearchValue = this.scopedSearchValue.toLocaleUpperCase()
      return this.items.filter((el) => {
        return String(el[this.itemName]).toLocaleUpperCase().includes(scopedSearchValue)
      })
    },
    refItems (): HTMLElement[] {
      return this.$refs.items as HTMLElement[]
    }
  },
  methods: {
    focusHandler (event: any) {
      if (event.keyCode !== 27) {
        this.openned = true
        this.isActive = true
      }
    },
    blurHandler () {
      this.isActive = false
      setTimeout(() => {
        this.openned = false
        if (this.clearSearchOnBlur) {
          this.scopedSearchValue = ''
        }
      }, 200)
    },
    async selectHandler (payload: any) {
      this.stateValue = payload
      await this.$nextTick()
      this.scopedSearchValue = ''
    },
    arrowDownHandler () {
      if (this.selectedItemIndex + 1 === this.filteredItems.length) {
        this.selectedItemIndex = 0
      } else {
        this.selectedItemIndex++
      }
      this.scrollToKeyboardSelected()
    },
    arrowUpHandler () {
      if (this.selectedItemIndex === 0) {
        this.selectedItemIndex = this.filteredItems.length - 1
      } else {
        this.selectedItemIndex--
      }
      this.scrollToKeyboardSelected()
    },
    enterHandler () {
      if (this.filteredItems[this.selectedItemIndex]) {
        this.stateValue = this.filteredItems[this.selectedItemIndex]
      }
      this.selectedItemIndex = 0
      this.scopedSearchValue = ''
      this.openned = false;
      (this.$refs.input as HTMLInputElement).blur()
    },
    setIntervalValueFromProp () {
      if (typeof this.value === 'string' || typeof this.value === 'number') {
        if (!this.stateValue || (this.stateValue && this.stateValue[this.itemValue] !== this.value)) {
          this.stateValue = this.items.find(el => el[this.itemValue] === this.value)
        }
      } else if (!this.stateValue || (this.stateValue && this.value && this.stateValue[this.itemValue] !== this.value[this.itemValue])) {
        this.stateValue = this.value
      }
    },
    scrollToKeyboardSelected () {
      this.refItems[this.selectedItemIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      // this.refItems[this.selectedItemIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' })
    }
  },
  async mounted () {
    if (this.mandatory) {
      await this.$nextTick();
      [this.stateValue] = this.items
    }
    this.scopedSearchValue = this.searchValue
    this.setIntervalValueFromProp()
  }
})
</script>

<style lang="scss" scoped>
  .inputSelect__entry {
    position: absolute;
    background: transparent;
    border: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    padding: 5px 15px;
  }
  .inputSelect__list {
    color: #000;
    text-align: left;
  }
  .inputSelect__value {
    span {
      color: #000;
    }
  }
  .icon {
    margin-left: auto;
    transition: all .2s linear;

    &.openned {
      transform: rotate(180deg);
    }
  }
  .loading-icon {
    $loading-height: 4px;

    position: absolute;
    right: 30px;
    top: calc(50% - #{$loading-height/2});
    z-index: 5;
    pointer-events: none;
    height: $loading-height;

    &::v-deep {
      img {
        display: block;
        height: $loading-height;
      }
    }
  }
  .inputSelect__option {
    &:hover{
      background-color: #ededed;
    }
  }
  .has-label {
    padding-top: 20px;
  }
</style>
