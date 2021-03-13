import { BaseApi } from '~/api/BaseApi'

export class CallBackApi extends BaseApi {
  async setCallbackData (
    name: string,
    phoneNumber: string,
    selectedDay: string,
    selectedTime: string
  ): Promise<void> {
    const dto = { name, phoneNumber, selectedDay, selectedTime }
    // const { data } = await this._axios.post('/#/', dto)
    await new Promise(resolve => setTimeout(resolve, 1500, dto))
  }

  async RequestToBack (info : string) {
    await this._axios.post('/report/', info)
  }

  async RequestWithPeopleInfo (info : string) {
    await this._axios.post('/report/', info)
  }
}
