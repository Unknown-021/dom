<template>
  <div class="cardItem">
    <div class="card__holder">
      <deal-card-labels :labels="item.attributes" />
      <div class="card__comparison-holder">
        <div class="card__comparison">
          <div class="card__comparison-button" data-closed="Сравнить" data-opened="В сравнении" :class="{ 'is-active': isInCompare }" @click="addThisItemToCompare">
            <img v-if="isInCompare" src="~/assets/images/sprite-svg/to-compare-active.svg"><img v-else src="~/assets/images/sprite-svg/to-compare.svg">
            <div class="card__comparison-button-text">
              {{ isInCompare ? 'В сравнении' : 'Сравнить' }}
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card__content">
          <div class="card__info">
            <div class="card__info-logo">
              <img
                :src="$cmsImg(provider && provider.ProviderLogo
                  ? provider.ProviderLogo.url : '')"
                alt=""
              >
            </div>
            <div v-if="provider" class="card__info-content">
              <div class="card__info-provider">
                {{ provider.Name }}
              </div>
              <div class="card__info-title">
                {{ item.name }}
              </div>
              <div class="card__info-description">
                <card-benefits :items="item.benefits" />
              </div>
            </div>
          </div>
          <deal-service-item
            v-for="service in sortedServices"
            :key="service.service_type"
            :item="service"
            :device="item.device_use"
            :techs="item.technology"
            :expanded="expanded"
            :tariff-id="item.id"
          />
          <transition-expand v-if="item.content">
            <service-description v-if="expanded" :tariff="item" />
          </transition-expand>
        </div>
        <div class="card__sidebar">
          <div class="card__cost">
            <div class="card__cost-value">
              <s v-if="item.price_norm">{{ item.price_norm }}</s><span>{{ item.price }}</span>
            </div>
            <div class="card__cost-period">
              руб<span>мес</span>
            </div>
          </div>
          <card-features :items="item.attributes" />
          <card-prices :expanded="expanded" :item="item" />
          <d-btn :key="item.id" primary="primary" submit="submit" :to="tariffPage">
            Подключить
          </d-btn>
          <a class="btn-more btn-more__text" @click="expanded = !expanded">
            {{ expanded ? 'Скрыть' : 'Подробнее' }}
            <img :class="{ rotated: expanded }" src="~/assets/images/sprite-svg/arrow-down-red.svg">
          </a>
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
  .card__cost-value {
    s {
      font-size: 0.5em;
      margin-right: 10px;
    }
  }
  .btn-more__text {
    img {
      margin-left: 4px;
      transition: transform .3s linear;
      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
</style>
