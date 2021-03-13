<template>
  <div class="provider__equipment-item">
    <div class="provider__equipment-item-left">
      <div class="provider__equipment-item-left-img">
        <img :src="$cmsImg(item.image && item.image.length ? item.image[0].url : '')" :alt="item.Title">
      </div>
      <div class="provider__equipment-item-bottom">
        <div class="provider__equipment-item-price">
          <!-- v-if="item.price" -->
          <div class="provider__equipment-item-price-value">
            {{ item.price }}
          </div>
          <div class="provider__equipment-item-price-period">
            <span>руб</span><span>мес</span>
          </div>
        </div>
        <d-dot-link accent="accent">
          <template v-slot:appendIcon>
            <img src="~/assets/images/sprite-svg/arrow-down-accent.svg">
          </template>
          Рассрочка 12 мес
        </d-dot-link>
      </div>
    </div>
    <div class="provider__equipment-item-right">
      <h3 v-html="formatedText(item.Title )" />
      <template v-if="tabs.length">
        <div class="tabs">
          <d-underline-tabs v-model="selectedTab" :items="tabs" />
        </div>
        <transition name="fade" mode="out-in">
          <template v-if="!!item.description">
            <div v-if="selectedTab === 'description'" key="tab1" class="tab" v-html="formatedText(item.description)" />
          </template>
          <template v-if="!!item.characteristics">
            <div v-if="selectedTab === 'characteristics'" key="tab2" class="tab" v-html="formatedText(item.characteristics)" />
          </template>
        </transition>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { IDevice, IProvider } from '~/types/providers'

export default Vue.extend({
  props: {
    id: {
      type: Number,
      default: () => 0
    },
    item: {
      type: Object as PropType<IDevice>,
      required: true
    }
  },
  data: () => ({
    selectedTab: ''
  }),
  computed: {
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    },
    tabs (): ({id: string, name: string})[] {
      const out = []
      if (this.item.description) {
        out.push({
          name: 'Описание',
          id: 'description'
        })
      }
      if (this.item.characteristics) {
        out.push({
          name: 'Характеристики',
          id: 'characteristics'
        })
      }
      return out
    },
    slickConfig (): JQuerySlickOptions {
      return {
        dots: true,
        arrows: false,
        dotsClass: 'slick-dots custom-slick-dot-class'
      }
    }
  },
  methods: {
    formatedText (text: string): string {
      return this.$sanitize(text || '')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
