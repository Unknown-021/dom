<template>
  <d-modal :value="value" @input="$emit('input', $event)">
    <template v-slot:activator="{ click, on }">
      <slot name="activator" :click="click" :on="on" />
    </template>
    <template v-slot="{ close }">
      <div class="common__modal">
        <button class="common__modal-close" @click="close">
          <span class="visually-hidden">Закрыть</span>
        </button>
        <div class="common__modal-top">
          <div v-if="$scopedSlots.name" class="common__modal-title">
            <slot :close="close" name="name" />
          </div>
          <slot :close="close" name="title" />
        </div>
        <div v-if="$scopedSlots.default" class="common__modal-bottom">
          <slot :close="close" />
        </div>
      </div>
    </template>
  </d-modal>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
