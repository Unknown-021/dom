<template>
  <div class="provider__equipment-item">
    <div class="provider__equipment-item-top">
      <div class="provider__equipment-item-img">
        <img :src="$cmsImg(item.image && item.image.length ? item.image[0].url : '')" :alt="item.Title">
      </div>
      <h3>
        {{ item.Title }}
      </h3>
    </div>
    <div class="provider__equipment-item-bottom">
      <d-dot-link accent="accent">
        <template v-slot:appendIcon>
          <img src="~/assets/images/sprite-svg/arrow-down-accent.svg">
        </template>
        Рассрочка 12 мес
      </d-dot-link>
      <div class="provider__equipment-item-price">
        <div class="provider__equipment-item-price-value">
          {{ item.price }}
        </div>
        <div class="provider__equipment-item-price-period">
          <span>руб</span><span>мес</span>
        </div>
      </div>
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
    slickConfig () {
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
