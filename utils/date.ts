export const formatDateFr = (value: string) => {
  if (!value) return

  let cleaned = value.replace(/\D/g, '')

  if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2)
  if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5)

  value = cleaned.slice(0, 10)

  const [day, month, year] = value.split('/').map(Number)

  if (month > 12) value = value.replace(/\/\d{2}$/, '/12')
  if (day > 31) value = value.replace(/^\d{2}/, '31')

  if ([4, 6, 9, 11].includes(month) && day > 30) {
    value = value.replace(/^\d{2}/, '30')
  }

  if (month === 2) {
    const isLeapYear = year && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    const maxDay = isLeapYear ? 29 : 28
    if (day > maxDay) {
      value = value.replace(/^\d{2}/, String(maxDay))
    }
  }

  return value
}

export const dateToString = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const stringToDate = (value: string) => {
  const [day, month, year] = value.split('/').map(Number)
  return new Date(year, month - 1, day)
}
