<template>
  <d-modal
    v-model="$vuex.layout.cityChooser"
  >
    <template v-slot="{ close }">
      <city-choose-modal-body
        @close="close"
      />
    </template>
  </d-modal>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    selectedCityName (): string {
      return this.$vuex.location.city || 'Не определен'
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
