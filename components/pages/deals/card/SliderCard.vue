<template>
  <div>
    <div class="card__wrapper" :style="{margin: isOne ? 'auto' : '25px 7px' }">
      <div class="card-header">
        <img
          :src="$cmsImg(provider && provider.BestOffersLogo
            ? provider.BestOffersLogo.url : '')"
          alt="provider-img"
        >
        <div class="header-sibtitle">
          <span>{{ provider ? provider.Name : "" }}</span>
          <h2>{{ item.name }}</h2>
        </div>
      </div>
      <div class="card-main">
        <div class="services">
          <div style="width: 100%">
            <deal-service-item
              v-for="service in sortedServices"
              :key="service.service_type"
              :item="service"
              :device="item.device_use"
              :techs="item.technology"
              :tariff-id="item.id"
              :is-blog="isBlog"
              :blog="true"
            />
          </div>
        </div>
        <div class="benefits">
          <card-benefits :items="item.benefits" />
        </div>
      </div>
      <div class="card-footer">
        <div class="card-footer-price">
          <div class="offerItem__footer">
            <div class="offerItem__cost">
              <div class="offerItem__cost-value" :style="{fontSize: !isDesktop ? '38px' : '' }">
                {{ item.price }}
              </div>
              <div class="offerItem__cost-period" :style="{fontSize: !isDesktop ? '14px' : '' }">
                руб <span>мес</span>
              </div>
            </div>
            <div class="offerItem__footer-button">
              <d-btn class="card-link" secondary :to="$regionLink({ name: 'tariffs-id', params: { id: `${item.id}` } })">
                Подробнее
              </d-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DEAL_SERVICE_TYPE, IDealItem, DealDevice, DealServiceItem } from '~/types/deals'
import { IProvider } from '~/types/providers'

export default Vue.component('SliderCard', {
  props: {
    item: {
      type: Object as PropType<IDealItem>,
      required: true
    },
    isBlog: {
      type: Boolean,
      default: false
    },
    isOne: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    provider (): IProvider | undefined {
      if (!this.item.provider) {
        return
      }
      return this.$vuex.providers.byId(this.item.provider)!
    },
    providerImg (): string | undefined {
      if (!this.provider) {
        return
      }
      return this.provider?.BestOffersLogo?.url
    },
    sortedServices (): DealServiceItem[] {
      return [...this.item.services].sort(
        (a, b) => a.service_type - b.service_type
      )
    },
    routers (): DealDevice[] {
      return this.item.device_use?.filter((item) => {
        return item.services.includes(DEAL_SERVICE_TYPE.INTERNET)
      })
    },
    router (): DealDevice | undefined {
      return this.routers[0]
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  }
})
</script>

<style lang="scss" scoped>
.btn {
  padding-left: 30px;
  padding-right: 30px;
}
  .card {
    &__wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
      margin: 25px 7px;
      padding: 16px;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
      max-width: 330px;
      box-shadow: 0px 1px 24px rgba(0, 0, 0, 0.05);
      min-height: 490px;
    }
    &-header {
      display: flex;
      //align-items: flex-end;
      img {
        width: 54px;
        border-radius: 4px;
        object-fit: contain;
        margin-right: 12px;
      }
      h2 {
        font-size: 24px;
        line-height: 29, 26px;
      }
      .header-sibtitle {
        display: flex;
        flex-direction: column;
        span {
          color: #808080;
          font-size: 14px;
        }
      }
    }
    &-main {
      .services {
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;

        .wi-fi {
          display: flex;
          flex-direction: column;
          /* justify-content: flex-end; */
          align-items: flex-start;

          img {
            margin-bottom: 16px;
          }
        }
      }
      .benefits {
        ul {
          list-style-type: "— ";
          padding: 0 22px;
        }
      }
    }

  }.offerItem__cost {
      margin-right: 10px;
    }
</style>
