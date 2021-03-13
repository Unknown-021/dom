
<script lang="ts">
import Vue from 'vue'
import ProviderQuestionMobile from './providerQuestions/ProviderQuestionMobile.vue'
import ProviderQuestionDesktop from './providerQuestions/ProviderQuestionDesktop.vue'

export default Vue.component('ProviderQuestions', {
  functional: true,
  props: {
    id: {
      type: String,
      default: () => 0
    },
    isDesktop: {
      type: Boolean
    }
  },
  render (h, { props }) {
    return h(
      props.isDesktop ? ProviderQuestionDesktop : ProviderQuestionMobile,
      { props }
    )
  }
})
</script>

<style lang="scss" scoped>
</style>
