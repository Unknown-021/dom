<template>
  <div class="provider__equipment-modal">
    <div class="provider__equipment-modal-back">
      <d-dot-link accent @click="close">
        <template v-slot:prependIcon>
          <img src="~/assets/images/sprite-svg/arrow-left.svg">
        </template>
        Назад
      </d-dot-link>
    </div>
    <div class="provider__equipment-modal-wrapper">
      <div class="provider__equipment-modal-top">
        <div class="provider__equipment-modal-img">
          <img src="~/assets/images/router.png" alt="">
        </div>
        <h3>{{ item.name }}</h3>
        <div class="provider__equipment-modal-price-wrapper">
          <div class="provider__equipment-item-price">
            <div class="provider__equipment-item-price-value">
              1700
            </div>
            <div class="provider__equipment-item-price-period">
              <span>руб</span><span>мес</span>
            </div>
          </div>
          <d-dot-link accent>
            <template v-slot:prependIcon>
              <img src="~/assets/images/sprite-svg/arrow-down-accent.svg">
            </template>
            Рассрочка 12 мес
          </d-dot-link>
        </div>
      </div>
      <div v-if="tabs.length" class="provider__equipment-modal-bottom">
        <div class="tabs">
          <d-underline-tabs v-model="selectedTab" :items="tabs" />
        </div>
        <transition name="fade" mode="out-on">
          <template v-if="!!item.description">
            <div
              v-if="selectedTab === 'description'"
              key="description"
              class="tab"
              v-html="sanitizeDescription(item.description)"
            />
          </template>
          <template v-if="!!item.text">
            <div
              v-if="selectedTab === 'characteristics'"
              key="characteristics"
              class="tab"
              v-html="sanitizeDescription(item.text)"
            />
          </template>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { arrow_down_accent } from '~/assets/js/icons'
import { SANITIZE_CONFIGS } from '~/consts'
import { DeviceDetail } from '~/types/device'

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<DeviceDetail>,
      required: true
    }
  },
  data: () => ({
    icons: { arrow_down_accent },
    selectedTab: ''
  }),
  computed: {
    tabs (): ({id: string, name: string})[] {
      const out = []
      if (this.item.description) {
        out.push({
          name: 'Описание',
          id: 'description'
        })
      }
      if (this.item.text) {
        out.push({
          name: 'Характеристики',
          id: 'characteristics'
        })
      }
      return out
    }
  },
  methods: {
    close () :void {
      this.$emit('close')
    },
    sanitizeDescription (text: string): string {
      return this.$sanitize(text, SANITIZE_CONFIGS.DEVICE_ITEM)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
