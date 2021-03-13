import { action, createModule, mutation } from 'vuex-class-component'
import Cookies from 'js-cookie'
import api from '~/api'

export class AnaliticStore extends createModule({
  target: 'nuxt',
  namespaced: 'analiticStore'
}) {
  public cookieInfo: string = ''
  public userSessionId: string = ''
  public userIP: string = ''
  get yandexMetricaCookies () {
    return () => Cookies.get('_ym_uid') || ''
  }

  get googleAnaliticMetricaCookies () {
    return () => Cookies?.get('_ga')?.split('.').slice(2, 4).join('.') || ''
  }

  @action async RequestToBack (info : any) {
    await api.callback.RequestToBack(info)
  }

  @action async ChangeCookieInfo (info : string) {
    this.SetCookieInfo(info)
  }

  @action async SendInfoPeople (info: any) {
    await api.callback.RequestWithPeopleInfo(info)
    Cookies.set(
      'earlierSend',
      'true',
      { expires: 60 })
  }

  @action async ChangeUserSessionId (id : string) {
    this.SetUserSessionId(id)
  }

  @action async ChangeUserIP (ip : string) {
    this.SetUserIP(ip)
  }

  @mutation SetUserIP (ip: string) {
    this.userIP = ip
  }

  @mutation SetUserSessionId (id: string) {
    this.userSessionId = id
  }

  @mutation SetCookieInfo (info: string) {
    this.cookieInfo = info
  }
}
