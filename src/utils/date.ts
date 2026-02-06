export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })

export const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })

export const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const restSeconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`
}
