import { Plugin } from '@nuxt/types'
import { MetaInfo } from 'vue-meta'
import { IDynamicSEO, IStaticSEO } from '~/types/deals'

declare module 'vue/types/vue' {
  interface Vue {
    $GenerateMeta(components: (IDynamicSEO | IStaticSEO)[]): MetaInfo;
  }
}

const GenerateMetaPlugin: Plugin = ({ $replacer, $cmsImg }, inject) => {
  const GenerateMeta = (components: (IDynamicSEO | IStaticSEO)[]): MetaInfo => {
    const staticSeo = components.find(
      el => el.__component === 'seo-component.seo-component'
    ) as IStaticSEO | undefined
    const dynamicSeo = components.find(
      el => el.__component === 'seo-component.seo-dynamic'
    ) as IDynamicSEO | undefined
    const dynamicDescriptionGroup1 = !$replacer(dynamicSeo?.DynamicDescriptionGroup1).includes('NO VARS FOR REPLACE!')
      ? $replacer(dynamicSeo?.DynamicDescriptionGroup1) : ''
    const dynamicDescriptionGroup2 = !$replacer(dynamicSeo?.DynamicDescriptionGroup2).includes('NO VARS FOR REPLACE! FOR REPLACE!')
      ? $replacer(dynamicSeo?.DynamicDescriptionGroup2) : ''
    const dynamicDescriptionGroup3 = !$replacer(dynamicSeo?.DynamicDescriptionGroup3).includes('NO VARS FOR REPLACE!')
      ? $replacer(dynamicSeo?.DynamicDescriptionGroup3) : ''
    const description = dynamicDescriptionGroup1
      .concat(dynamicDescriptionGroup2)
      .concat(dynamicDescriptionGroup3)
      .replace('null', ' ')
      .replace(/<\/?(.+?)>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    const dynamicTitleGroup1 = !$replacer(dynamicSeo?.DynamicTitleGroup1).includes('NO VARS FOR REPLACE!')
      ? $replacer(dynamicSeo?.DynamicTitleGroup1) : ''
    const dynamicTitleGroup2 = !$replacer(dynamicSeo?.DynamicTitleGroup2).includes('NO VARS FOR REPLACE!')
      ? $replacer(dynamicSeo?.DynamicTitleGroup2) : ''
    const dynamicTitleGroup3 = !$replacer(dynamicSeo?.DynamicTitleGroup3).includes('NO VARS FOR REPLACE!')
      ? $replacer(dynamicSeo?.DynamicTitleGroup3) : ''
    const title = dynamicTitleGroup1
      .concat(dynamicTitleGroup2)
      .concat(dynamicTitleGroup3)
      .replace('null', ' ')
      .replace(/<\/?(.+?)>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return {
      title: title || $replacer(staticSeo?.title) || '',
      meta: [
        {
          name: 'description',
          content:
          description ||
            $replacer(staticSeo?.description) ||
            ''
        },
        {
          name: 'keywords',
          content: dynamicSeo?.Keywords || staticSeo?.keywords || ''
        },
        {
          name: 'og:image',
          content: dynamicSeo?.ogImage?.url
            ? $cmsImg(dynamicSeo?.ogImage?.url || '')
            : $cmsImg(staticSeo?.ogImage?.url || '')
        },
        {
          name: 'og:title',
          content:
            $replacer(dynamicSeo?.ogTitle) ||
            $replacer(staticSeo?.ogTitle) ||
            ''
        }
      ]
    }
  }
  inject('GenerateMeta', GenerateMeta)
}

export default GenerateMetaPlugin
