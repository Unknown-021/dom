<template>
  <div>
    <slot
      name="activator"
      :on="{ click: showModal }"
      :click="showModal"
    />
    <transition name="fade">
      <div
        v-if="show"
        class="modal-wrapper"
        :style="{ zIndex }"
        @click.self="maskClickHandler"
      >
        <slot
          name="default"
          :close="closeModal"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Boolean
    },
    zIndex: {
      validator: val => ['string', 'number'].includes(typeof val),
      default: () => 1000
    }
  },
  data: () => ({
    internalShow: false,
    bodyModalClass: 'modal_open'
  }),
  computed: {
    show: {
      get (): boolean {
        return this.internalShow
      },
      set (val: boolean) {
        this.changeBodyClass(val)
        this.internalShow = val
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value (val: boolean, oldVal: boolean) {
      if (val !== oldVal) {
        this.changeBodyClass(val)
        this.internalShow = val
      }
    }
  },
  created () {
    this.internalShow = this.value || false
  },
  beforeDestroy () {
    document.body.classList.remove(this.bodyModalClass)
  },
  methods: {
    showModal () {
      this.show = true
    },
    closeModal () {
      this.show = false
    },
    maskClickHandler () {
      this.show = false
    },
    changeBodyClass (need: boolean) {
      if (need) {
        document.body.classList.add(this.bodyModalClass)
      } else {
        document.body.classList.remove(this.bodyModalClass)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .2);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
