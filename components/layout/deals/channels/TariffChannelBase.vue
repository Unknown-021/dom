<template>
  <div class="tvPackage__info" :class="{ 'is-checked': selected }">
    <div class="tvPackage__info-row" @click="changeHandler">
      <div class="tvPackage__info-checker">
        <div v-if="isRadio" class="inputRadio">
          <input type="radio" :checked="selected">
          <div class="inputRadio__indicator" />
        </div>
        <div v-else class="inputCheckbox">
          <input type="checkbox" :checked="selected">
          <div class="inputCheckbox__indicator" />
        </div>
      </div>
      <div class="tvPackage__info-label">
        <label>{{ name }}</label>
      </div>
      <div class="tvPackage__info-counts">
        <slot :change="() => showAdd = !showAdd" />
      </div>
      <div class="tvPackage__info-cost">
        <slot name="cost" />
      </div>
    </div>
    <transition name="fade">
      <template v-if="showAdd">
        <slot name="content" />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    selected: {
      type: Boolean
    },
    isRadio: {
      type: Boolean
    },
    name: {
      type: String,
      required: true
    }
  },
  data: () => ({
    showAdd: false
  }),
  methods: {
    changeHandler () {
      this.$emit('select')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
