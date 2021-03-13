<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DBtn',
  props: {
    disabled: {
      type: Boolean
    },
    primary: {
      type: Boolean
    },
    secondary: {
      type: Boolean
    },
    submit: {
      type: Boolean
    },
    href: {
      type: String,
      default: undefined
    },
    to: {
      validator: el => typeof el === 'string' || typeof el === 'object' || typeof el === 'undefined',
      default: undefined
    },
    loading: {
      type: Boolean
    },
    dense: {
      type: Boolean
    }
  },
  render (h) {
    const classList = [
      'btn',
      this.primary ? 'btn-primary' : '',
      this.disabled ? 'btn-disabled' : '',
      this.secondary ? 'btn-secondary' : '',
      this.submit ? 'btn-submit' : '',
      this.dense ? 'btn-dense' : ''
    ].filter(Boolean)

    return h(
      this.to || this.href ? 'nuxt-link' : 'a',
      {
        class: classList,
        on: this.$listeners,
        props: {
          to: this.to || undefined
        }
      },
      [
        h('span', { class: { loading: this.loading } }, this.$scopedSlots?.default?.({
          to: this.to || undefined,
          href: this.href || undefined
        })),
        this.loading && h('div', { class: ['loading-wrapper'] }, [
          this.$scopedSlots?.loading?.({}) ?? h('img', {
            domProps: { src: require(`~/assets/images/${this.primary ? 'loader' : 'checking'}.svg`) }
          })
        ])
      ]
    )
  }
})
</script>

<style lang="scss" scoped>
  .btn {
    position: relative;

    > span {
      transition: opacity .1s linear;
      opacity: 1;

      &.loading {
        opacity: 0;
      }
    }
  }
  .loading-wrapper {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
