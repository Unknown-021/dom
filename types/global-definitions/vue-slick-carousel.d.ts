declare module 'vue-slick-carousel' {
  import 'vue-slick-carousel'
  import { JQuerySlickOptions } from '@types/slick-carousel'
  import { ComponentRenderProxy } from '@vue/composition-api'
  type Props = JQuerySlickOptions;
  interface VueSlickCarousel {
    new (): ComponentRenderProxy<Props>;

    next(): void
    prev(): void
    goTo(slide: number, dontAnimate?:boolean): void
  }
  const vueSlickCarousel: VueSlickCarousel
  export = vueSlickCarousel;
}
