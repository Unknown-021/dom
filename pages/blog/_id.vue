<template>
  <div class="blogItem">
    <div class="blogItem__header">
      <div class="container blogItem__header-container">
        <div class="blogItem__header-image">
          <!-- <img src="~/assets/images/tmp/img-04.jpg" alt=""> -->
        </div>
        <div class="blogItem__header-title">
          <h1>
            {{ articleContent.Title }}
          </h1>
        </div>
      </div>
    </div>
    <div class="container" :style="{ padding: !isDesktop ? '0' : '' }">
      <div class="blogItem__container">
        <div class="blogItem__content">
          <div class="blogItem__content-block">
            <div class="blogItem__content-image">
              <img
                :src="
                  $cmsImg(
                    articleContent.Image && articleContent.Image !== null
                      ? articleContent.Image.url
                      : ''
                  )
                "
                :alt="
                  articleContent.Image && articleContent.Image !== null
                    ? articleContent.Image.url
                    : ''
                "
              >
            </div>
            <div class="blogItem__date">
              <img src="~/assets/images/sprite-svg/date.svg" class="calendar">
              {{ date }}
            </div>
            <article-page-text :tariffs="slides" :text="sanitizedArticle" />
          </div>
        </div>
        <aside class="blogItem__sidebar">
          <aside-search-tariff />
          <div class="useful__item">
            <div class="useful__item-content">
              <div class="useful__item-title">
                Скидка на ЛитРес
              </div>
              <div class="useful__item-announce">
                Подписки на тысячи электронных и аудиокниг от ЛитРес
              </div>
              <div class="useful__item-link">
                <a
                  class="link link_accent link_dotted"
                ><span
                  class="link__icon"
                ><span
                  class="svg-image-arrow-right svg-image-arrow-right-dims"
                /></span><span class="link__text link__text_bold">Подробнее</span></a>
              </div>
            </div>
            <div class="useful__item-image">
              <img src="~/assets/images/useful/litres-bg.jpg" alt="">
            </div>
          </div>
          <div class="blogListItem">
            <div class="blogListItem__image">
              <div class="blogListItem__time">
                <div class="blogListItem__time-icon">
                  <div class="svg-image-time svg-image-time-dims" />
                </div>
                2 мин
              </div>
              <img src="~/assets/images/tmp/img-01.jpg" alt="">
            </div>
            <div class="blogListItem__content">
              <div class="blogListItem__title">
                Ростелеком Лицей
              </div>
              <div class="blogListItem__announce">
                Изучайте школьную программу онлайн
              </div>
            </div>
            <div class="blogListItem__link">
              <a class="link link_dotted link_accent" href="#">
                <div class="link__icon">
                  <div
                    class="svg-image-arrow-right svg-image-arrow-right-dims"
                  />
                </div>
                <div class="link__text">Подробнее</div>
              </a>
            </div>
          </div>
          <div class="subscribeNews">
            <div class="subscribeNews__caption">
              Подписаться на новостную рассылку
            </div>
            <form class="subscribeNews__form">
              <div class="subscribeNews__form-row">
                <div class="inputPlaceholder is-active">
                  <input class="input" type="text" value="Екатерина">
                  <div class="inputPlaceholder__label">
                    Имя
                  </div>
                </div>
              </div>
              <div class="subscribeNews__form-row">
                <div class="inputPlaceholder">
                  <input class="input" type="text">
                  <div class="inputPlaceholder__label">
                    E-mail
                  </div>
                </div>
              </div>
              <button class="btn btn-submit btn-secondary" type="submit">
                Подписаться
              </button><label
                class="checkbox subscribeNews__checkbox"
              ><input type="checkbox" checked="checked"><span
                class="checkbox__indicator"
              ><span
                class="svg-image-checked svg-image-checked-dims"
              /></span><span
                class="checkbox__text"
              >Отправляя заявку, вы соглашаетесь с политикой обработки
                персональных данных</span></label>
            </form>
          </div>
          <div class="reminder">
            <div class="reminder__icon">
              <img
                src="~/assets/images/sprite-svg/reminder.svg"
                alt=""
              >
            </div>
            <div class="reminder__caption">
              Еще не окончен контракт с вашим провайдером?
            </div>
            <div class="reminder__notice">
              Установите бесплатное напоминание, чтобы не забыть подключиться к
              более выгодному тарифу
            </div>
            <a class="btn btn-submit btn-primary" href="#">Установить</a>
          </div>
        </aside>
      </div>
      <blog-read-more-section />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import api from '~/api'
import { IArticle } from '~/types/blog'
import { IDealItem } from '~/types/deals'
import { SANITIZE_CONFIGS } from '~/consts'

export default Vue.extend({
  async asyncData ({ params, $vuex, error }) {
    try {
      await Promise.all([
        !$vuex.blog.lastPosts.length ? $vuex.blog.LastPosts() : Promise.resolve(),
        $vuex.layout.GetBlogPage(),
        $vuex.blog.BlogInit()
      ])
      const content: IArticle = await $vuex.blog.GetArticleById(params.id)
      const slides: IDealItem[] = await api.tariff.GetById(
        (content?.tarrifs || []).map(el => +el.SourceID)
      )
      await $vuex.layout.GetBlogDetailPage()
      await $vuex.breadcrumbs.SetBlogCrumbs(content?.Title)
      return { articleContent: content, slides }
    } catch (e) {
      if (e.message === 'No item found') {
        await $vuex.breadcrumbs.SetBlogCrumbs('Статья не найдена')
        error({
          statusCode: 404
        })
      } else {
        await $vuex.breadcrumbs.SetBlogCrumbs('Ошибка при загрузке статьи')
        error({
          statusCode: 500,
          message: e.message
        })
      }
    }
  },

  data: () => ({
    articleContent: {} as IArticle,
    slides: [] as IDealItem[]
  }),
  computed: {
    date (): string {
      return dayjs(this.articleContent?.published_at ?? Date.now()).format(
        'DD MMMM'
      )
    },
    posts (): IArticle[] {
      return this.$vuex.blog.newPosts
    },
    sanitizedArticle (): string {
      return this.$cmsChangeUrl(
        this.$sanitize(
          this.articleContent?.Post ?? '',
          SANITIZE_CONFIGS.BLOG_PAGE
        )
      )
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.blogDetailPageSeo ?? [])
  }
})
</script>

<style lang="scss" scoped>
.calendar {
  margin-right: 15px;
  margin-bottom: 2px;
}

.blogItem__header-image {
  background-color: #1e4e9d;
}
.blogItem__sidebar {
  display: none;
}
</style>
