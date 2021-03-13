<template>
  <div class="blogSections__filter-wrapper">
    <div class="blogSections__filter-holder">
      <div class="blogSections__filter tabs-controls">
        <div
          v-for="item in items"
          :key="item[itemValue]"
          class="blogSections__filter-item tab-control"
          :class="[internalValue === item[itemValue] ? 'js-active' : '']"
          @click="internalValue = item[itemValue]"
        >
          {{ item[itemName] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TabsBase from './DTabsBase'

export default TabsBase.extend({})
</script>

<style lang="scss" scoped>
.blogSections__filter-wrapper {
  max-width: 100%;
}
</style>
