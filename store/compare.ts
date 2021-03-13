import { Context } from '@nuxt/types'
import { action, createModule, mutation } from 'vuex-class-component'
import { IDealItem } from '~/types/deals'
import api from '~/api'

export class CompareStore extends createModule({
  target: 'nuxt',
  namespaced: 'compare'
}) {
  compareList: IDealItem[] = []
  showDifferences = false
  nextSlide = 0
  nextSlideMobileLeft = 0
  nextSlideMobileRight = 0

  @action async NextSlide (payload: number) {
    this.NextSwipe(payload)
  }

  @action async NextSlideMobileRight (payload: number) {
    this.NextSwipeMobileRight(payload)
  }

  @mutation NextSwipeMobileRight (payload: number) {
    this.nextSlideMobileRight = payload
  }

  @action async NextSlideMobileLeft (payload: number) {
    this.NextSwipeMobileLeft(payload)
  }

  @mutation NextSwipeMobileLeft (payload: number) {
    this.nextSlideMobileLeft = payload
  }

  @mutation NextSwipe (payload : number) {
    this.nextSlide = payload
  }

  @action async SwitchItemCompare (item: IDealItem) {
    if (this.isComparing(item)) {
      this.RemoveCompareItem(item)
    } else {
      this.AddCompareItem(item)
    }
  }

  @action async RestoreFromCookie (req: Context['req']) {
    const compareDataString = req.headers.cookie?.split(';').map(el => el.trim()).find(el => el.includes('USER_COMPARE_DATA')) ?? ''
    const params = new URLSearchParams(compareDataString)
    const data = params.get('USER_COMPARE_DATA') ?? '[]'
    const parseData: IDealItem['id'][] = JSON.parse(data)
    const response = await api.tariff.GetById(parseData)
    response.map(el => this.AddCompareItem(el))
  }

  @action async ClearCompare () {
    this.DeleteAllCompareList()
  }

  @action async ChangeShowDifferences (payload: boolean) {
    this.ShowDifferences(payload)
  }

  @mutation ShowDifferences (payload: boolean) {
    this.showDifferences = payload
  }

  @mutation AddCompareItem (item: IDealItem) {
    this.compareList.push(item)
  }

  @mutation DeleteAllCompareList () {
    this.compareList = []
  }

  @mutation RemoveCompareItem (item: IDealItem|IDealItem['id']) {
    const id = typeof item === 'number' ? item : item.id
    const index = this.compareList.findIndex(el => el.id === id)
    if (index >= 0) {
      this.compareList.splice(index, 1)
    }
  }

  get count () {
    return this.compareList.length
  }

  get isComparing () {
    return (item: IDealItem|IDealItem['id']) => {
      const id = typeof item === 'number' ? item : item.id
      return this.compareList.some(el => el.id === id)
    }
  }
}
