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

const getIp = async () => {
  const res = await fetch('https://api.ipify.org?format=json')
  const data = await res.json()
  return data.ip // Ex: '192.168.1.1'
}
const getGeolocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      }
    )
  })
}

export const getIPAndLocation = async () => {
  try {
    const [ip, geolocation] = await Promise.all([getIp(), getGeolocation()])
    return {
      ip,
      geolocation
    }
  } catch {
    return {
      ip: null,
      geolocation: null
    }
  }
}
