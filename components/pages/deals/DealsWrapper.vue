<template>
  <transition name="fade" mode="out-in">
    <!-- LOADING TEMPLATE -->
    <div v-if="$vuex.deals.loading" key="loading" class="loading-wrapper">
      <img src="~/assets/images/checking.svg">
    </div>
    <!-- ERROR TEMPLATE -->
    <div v-else-if="$vuex.deals.errorDeals" key="error-loading">
      Ошибка при загрузке
    </div>
    <!-- SHOW DEALS -->
    <deals-items-wrapper v-else key="items" />
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>
  .no-filter-wrapper {
    flex-grow: 1;
    padding: 140px 0;
    display: flex;
    justify-content: center;

    .no-filter-title {
      font-size: 1.5em;
      color: #1e4e9d;
      font-weight: 500;
    }
  }
  .loading-wrapper {
    flex-grow: 1;
    position: relative;
    text-align: center;

    img {
      width: 50vw;
      max-width: 250px;
      position: sticky;
      top: 15vh;
      margin: 20vh 0;
    }
  }
</style>
