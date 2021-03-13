/* eslint-disable camelcase */
import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru.json'

import { required, email, min_value, max_value, between, max } from 'vee-validate/dist/rules'

localize('ru', ru)

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

extend('phone', (value: string) => {
  if (/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/.test(value)) {
    return true
  }
  return 'Поле должно быть номером телефона'
})

Object.entries({
  required,
  email,
  between,
  min_value,
  max_value,
  max
}).forEach(([key, validator]) => extend(key, validator))
