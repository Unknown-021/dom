<template>
  <div class="offers__added" :class="[show && 'is-active']" @mouseenter="clearTimeout" @mouseleave="setCloseTimeout">
    <div class="offers__added-container">
      <div class="offers__added-flex">
        <div class="offers__added-logo">
          <img src="~/assets/images/tmp/img-06.png" alt="">
        </div>
        <nuxt-link class="offers__added-content" tag="div" to="/compare">
          <div class="offers__added-text">
            Тариф {{ item ? item.name : 'Тариф' }} добавлен к сравнению
          </div>
          <div class="offers__added-notice">
            Нажмите, чтобы сравнить
          </div>
        </nuxt-link>
        <div class="offers__added-button">
          <d-btn secondary="secondary" to="/compare">
            Сравнить
          </d-btn>
        </div>
        <div class="offers__added-close" @click="show = false">
          <img src="~/assets/images/sprite-svg/close.svg">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IDealItem } from '~/types/deals'

export default Vue.extend({
  data: () => ({
    item: undefined as undefined|IDealItem,
    show: false,
    currentCloseTimeout: undefined as number|undefined,
    subscribtion: () => {},
    deleteSubscription: () => {}
  }),
  mounted () {
    this.subscribtion = this.$vuex.compare.$subscribe('AddCompareItem', (item: IDealItem) => {
      this.item = item
      this.show = true
      this.setCloseTimeout()
    })
    this.deleteSubscription = this.$vuex.compare.$subscribe('RemoveCompareItem', (item: IDealItem|IDealItem['id']) => {
      const id = typeof item === 'number' ? item : item.id
      if (id === this.item?.id) {
        this.clearTimeout()
        this.show = false
      }
    })
  },
  beforeDestroy () {
    this.subscribtion()
    this.deleteSubscription()
  },
  methods: {
    setCloseTimeout () {
      window.clearTimeout(this.currentCloseTimeout)
      this.currentCloseTimeout = window.setTimeout(() => {
        this.show = false
        this.item = undefined
      }, 4000)
    },
    clearTimeout () {
      window.clearTimeout(this.currentCloseTimeout)
      this.currentCloseTimeout = undefined
    }
  }

})
</script>

<style lang="scss" scoped>
  .offers__added {
    z-index: 100;
  }
</style>
