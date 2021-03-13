import Vue, { PropType, VNode } from 'vue'

export default Vue.component('RenderVnode', {
  name: 'RenderVnode',
  functional: true,
  props: {
    vnode: {
      type: Object as PropType<VNode>,
      required: true
    }
  },
  render: (_h, { props: { vnode } }) => vnode
})
