export interface DocumentItem {
  id: number
  file_path: string
  signed: boolean
  created_at: string

  metadata: Partial<{
    ip: string
    geolocation: {
      latitude: number
      longitude: number
    }
  }>
}
