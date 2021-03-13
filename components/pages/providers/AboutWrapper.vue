<template>
  <section class="about-wrapper">
    <div class="container">
      <div class="about-title">
        <h2>О провайдере</h2>
      </div>
      <div class="about-description">
        <span>
          {{ provider.About }}</span>
      </div>
      <div class="about-benefits">
        <div class="about-benefits__title">
          <h3>Преимущества</h3>
        </div>
        <div v-if="provider.aboutBenefits.length" class="about-benefits__item-wrapper">
          <div v-for="benefits in provider.aboutBenefits" :key="benefits.id" class="about-benefits__item">
            <img :src="$cmsImg(benefits.image ? benefits.image.url : '')" alt="">
            <div class="text">
              <div class="about-benefits__item-title">
                <h4>{{ benefits.title }}</h4>
              </div>
              <div class="about-benefits__description">
                {{ benefits.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { IProvider } from '~/types/providers'

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: () => 0
    }
  },
  computed: {
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    }
  },
  methods: {
    formatedText (text: string): string {
      return this.$sanitize(text || '')
    }
  }
})
</script>

<style lang="scss" scoped>
  .provider__top-banner-image {
    background-size: contain;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    width: 900px;
    max-width: 90%;
    padding: 72px 0;
  }
  .about {
    &-title {
      h2 {
        margin-bottom: 40px;
        font-weight: bold;
        font-size: 32px;
        line-height: 40px;
      }
    }
    &-description {
      border-bottom: 1px solid #e7e7e7;
      padding-bottom: 32px;
      margin-bottom: 32px;
      span {
        font-size: 16px;
        line-height: 21px;
        max-width: 80%;
        display: inline-block;
      }
    }
    &-wrapper {
      background-color: #fff;
    }
    &-benefits {
      width: 100%;
      &__title {
        h3 {
          font-size: 24px;
        }
      }
      &__item-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      &__item {
        max-width: 90%;
        width: 344px;
        display: flex;
        align-items: flex-start;
         @media (max-width: 800px) {
           margin-top: 20px;
          }
        img {
          margin: 5px 25px 0 -69px;

          @media (max-width: 800px) {
           margin: 5px 25px 0 0px;
          }
        }
        h4 {
          font-size: 20px;
          margin: 10px 0;
        }

      }
    }
  }
</style>
