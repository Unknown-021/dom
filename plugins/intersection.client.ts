import Vue from 'vue'

/**
 * Usage = v-intersection="{ cb: Function, options?: {} }"
 * where:
 * cb: Function - callback of IntersectionObserver constructor
 * options: not required - IntersectionObserver options
 */

Vue.directive('intersection', {
  inserted (el, binding, vnode) {
    if (vnode.context) {
      // @ts-expect-error
      vnode.context.intersection = new IntersectionObserver(binding.value.cb ?? (() => {}), binding.value.options);
      // @ts-expect-error
      (vnode.context.intersection as IntersectionObserver).observe(el)
    }
  },
  unbind (_el, _binding, vnode) {
    if (vnode.context) {
      // @ts-expect-error
      (vnode.context.intersection as IntersectionObserver).disconnect()
    }
  }
})
