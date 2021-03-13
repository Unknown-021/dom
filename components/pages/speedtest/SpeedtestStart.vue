<template>
  <div class="speedtest__start">
    <div class="container">
      <div class="speedtest__start-widget">
        <img class="speedtest__start-logo" :src="require('~/assets/images/logo.svg')">
        <img
          alt="image"
          class="speedtest__start-speedtest-logo"
          :src="require('~/assets/images/logos/speedtest.svg')"
        >
        <button class="speedtest__start-button-check" type="button">
          Вперед
        </button>
        <div class="speedtest__start-select-test">
          <span class="speedtest__start-select-name">Speedtest.net</span>
          <span class="speedtest__start-select-city">Ростов-на-Дону</span>
        </div>
        <ul class="speedtest__start-list-icons">
          <li class="speedtest__start-list-icons--icon1" />
          <li class="speedtest__start-list-icons--icon2" />
          <li class="speedtest__start-list-icons--icon3" />
          <li class="speedtest__start-list-icons--icon4" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
