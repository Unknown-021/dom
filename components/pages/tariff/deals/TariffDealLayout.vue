<template>
  <div class="tariffItem">
    <div class="tariffItem__title">
      {{ name }}
    </div>
    <div v-if="!hideHeader" class="tariffItem__header">
      <div class="tariffItem__header-content">
        <div class="tariffItem__header-icon">
          <slot name="header-icon" />
        </div>
        <div class="tariffItem__header-info">
          <slot name="header-info" />
        </div>
      </div>
      <div v-if="$scopedSlots['header-status']" class="tariffItem__header-status">
        <slot name="header-status" />
      </div>
    </div>
    <div class="tariffEquipmentItem">
      <slot />
    </div>
    <transition name="fade">
      <div v-if="add" class="tariffItem__add">
        <d-dot-link accent @click="$emit('add')">
          <img src="~/assets/images/sprite-svg/plus.svg">
          Добавить оборудование
        </d-dot-link>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true
    },
    add: Boolean,
    hideHeader: Boolean
  }
})
</script>

<style lang="scss" scoped>
.tariffItem__header{
  overflow: hidden
}
</style>
