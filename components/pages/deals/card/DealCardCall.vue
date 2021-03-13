<template>
  <div class="call-card">
    <div class="call-card-left">
      <img src="~/assets/images/sprite-svg/phone.png" style="max-width: 120px" alt="">
    </div>
    <div class="call-card-right">
      <div class="filter-banner">
        <h4 class="filter-banner-title">
          Удобнее подобрать тариф по телефону? Звоните!
        </h4>
        <a :href="'tel:' + $cmsPhone(mainPageNumber || '')" class="filter-banner-phone">
          {{ mainPageNumber }}
        </a>
        <div class="filter-banner-small-text">
          Бесплатный звонок по РФ
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    mainPageNumber (): string | undefined {
      return this.$vuex.layout.mainPage?.MainNumber
    }
  }
})
</script>

<style lang="scss" scoped>
  .call-card {
    display: flex;
    padding: 4px;
    background-color: #fff;
    margin-bottom: 20px;

    &-left {
      background-color: #f3f3f3;
      flex-basis: 56%;
      text-align: center;
      border-radius: 4px;
      justify-content: center;
      display: flex;
      align-items: center;
      @media (max-width: 425px) {
        flex-basis: 61%;
      }
    }
    .filter-banner {
      padding: 24px 16px;
      background-color: #fff;
      font-size: 32px;
      font-weight: 600;
      &-title {
        margin: 0;
      }
      &-phone {
        display: inline-block;
        margin: 13px 0 8px 0;
        color: #ee3c6b;
      }
      &-small-text {
        font-weight: 400;
        font-size: 16px;
        color: #b6b6b6;
      }
      @media (max-width: 1024px) {
        font-size: 24px;
      }
      @media (max-width: 425px) {
        font-size: 16px;
      }
    }
    @media (max-width: 1024px) {
      img {
        width: 100px;
        height: 100px;
      }
    }
    @media (max-width: 425px) {
      img {
        width: 72px;
        height: 72px;
      }
    }
  }
</style>
