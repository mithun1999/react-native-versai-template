import { getMediasByOwnerId, uploadMediasByOwnerId } from '../api/file.api'
import { useQuery, useMutation } from 'react-query'

export enum MediaQueryEnum {
  GET_MEDIAS_BY_OWNER_ID = 'get_media_by_owner_id',
}

export function useAllMediasQuery(options = {}, ownerId: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: MediaQueryEnum.GET_MEDIAS_BY_OWNER_ID,
    queryFn: () => getMediasByOwnerId(ownerId),
    ...options,
  })
  return { data, isLoading, refetch }
}

export const useAddMediaToMediaOwnerMutation = (options = {}) => {
  const { mutate: uploadMediaToOwner, isLoading, mutateAsync } = useMutation(uploadMediasByOwnerId, options)
  return { uploadMediaToOwner, isLoading, mutateAsync }
}
