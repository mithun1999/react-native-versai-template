import { axiosInstance } from '@/utils/axios.utils'

export const getAllMailingRecipients = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/v1/mailing-recipient',
  })
  return data
}
