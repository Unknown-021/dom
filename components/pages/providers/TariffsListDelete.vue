<template lang="pug">
    section.provider__tariffs
        h2 Тарифы
        .provider__tariffs-tabs 123
        .provider__tariffs-list
            .provider__tariffs-item
                .provider__tariffs-item-top
                    h3 Технологии без границ+
                    .provider__tariffs-item-price
                        .provider__tariffs-item-price-value 700
                        .provider__tariffs-item-price-period
                            span руб
                            span мес
                    .provider__tariffs-item-desktop-info
                        div
                .provider__tariffs-item-bottom
                    .provider__tariffs-item-info.provider__tariffs-item-info--internet
                        div
                            span.value 100
                            |   Мбит
                        .provider__tariffs-item-info-description Витая пара
                    .provider__tariffs-item-info.provider__tariffs-item-info--wifi
                        div.included
                            span Wi-Fi-роутер
                        div включен в тариф
                    .provider__tariffs-item-info.provider__tariffs-item-info--tv
                        div
                            span.value 237
                            |   каналов
                        .provider__tariffs-item-info-description из них 25 HD
                    .provider__tariffs-item-info.provider__tariffs-item-info--tv-box
                        div.not-included
                            span TV-приставка
                        div аренда – 150 руб/мес

            .provider__tariffs-item
                .provider__tariffs-item-top
                    h3 Технологии без границ+
                    .provider__tariffs-item-price
                        .provider__tariffs-item-price-value 5000
                        .provider__tariffs-item-price-period
                            span руб
                            span мес
                .provider__tariffs-item-bottom
                    .provider__tariffs-item-info.provider__tariffs-item-info--internet
                        div
                            span.value 100
                            |   Мбит
                        .provider__tariffs-item-info-description Витая пара
                    .provider__tariffs-item-info.provider__tariffs-item-info--wifi
                        div.included
                            span Wi-Fi-роутер
                        div включен в тариф
                    .provider__tariffs-item-info.provider__tariffs-item-info--tv
                        div
                            span.value 237
                            |   каналов
                        .provider__tariffs-item-info-description из них 25 HD
                    .provider__tariffs-item-info.provider__tariffs-item-info--tv-box
                        div.not-included
                            span TV-приставка
                        div аренда – 150 руб/мес

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>

</style>
