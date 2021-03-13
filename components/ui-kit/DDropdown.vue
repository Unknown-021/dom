<template>
  <div class="d-dropdown">
    <div class="link__dropdown link__dropdown_sorting">
      <d-dot-link
        accent
        :class="{ 'is-active': active }"
        @click="active = true"
      >
        <template v-slot:prependIcon>
          <img
            alt="image"
            src="~/assets/images/sprite-svg/sort.svg"
            class="svg-image-sort svg-image-sort-dims"
          >
        </template>
        <template v-slot:appendIcon>
          <img
            alt="image"
            src="~/assets/images/sprite-svg/arrow-down-accent.svg"
            class="svg-image-arrow-down-accent svg-image-arrow-down-accent-dims"
          >
        </template>
        {{ selectedItemText }}
      </d-dot-link>
      <div class="link__dropdown-content" @click="active = false">
        <ul>
          <li
            v-for="item in items"
            :key="item[itemValue]"
            @click.stop="selectValue(item)"
          >
            <a :class="{ 'is-active': item[itemValue] === internalValue }">{{ item[itemName] }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Base from './DTabsBase'

export default Base.extend({
  data: () => ({
    active: false
  }),
  computed: {
    selectedItemText (): string {
      const found = this.items.find(el => el[this.itemValue] === this.internalValue)
      return found ? found[this.itemName] : ''
    }
  },
  methods: {
    selectValue (item: any) {
      this.internalValue = item[this.itemValue]
      this.active = false
    }
  }
})
</script>

<style lang="scss" scoped>
  .dropdown-container {
    position: relative;
  }
</style>
