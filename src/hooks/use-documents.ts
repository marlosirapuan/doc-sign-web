import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '../libs/axios'

import type { DocumentItem } from '../components/signature-upload.types'
import { queryClient } from '../libs/query-client'

type UseDocumentsOptions = {
  enabled?: boolean
}
export const useDocuments = ({ enabled = true }: UseDocumentsOptions) => {
  const mutation = {
    createDocument: useMutation({
      mutationFn: async (data: FormData) => {
        const endpoint = '/documents'
        const response = await api.post<DocumentItem>(endpoint, data, {
          timeout: 5000,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] })
      }
    }),
    deleteDocument: useMutation({
      mutationFn: async (id: number) => {
        const endpoint = `/documents/${id}`
        const response = await api.delete(endpoint, { timeout: 5000 })
        return response
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] })
      }
    })
  }

  const query = useQuery({
    queryKey: ['documents'],
    queryFn: async ({ signal }) => {
      const endpoint = '/documents'
      const response = await api.get<DocumentItem[]>(endpoint, { timeout: 5000, signal })
      return response
    },
    enabled,
    staleTime: Number.POSITIVE_INFINITY
  })

  return {
    mutation,
    query
  }
}
