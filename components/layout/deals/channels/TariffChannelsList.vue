<template>
  <div class="tvPackage__channels">
    <div class="tvPackage__channels-list">
      <tv-channel-item v-for="item in itemsAlways" :key="item.id" :item="item" />
      <template v-if="isOpen">
        <tv-channel-item v-for="item in itemsHidden" :key="item.id" :item="item" />
      </template>
    </div>

    <div v-if="itemsHidden.length" class="tvPackage__channels-more">
      <d-dot-link @click="isOpen = !isOpen">
        {{ isOpen ? 'Скрыть' : 'Все каналы' }}
      </d-dot-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TvChannel } from '~/types/tvPackages'

export default Vue.extend({
  props: {
    items: {
      type: Array as PropType<TvChannel['id'][]>,
      default: () => []
    }
  },
  data: () => ({
    isOpen: false
  }),
  computed: {
    channels (): TvChannel[] {
      return this.items.map(el => this.$vuex.tvChannel.byId(el)!)
    },
    itemsAlways (): TvChannel[] {
      return this.channels.slice(0, 6)
    },
    itemsHidden (): TvChannel[] {
      return this.channels.slice(6)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
