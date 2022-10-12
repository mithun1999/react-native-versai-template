import { axiosInstance } from '@/utils/axios.utils'
import { AxiosError } from 'axios'

export const sendFeedback = async (payload: { priority: number; title: string; message: string }) => {
  const apiPayload = {
    type: 'conference',
    status: 'bug',
    browserName: 'mobile',
    browserVersion: 'mobile',
    os: 'android',
    eventId: 'mobile',
    userName: 'mobile',
    meta: {
      deviceWidth: 0,
      deviceHeight: 0,
      deviceName: 'mobile',
    },
    ...payload,
  }

  try {
    const { data } = await axiosInstance({
      method: 'POST',
      url: '/v1/bug-reporting',
      data: apiPayload,
    })

    return data
  } catch (error) {
    return { error: error as AxiosError }
  }
}
