<template>
  <div class="tariffEnded">
    <transition
      tag="div"
      name="fade"
      mode="out-in"
    >
      <div v-if="!showForm" class="tariffEnded__intro">
        <div class="tariffEnded__icon">
          <img src="~/assets/images/sprite-svg/notifier.svg" width="62">
        </div>
        <div class="tariffEnded__content">
          <div class="tariffEnded__title">
            Еще не окончен контракт с вашим провайдером?
          </div>
          <div class="tariffEnded__text">
            Установите бесплатное напоминание, чтобы не забыть подключиться к более выгодному тарифу
          </div>
        </div>
        <div class="tariffEnded__button">
          <d-btn secondary @click="showForm = true">
            Установить
          </d-btn>
        </div>
      </div>
      <ValidationObserver
        v-else
        v-slot="{ handleSubmit }"
        tag="div"
        class="tariffEnded__form"
      >
        <div class="tariffEnded__title">
          Отправим вам уведомление по смс или на почту за день до окончания контракта
        </div>
        <div class="tariffEnded__form-container">
          <ValidationProvider
            v-slot="{ failed }"
            class="tariffEnded__form-row tariffEnded__form-row_name"
            rules="required"
          >
            <d-text-input
              v-model="name"
              :error="failed"
              label="Имя"
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ failed }"
            class="tariffEnded__form-row tariffEnded__form-row_tel"
            rules="required"
          >
            <d-text-input
              v-model="tel"
              :error="failed"
              label="Телефон или Email"
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ failed }"
            class="tariffEnded__form-row tariffEnded__form-row_date"
            rules="required"
          >
            <d-text-input
              v-model="date"
              :error="failed"
              label="Дата оконкания контракта"
            />
          </ValidationProvider>
          <div class="tariffEnded__form-row tariffEnded__form-row_button">
            <d-btn primary submit @click="handleSubmit(submitForm)">
              Отправить
            </d-btn>
          </div>
        </div>
      </ValidationObserver>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    showForm: false,
    name: '',
    tel: '',
    date: ''
  }),
  methods: {
    submitForm () {
      ///
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
