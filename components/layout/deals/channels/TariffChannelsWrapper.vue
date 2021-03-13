<template>
  <div class="tvPackage">
    <div class="tvPackage__content">
      <template v-if="mainPackages.length">
        <div class="tvPackage__title">
          Базовый пакет
        </div>
        <div class="tvPackage__info-list">
          <tariff-channel-base
            v-for="item in mainPackages"
            :key="item.id"
            :name="item.name"
            is-radio
            :selected="item.id === selectedPackage"
            @select="selectedPackage = item.id"
          >
            <template v-slot="{ change }">
              <d-dot-link accent @click.stop="change">
                <template v-if="!isSearching">
                  <b>{{ item.channels_count }}</b>
                  {{ $plural.n(item.channels_count, 'канал', 'канала', 'каналов') }}
                </template>
                <template v-else>
                  <b>{{ filterChannels(item.channels).length }}</b>
                  из
                  <b>{{ item.channels_count }}</b>
                </template>
              </d-dot-link>
            </template>
            <template v-slot:cost>
              <span>
                <b>+{{ getPriceById(item.id) }}</b> руб
              </span>
            </template>
            <template v-slot:content>
              <tariff-channels-list v-if="item.channels.length" :items="filterChannels(item.channels)" />
            </template>
          </tariff-channel-base>
        </div>
      </template>
      <template v-if="additionalPackages.length">
        <div class="tvPackage__title">
          Дополнительные пакеты
        </div>
        <div class="tvPackage__info-list">
          <tariff-channel-base
            v-for="item in additionalPackages"
            :key="item.id"
            :name="item.name"
            :selected="selectedAdditionalPackages.includes(item.id)"
            @select="switchAdditionalPackage(item.id)"
          >
            <template v-slot="{ change }">
              <d-dot-link accent @click.stop="change">
                <template v-if="!isSearching">
                  <b>{{ item.channels_count }}</b>
                  {{ $plural.n(item.channels_count, 'канал', 'каналов') }}
                </template>
                <template v-else>
                  <b>{{ filterChannels(item.channels).length }}</b>
                  из
                  <b>{{ item.channels_count }}</b>
                </template>
              </d-dot-link>
            </template>
            <template v-slot:cost>
              <span>
                <b>+{{ getPriceById(item.id) }}</b> руб
              </span>
            </template>
            <template v-slot:content>
              <tariff-channels-list :items="filterChannels(item.channels)" />
            </template>
          </tariff-channel-base>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DealTvPackage, IDealItem } from '~/types/deals'
import { TvPackage } from '~/types/tvPackages'

export default Vue.extend({
  props: {
    items: {
      type: Array as PropType<DealTvPackage[]>,
      default: () => []
    },
    tariff: {
      type: Object as PropType<IDealItem>,
      required: true
    },
    search: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    isSearching () {
      return !!(this.search ?? '').length
    },
    selectedPackage: {
      get (): number {
        return this.$vuex.deals.dealsOptions.dealOptions(this.tariff.id).tv_package
      },
      set (packageID: number) {
        this.$vuex.deals.dealsOptions.SelectTvMainPackage({
          id: this.tariff.id,
          packageID
        })
      }
    },
    includedPackage (): number|undefined {
      return this.items.find(el => el.included)?.package
    },
    tvPackages (): TvPackage[] {
      return this.items.map(el => this.$vuex.tvPackage.byId(el.package)!)
    },
    mainPackages (): TvPackage[] {
      return this.tvPackages.filter(el => !el.additional).sort((a, b) => {
        if (a.id === this.includedPackage) {
          return -1
        }
        return a.channels_count - b.channels_count
      })
    },
    additionalPackages (): TvPackage[] {
      return this.tvPackages.filter(el => el.additional)
    },
    selectedAdditionalPackages (): TvPackage['id'][] {
      return this.$vuex.deals.dealsOptions.dealOptions(this.tariff.id).additional_tv_packages ?? []
    }
  },
  mounted () {
    if (!this.selectedPackage) {
      const newValue = this.mainPackages[0]?.id || 0
      if (newValue) {
        this.selectedPackage = newValue
      }
    }
  },
  methods: {
    getPriceById (id: TvPackage['id']): number {
      return this.items.find(el => el.package === id)?.surcharge ?? 0
    },
    filterChannels (items: number[]): number[] {
      const search = this.search.toLocaleUpperCase()
      return !this.search
        ? items
        : items.filter(el => this.$vuex.tvChannel.byId(el)?.name.toLocaleUpperCase().includes(search))
    },
    switchAdditionalPackage (packageID: TvPackage['id']) {
      this.$vuex.deals.dealsOptions.SwitchAdditionalPackage({ id: this.tariff.id, packageID })
    }
  }
})
</script>

<style lang="scss" scoped>
.tvPackage {
  margin-left: -4px;
    margin-right: -4px;
}
</style>
