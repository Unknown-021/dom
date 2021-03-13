<template>
  <ValidationObserver id="connect_form" v-slot="{ handleSubmit }" tag="div" class="orderConnect">
    <div class="orderConnect__caption">
      Заявка на подключение
    </div>
    <ValidationProvider
      v-slot="{ failed }"
      rules="required"
      tag="div"
      class="orderConnect__row"
    >
      <d-text-input v-model="name" label="Имя" :error="failed" />
    </ValidationProvider>
    <ValidationProvider
      v-slot="{ failed: itemFailed }"
      tag="div"
      class="orderConnect__row"
      rules="required|phone"
      slim
    >
      <d-text-input
        v-model="phoneNumber"
        v-mask="'+7(###)###-##-##'"
        label="Номер телефона"
        :error="itemFailed"
      />
    </ValidationProvider>
    <transition name="fade" mode="out-in">
      <div v-if="!showDateForm" key="text" class="orderConnect__textDefault">
        <div class="orderConnect__text">
          Мы свяжемся с вами
          <d-dot-link accent @click="showDateFormEvent()">
            в течении 15 минут
          </d-dot-link>
          для уточнения деталей и выбора времени установки
        </div>
      </div>
      <div v-else key="subform" class="orderConnect__textTime">
        <div class="orderConnect__text">
          Выберите удобное время и мы позвоним вам для уточнения деталей и
          выбора времени установки
        </div>
        <div class="inputSelect__row">
          <d-select
            v-model="selectedDay"
            :items="$vuex.layout.comingDates"
            item-name="text"
            item-value="value"
            mandatory
          />
          <d-select
            v-model="selectedTime"
            :items="timesToCallback"
            mandatory
          />
        </div>
      </div>
    </transition>
    <d-btn primary submit @click="handleSubmit(sendForm)">
      Оформить заявку
    </d-btn>
    <div class="orderConnect__terms">
      Отправляя заявку, вы соглашаетесь с политикой обработки персональных
      данных
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue'
import Cookies from 'js-cookie'
import { MOSCOW_OFFSET } from '~/consts'
import { IDealItem } from '~/types/deals'

export default Vue.extend({
  data () {
    return {
      showDateForm: true,
      name: '',
      phoneNumber: '',
      selectedDay: this.$vuex.layout.comingDates[0].value,
      defaultTime: '',
      selectedTime: '',
      isLoading: false,
      isSuccess: false
    }
  },
  computed: {
    timesToCallback (): Array<{ name: string; id: string }> {
      let workHoursInTimeZone: Array<number> = []
      // Переводим offset в часы отноистельно МСК времени
      let timezoneOffset =
        ((new Date().getTimezoneOffset() + MOSCOW_OFFSET) / 60) * -1
      const workHours = [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23
      ]

      // Московское время от -1 до +2 часов
      if (timezoneOffset >= -1 && timezoneOffset <= 2) {
        timezoneOffset = timezoneOffset - 3
        workHoursInTimeZone = workHours.slice(0, timezoneOffset)
      } else if (timezoneOffset < 10 && timezoneOffset >= 3) {
        // Московское время от +3 до +9 часов
        timezoneOffset = timezoneOffset - 2
        workHoursInTimeZone = workHours.slice(timezoneOffset)
      }

      if (this.selectedDay === new Date().toLocaleDateString()) {
        const hours = new Date().getHours()
        const arr: number[] | null = []
        workHoursInTimeZone.forEach((el) => {
          if (el > hours) {
            arr.push(el)
          }
        })
        return arr
          .map(t => `с ${t} до ${t + 1}`)
          .map(el => ({
            name: el,
            id: el
          }))
      }
      return workHoursInTimeZone
        .map(t => `с ${t} до ${t + 1}`)
        .map(el => ({
          name: el,
          id: el
        }))
    },
    tariff (): IDealItem {
      return this.$vuex.deals.dealsOptions.deal(parseInt(this.$route.params?.id))
    },
    tariffOptions (): any {
      return JSON.stringify(this.$vuex.deals.dealsOptions.dealOptions(this.tariff.id))
    }
  },
  watch: {
    selectedDay: {
      handler (_val) {
        this.selectedTime = this.timesToCallback[0].name
      }
    }
  },
  async mounted () {
    await this.$nextTick()
    this.showDateForm = false
    this.selectedTime = 'в течении 15 минут'
  },
  methods: {
    sendForm () {
      const selectedDayInfo = this.$vuex.layout.comingDates.find(item => item.value === this.selectedDay)
      const time = {
        id: new Date().toString(),
        name: this.name,
        phone: this.phoneNumber,
        selectedDay: selectedDayInfo?.value,
        selectedTime: this.selectedTime
      }
      Cookies.set('user_is_waiting_for_a_call', JSON.stringify(time), { expires: 7 })
      this.$vuex.orders.AddNewOrder({
        id: new Date().toString(),
        name: this.name,
        phone: this.phoneNumber,
        selectedDay: selectedDayInfo?.text,
        selectedTime: this.selectedTime
      })

      localStorage.setItem('tariffOptions', this.tariffOptions)
      this.$vuex.analitic.RequestToBack({
        session_id: this.$vuex.analitic.userSessionId,
        yandex_id: this.$vuex.analitic.yandexMetricaCookies(),
        google_id: this.$vuex.analitic.googleAnaliticMetricaCookies(),
        ip: this.$vuex.analitic.userIP,
        request_type: 'order',
        house_id: this.$vuex.location.userHouse.house_id,
        first_name: this.name,
        provider_id: this.tariff.provider,
        tariff: this.tariffOptions,
        phone: this.phoneNumber,
        call_time: `${selectedDayInfo} ${this.selectedTime}`
      })

      this.$router.push({ name: 'checkout' })
    },
    showDateFormEvent () {
      this.showDateForm = true
      this.selectedTime = this.timesToCallback[0].name
    },
    resetTime (): void {
      this.selectedTime = ''
    }
    // async subscribe () {
    //   this.isLoading = true
    //   try {
    //     await api.callback.setNumberAndDate(
    //       this.phoneNumber,
    //       this.selectedDay,
    //       this.selectedTime
    //     )
    //     this.selectedTime = this.timesToCallback[0].name
    //     this.isSuccess = true
    //     await new Promise(resolve => setTimeout(resolve, 1000))
    //     this.$vuex.layout.callBack = false
    //   } catch (e) {
    //   } finally {
    //     this.isLoading = false
    //     this.isSuccess = false
    //     this.phoneNumber = ''
    //   }
    // }
  }
})
</script>

<style lang="scss" scoped></style>
