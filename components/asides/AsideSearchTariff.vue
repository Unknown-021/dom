<template>
  <div class="appeal">
    <div class="appeal__caption">
      <div class="appeal__caption-icon">
        <img src="~/assets/images/sprite-svg/pin-red.svg" alt="">
      </div>
      <div class="appeal__caption-title">
        Подключайте выгодные тарифы на интернет и ТВ в {{ $vuex.location.selectedCity.name_l }}
      </div>
    </div>
    <div class="appeal__content">
      <p class="appeal__content-notice">
        Просто введите адрес и получите список лучших предложений, доступных для вашего дома
      </p>
      <ValidationObserver v-slot="{ handleSubmit }" class="appeal__form" tag="div">
        <ValidationProvider v-slot="{ errors }" class="appeal__form-row" name="город" rules="required" tag="div">
          <d-text-input v-model="form.city" label="Город" :error="!!errors.length" @keydown.native.enter="handleSubmit(submitForm)" />
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" class="appeal__form-row" name="улица" rules="required" tag="div">
          <d-text-input v-model="form.street" label="Улица" :error="!!errors.length" @keydown.native.enter="handleSubmit(submitForm)" />
        </ValidationProvider>
        <div class="appeal__form-row appeal__form-row_number">
          <ValidationProvider v-slot="{ errors }" name="дом" rules="required" slim="slim">
            <d-text-input v-model="form.house" label="Дом" :error="!!errors.length" @keydown.native.enter="handleSubmit(submitForm)" />
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="квартира" rules="" slim="slim">
            <d-text-input v-model="form.appatment" label="Квартира" :error="!!errors.length" @keydown.native.enter="handleSubmit(submitForm)" />
          </ValidationProvider>
        </div>
        <d-btn primary="primary" submit="submit" @click="handleSubmit(submitForm)">
          Найти тарифы
        </d-btn>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    form: {
      city: 'Ростов-на-Дону',
      street: '',
      house: '',
      appatment: ''
    }
  }),
  methods: {
    submitForm () {

    }
  }
})
</script>

<style lang="scss" scoped>

</style>
