<template>
  <transition name="fade">
    <div v-if="$vuex.location.locationSettedAuto" class="location-detected-tooltip">
      <div class="title">
        Это ваш город?
      </div>
      <div class="actions">
        <d-btn primary @click="yesHandler">
          Да
        </d-btn>
        <d-btn secondary @click="noHandler">
          Нет, изменить
        </d-btn>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    yesHandler () {
      this.$vuex.location.LOCATION_ACCEPT()
    },
    noHandler () {
      this.$vuex.layout.cityChooser = true
      this.$vuex.location.LOCATION_ACCEPT()
    }
  }
})
</script>

<style lang="scss" scoped>
  .location-detected-tooltip {
    position: absolute;
    top: 200%;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 22px rgba(75, 163, 218, 0.15), 0px 1px 40px rgba(0, 0, 0, 0.1);

    .title {
      font-family: Montserrat;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      padding-left: 30px;
    }

    .actions {
      display: flex;
      flex-flow: row nowrap;

      > .btn {
        white-space: nowrap;
        margin: 10px 16px 0;
        padding: 0 15px;
        min-width: 115px;
        justify-content: center;
      }
    }

    &:before {
      $size: 24px;

      content: '';
      position: absolute;
      background: #fff;
      top: -($size / 2);
      width: $size;
      height: $size;
      transform: rotate(45deg);
      // border-left: 2px solid $primaryBlue;
      // border-top: 2px solid $primaryBlue;
      // border-bottom: 2px solid transparent;
      // border-right: 2px solid transparent;
    }
  }
</style>
