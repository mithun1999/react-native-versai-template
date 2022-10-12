import { axiosInstance } from '@/utils/axios.utils'

export const getMediasByOwnerId = async (ownerId: string) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/v1/media/owner/${ownerId}`,
  })
  return data
}

export const uploadMediasByOwnerId = async ({ ownerId, file }: { ownerId: string; file: File }) => {
  const formData = new FormData()
  formData.append('files', file)

  const { data } = await axiosInstance({
    method: 'POST',
    url: `/v1/media/add/${ownerId}`,
    data: formData,
    headers: { 'Content-type': 'multipart/form-data' },
  })
  return data
}
