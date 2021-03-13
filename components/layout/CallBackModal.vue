<template>
  <d-design-modal v-model="$vuex.layout.callBack">
    <template v-slot:name>
      Оставьте свои контакты и мы с вами свяжемся
    </template>
    <template v-slot:title>
      <ValidationObserver
        v-slot="{ handleSubmit, failed }"
        tag="form"
        class="common__modal-bottom-form"
      >
        <ValidationProvider
          v-slot="{ failed: itemFailed }"
          rules="required"
          slim
        >
          <d-text-input
            v-model="name"
            label="Имя"
            :error="itemFailed"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ failed: itemFailed }"
          rules="required|phone"
          slim
        >
          <d-text-input
            v-model="phoneNumber"
            v-mask="'+7(###)###-##-##'"
            label="Телефон"
            :error="itemFailed"
          />
        </ValidationProvider>
        <div class="callback-common__modal-select-time">
          <div class="common__modal-time">
            Выберите удобное время для звонка
          </div>
          <div class="common__modal-select-wrap">
            <d-select
              v-model="selectedDay"
              :items="$vuex.layout.comingDates"
              item-name="text"
              item-value="value"
              label="День"
              mandatory
            />
            <d-select
              v-model="selectedTime"
              :items="timesToCallback"
              label="Время"
              mandatory
            />
          </div>
        </div>
        <d-btn
          primary
          :loading="isLoading"
          :disabled="failed"
          @click="handleSubmit(subscribe)"
        >
          Отправить
        </d-btn>
      </ValidationObserver>
      <transition name="fade">
        <div v-if="isSuccess" class="common__modal-success">
          <img src="~/assets/images/sprite-svg/check-valid.svg" alt>
        </div>
      </transition>
    </template>
  </d-design-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import api from '~/api'
import { MOSCOW_OFFSET } from '~/consts'

export default Vue.extend({
  data () {
    return {
      name: '',
      phoneNumber: '',
      showDateForm: false,
      selectedDay: this.$vuex.layout.comingDates[0].value,
      selectedTime: 'с 8 до 10',
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
      } else if (timezoneOffset < 10 && timezoneOffset >= 3) { // Московское время от +3 до +9 часов
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
    }
  },

  methods: {
    async subscribe () {
      this.isLoading = true
      try {
        await api.callback.setCallbackData(
          this.name,
          this.phoneNumber,
          this.selectedDay,
          this.selectedTime
        )
        this.selectedTime = this.timesToCallback[0].name
        this.isSuccess = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.$vuex.layout.callBack = false
      } catch (e) {
      } finally {
        this.isLoading = false
        this.isSuccess = false
        this.name = ''
        this.phoneNumber = ''
      }
    }
  }
})
</script>

<style lang="scss">
.inputPlaceholder{
    margin-bottom: 16px;
}
.callback-common__modal-select-time{
  margin-top: 25px;

}

.callback-common__modal-select-time .common__modal-time{
  font-weight: 600;
}

</style>
