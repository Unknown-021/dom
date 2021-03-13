<template>
  <div v-if="housesList" class="street__numbers-block">
    <transition name="fade" mode="out-in">
      <div v-if="!showNumbers" key="1">
        <div class="street__numbers-block-title">
          Выберите номер дома из списка
        </div>
        <ul class="street__numbers-list">
          <li v-for="( value, name) in housesList" :key="name">
            <button @click="activeNumbers = name; showNumbers= !showNumbers">
              {{ name }}
            </button>
          </li>
        </ul>
      </div>

      <div v-if="showNumbers" key="2">
        <div class="street__numbers-block-title">
          <button @click="showNumbers = !showNumbers">
            <img src="~/assets/images/sprite-svg/arrow-left-white.svg" width="16" height="16" alt="">
            <span>Назад к диапазонам</span>
          </button>
        </div>
        <ul class="street__numbers-list street__numbers-list-second-view">
          <li v-for="({number, slug, house_id, fias_id}) in housesList[activeNumbers]" :key="slug">
            <button @click="click({number, slug, house_id, fias_id})">
              {{ number }}
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { HouseListItem } from '~/types/layout'

export default Vue.extend({
  data: () => ({
    showNumbers: false,
    activeNumbers: ''
  }),
  computed: {
    housesList () : Record<string, HouseListItem[]> | null {
      return this.$vuex.layout.housesList
    }
  },
  methods: {
    click ({ slug, number, house_id, fias_id }: {slug: string, number: string, house_id: string, fias_id: string}) {
      this.$emit('number', { slug, number, house_id, fias_id })
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
