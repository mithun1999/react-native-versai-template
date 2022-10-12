import { axiosInstance } from '@/utils/axios.utils'
import { AxiosError } from 'axios'

export const getUser = async () => {
  try {
    const { data } = await axiosInstance({
      method: 'GET',
      url: '/v1/user/me',
    })
    return data
  } catch (error) {
    return { error: error as AxiosError }
  }
}
