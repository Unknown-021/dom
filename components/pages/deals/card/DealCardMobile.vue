<template>
  <div
    class="cardItem cardItem_mobile"
    @click="$vuex.layout.mobileDeal = item"
  >
    <div class="card__holder">
      <deal-card-labels :labels="item.attributes" />
      <div class="card">
        <div class="card__content">
          <div class="card__info">
            <div class="card__info-logo">
              <img
                :src="$cmsImg(provider && provider.FilterAndTariffHeaderLogo
                  ? provider.FilterAndTariffHeaderLogo.url : '')"
                alt=""
              >
            </div>
            <div class="card__info-content">
              <div class="card__info-title">
                {{ item.name }}
              </div>
            </div>
            <div class="card__cost">
              <div class="card__cost-value">
                <s v-if="item.price_norm">{{ item.price_norm }}</s>
                <span>{{ item.price }}</span>
              </div>
              <div class="card__cost-period">
                руб<span>мес</span>
              </div>
            </div>
          </div>
          <deal-service-item
            v-for="service in sortedServices"
            :key="service.service_type"
            :techs="item.technology"
            :item="service"
            :tariff-id="item.id"
            :device="item.device_use"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Base from './DealCardBase'

export default Base.extend({

})
</script>

<style lang="scss" scoped>
  .card__info-content {
    flex-grow: 1;
  }
  .card__cost {
    align-items: flex-end;
    .card__cost-value {
      display: flex;
      flex-direction: column;

      s {
        font-size: 0.4em;
        text-align: end;
        font-weight: normal;
      }
    }
  }
</style>
