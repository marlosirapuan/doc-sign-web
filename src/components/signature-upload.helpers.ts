export const fileName = (path: string) => {
  const parts = path.split('/')
  return parts[parts.length - 1]
}

export const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString('en', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
