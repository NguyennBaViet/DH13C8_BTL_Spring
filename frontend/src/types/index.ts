// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phoneNumber: string
  address: string
  city: string
  country: string
}

export interface AuthResponse {
  userId: number
  email: string
  fullName: string
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface User {
  id: number
  email: string
  fullName: string
  phoneNumber: string
  gender?: string
  address: string
  city: string
  country: string
  postalCode?: string
  avatarUrl?: string
  status: string
  userType: string
  createdAt: string
  lastLogin: string
}

// Hotel types
export interface Hotel {
  id: number
  hotelName: string
  description: string
  address: string
  city: string
  country: string
  phoneNumber: string
  email: string
  checkInTime: string
  checkOutTime: string
  starRating: number
  totalRooms: number
  availableRooms: number
  status: string
  createdAt: string
  latitude?: number
  longitude?: number
  website?: string
  ownerId?: number
  updatedAt?: string
}

export interface HotelListResponse {
  content: Hotel[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
}

// Room types
export interface Room {
  id: number
  hotelId: number
  roomNumber: string
  roomType: string
  capacity: number
  pricePerNight: number
  description: string
  maxGuests: number
  bedType: string
  floorNumber: number
  areaSqm: number
  status: string
  amenities?: string[]
  createdAt: string
}

// Booking types
export interface BookingRequest {
  userId: number
  roomId: number
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests?: string
}

export interface Booking {
  id: number
  bookingNumber: string
  userId: number
  roomId: number
  hotelId: number
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  totalPrice: number
  bookingStatus: string
  paymentStatus: string
  specialRequests?: string
  createdAt: string
}

// Payment types
export interface PaymentRequest {
  bookingId: number
  userId: number
  amount: number
  paymentMethod: string
  transactionId: string
}

export interface Payment {
  id: number
  bookingId: number
  amount: number
  paymentMethod: string
  paymentStatus: string
  paymentDate: string
  receiptUrl?: string
}

// Review types
export interface ReviewRequest {
  hotelId: number
  bookingId: number
  overallRating: number
  cleanlinessRating: number
  comfortRating: number
  serviceRating: number
  valueRating: number
  title: string
  comment: string
}

export interface Review {
  id: number
  hotelId: number
  userId: number
  overallRating: number
  cleanlinessRating: number
  comfortRating: number
  serviceRating: number
  valueRating: number
  title: string
  comment: string
  reviewStatus: string
  createdAt: string
}

// API Response wrapper
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  timestamp: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
}

// Store types
export interface AuthStore {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
}
