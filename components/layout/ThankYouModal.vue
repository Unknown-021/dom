<template>
  <d-design-modal :value="showModalLink">
    <template>
      <h2 class="question__title">
        Помогите улучшить «Доминтернет»
      </h2>
      <span class="question__subtitle">Пока ждете обратного звонка пройдите короткий опрос для улучшения сервиса</span>
      <a class="question__link" href="https://anketolog.ru/s/457401/IGf5h54R">
        Пройти опрос
      </a>
    </template>
  </d-design-modal>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      showModalLink: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.showModalLink = true
    }, 2000)
  }
})
</script>

<style>
.common__modal-top {
    padding: 20px 125px;
}
.common__modal-bottom{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.question__link{
  margin-top: 40px;
  width: 279px;
  height: 56px;
  background: #EE3C6B;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  padding-top: 20px;
}
.question__link:hover{
  color: white;
}
</style>
