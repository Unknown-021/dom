
<script lang="ts">
import Vue, { PropType } from 'vue'
import SliderComponent from '~/components/pages/blog/ArticlePageSlider.vue'
import { IDealItem } from '~/types/deals'

export default Vue.component('ArticlePageText', {
  name: 'ArticlePageText',
  functional: true,
  props: {
    tariffs: {
      type: Array as PropType<IDealItem[]>,
      default: () => []
    },
    text: {
      type: String,
      default: ''
    }
  },
  render (h, { props: { text, tariffs } }) {
    if (!text.includes('#SLIDER#')) {
      return h('div', { class: 'article' }, [
        h('div', { class: 'text', domProps: { innerHTML: text } })
      ])
    }
    const [beforeslide, afterslide] = text.split('#SLIDER#')
    const content = [
      h('div', { class: 'text', domProps: { innerHTML: beforeslide } }),
      tariffs.length ? h(SliderComponent, { props: { tariffs } }) : undefined,
      h('div', { class: 'text', domProps: { innerHTML: afterslide } })
    ]
    return h('div', { class: 'article' }, content)
  }
})

</script>
<style lang="scss" scoped>

</style>
