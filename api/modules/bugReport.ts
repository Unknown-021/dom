import { BaseApi } from '~/api/BaseApi'

export class BugReportApi extends BaseApi {
  async setBugReport (
    message: string
  ): Promise<void> {
    const dto = { message }
    // const { data } = await this._axios.post('/#/', dto)
    await new Promise(resolve => setTimeout(resolve, 1500, dto))
  }
}
