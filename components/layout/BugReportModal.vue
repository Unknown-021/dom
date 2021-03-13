<template>
  <d-design-modal v-model="$vuex.layout.bugReport">
    <template v-slot:name>
      Опишите ситуацию, которая у вас возникла
    </template>
    <template v-slot:title>
      <div class="common__modal-text">
        Мы обязательно ее исправим
      </div>
    </template>
    <div>
      <ValidationObserver v-slot="{ handleSubmit, failed }">
        <form class="common__modal-bottom-form">
          <ValidationProvider v-slot="{ failed: itemFailed }" rules="required|max:2000">
            <d-text-area
              v-model="message"
              rows="5"
              maxlength="2000"
              placeholder="Описание ошибки"
              :error="itemFailed"
            />
          </ValidationProvider>
          <d-btn primary :loading="isLoading" :disabled="failed" @click="handleSubmit(subscribe)">
            Отправить
          </d-btn>
        </form>
      </ValidationObserver>
      <transition name="fade">
        <div v-if="isSuccess" class="common__modal-success">
          <img src="~/assets/images/sprite-svg/check-valid.svg" alt>
        </div>
      </transition>
    </div>
  </d-design-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import api from '~/api'

export default Vue.extend({
  data () {
    return {
      message: '',
      isLoading: false,
      isSuccess: false
    }
  },
  methods: {
    async subscribe () {
      this.isLoading = true
      try {
        await api.bugReport.setBugReport(
          this.message
        )
        this.isSuccess = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.$vuex.layout.bugReport = false
      } catch (e) {
      } finally {
        this.isLoading = false
        this.isSuccess = false
        this.message = ''
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
