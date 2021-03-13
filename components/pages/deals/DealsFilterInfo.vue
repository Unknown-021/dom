<template>
  <component :is="$device.isMobileOrTablet ? 'd-modal' : 'd-tooltip'">
    <template v-slot:activator="{on}">
      <i class="icon-info" v-on="on" />
    </template>
    <template v-slot="{close}">
      <div class="tooltip-modal-body">
        <div v-if="$device.isMobileOrTablet" class="tooltip-modal-title">
          <slot name="title" />
        </div>
        <button class="tooltip-close" @click.prevent="close" />
        <slot />
      </div>
    </template>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {
    'd-tooltip': () => import('~/components/ui-kit/DTooltip.vue'),
    'd-modal': () => import('~/components/ui-kit/DModal.vue')
  }
})
</script>

<style lang="scss" scoped>
  .icon-info {
    width: 20px;
    height: 20px;
    background-image: url('~assets/images/sprite-svg/icon-tooltip.svg');
    background-size: contain;
    display: inline-block;
    filter: invert(1);
    cursor: pointer;
    line-height: 0;
  }

  .tooltip-close {
    position: absolute;
    top: 4px;
    right: 6px;
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.55555 8L15 2.55556L13.4444 1L8 6.44444L2.55558 1.00002L1.00002 2.55558L6.44444 8L1 13.4444L2.55556 15L8 9.55555L13.4445 15L15 13.4445L9.55555 8Z' fill='%23808080'/%3E%3C/svg%3E%0A");
    cursor: pointer;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
    width: 30px;
    height: 30px;
  }

  .tooltip-modal-body {
     @include mq($until: desktop) {
      position: absolute;
    border-radius: 10px;
    background-color: #ffffff;
    width: 80%;
    max-width: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 24px;
    padding-top: 32px;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    }
  }

  .tooltip-modal-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #000000;
    margin-bottom: 16px;
  }
</style>
