/**
 * Utility helper functions for the application
 */

// Format currency to Vietnamese Dong
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Format date to Vietnamese format
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

// Format date time to Vietnamese format
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Calculate number of nights between two dates
export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : 0
}

// Calculate total price
export const calculateTotalPrice = (pricePerNight: number, nights: number): number => {
  return pricePerNight * nights
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+()]{9,15}$/
  return phoneRegex.test(phone)
}

// Truncate text
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

// Get average rating
export const getAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((a, b) => a + b, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

// Generate booking reference number
export const generateBookingReference = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(5, '0')
  return `BK${year}${month}${day}${random}`
}

// Check if date is today
export const isToday = (date: string | Date): boolean => {
  const today = new Date()
  const checkDate = new Date(date)
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}

// Check if date is in the past
export const isPastDate = (date: string | Date): boolean => {
  const checkDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return checkDate < today
}

// Get room type label
export const getRoomTypeLabel = (roomType: string): string => {
  const labels: Record<string, string> = {
    SINGLE: 'Phòng Đơn',
    DOUBLE: 'Phòng Đôi',
    SUITE: 'Phòng Suite',
    DELUXE: 'Phòng Deluxe',
    PENTHOUSE: 'Penthouse',
  }
  return labels[roomType] || roomType
}

// Get bed type label
export const getBedTypeLabel = (bedType: string): string => {
  const labels: Record<string, string> = {
    SINGLE_BED: 'Giường Đơn',
    DOUBLE_BED: 'Giường Đôi',
    TWIN_BED: 'Hai Giường Đơn',
    QUEEN_BED: 'Giường Queen',
    KING_BED: 'Giường King',
  }
  return labels[bedType] || bedType
}

// Get payment method label
export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    CREDIT_CARD: 'Thẻ Tín Dụng',
    DEBIT_CARD: 'Thẻ Ghi Nợ',
    BANK_TRANSFER: 'Chuyển Khoản Ngân Hàng',
    WALLET: 'Ví Điện Tử',
    CASH: 'Tiền Mặt',
  }
  return labels[method] || method
}

// Delay function for async operations
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
