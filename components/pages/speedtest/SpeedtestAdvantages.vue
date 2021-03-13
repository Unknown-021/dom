<template>
  <div class="speedtest__advantages">
    <div class="container">
      <h2>Преимущества</h2>
      <div class="speedtest__advantages-list">
        <article class="speedtest__advantages-item">
          <div class="speedtest__advantages-item-img">
            <img :src="require('~/assets/images/sprite-svg/pin-red.svg')" alt="">
          </div>
          <div>
            <h3>Все тарифы по вашему адресу</h3>
            <p>Выберете самый быстрый от провайдера, которому доверяете.</p>
          </div>
        </article>
        <article class="speedtest__advantages-item">
          <div class="speedtest__advantages-item-img">
            <img :src="require('~/assets/images/sprite-svg/carbon-star-review.svg')" alt="">
          </div>
          <div>
            <h3>Акции от провайдеров для новых клиентов</h3>
            <p>Первые месяцы бесплатно или за сниженную цену. Если не устроит скорость, можно расторгнуть договор.</p>
          </div>
        </article>
        <article class="speedtest__advantages-item">
          <div class="speedtest__advantages-item-img">
            <img :src="require('~/assets/images/sprite-svg/price-red.svg')" alt="">
          </div>
          <div>
            <h3>Это бесплатно</h3>
            <p>«Доминтернет» — бесплатный сервис для навигации по тарифам и провайдерам по вашему адресу.</p>
          </div>
        </article>
        <article class="speedtest__advantages-item">
          <div class="speedtest__advantages-item-img">
            <img :src="require('~/assets/images/sprite-svg/shield-check.svg')" alt="">
          </div>
          <div>
            <h3>Надежность</h3>
            <p>Мы являемся официальным дилером каждого из представленных провайдеров и сотрудничаем с ними по договору</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
