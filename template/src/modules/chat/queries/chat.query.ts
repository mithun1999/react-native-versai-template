import { useQuery } from 'react-query'
import { getAllMailingRecipients } from '../api/chat.api'

export function useCustomListAllQuery() {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: 'custom-list-all.get',
    queryFn: getAllMailingRecipients,
  })
  return { data: data || [], isLoading, refetch, error }
}
