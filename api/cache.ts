import { AxiosRequestConfig } from 'axios'
import { setupCache } from 'axios-cache-adapter'

export const axiosCache = setupCache({
  maxAge: 15 * 60 * 1000,
  invalidate: async () => {
    // Тут нам нужна пустая функция
  },
  exclude: {
    filter: (req: AxiosRequestConfig) => {
      return ['report', 'geolocate'].some(el => (req.baseURL || '')?.includes(el))
    },
    methods: ['put', 'delete']
  },
  clearOnError: false

})
