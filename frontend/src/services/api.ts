import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  ApiResponse,
  AuthResponse,
  User,
  Hotel,
  Room,
  Booking,
  Payment,
  Review,
  LoginRequest,
  RegisterRequest,
  BookingRequest,
  PaymentRequest,
  ReviewRequest,
  HotelListResponse,
  PaginatedResponse,
} from '@/types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api'
class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // ========== Auth Endpoints ==========
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    )
    return response.data
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    )
    return response.data
  }

  // ========== User Endpoints ==========
  async getUserById(userId: number): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>(
      `/users/${userId}`
    )
    return response.data
  }

  async updateUser(userId: number, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.put<ApiResponse<User>>(
      `/users/${userId}`,
      data
    )
    return response.data
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(
      `/users/${userId}/change-password`,
      null,
      {
        params: { oldPassword, newPassword },
      }
    )
    return response.data
  }

  // ========== Hotel Endpoints ==========
  async getHotels(
    page: number = 0,
    size: number = 10,
    city?: string,
    minRating?: number
  ): Promise<ApiResponse<HotelListResponse>> {
    const params = {
      page,
      size,
      ...(city && { city }),
      ...(minRating && { minRating }),
    }
    const response = await this.client.get<ApiResponse<HotelListResponse>>(
      '/hotels',
      { params }
    )
    return response.data
  }

  async getHotelById(hotelId: number): Promise<ApiResponse<Hotel>> {
    const response = await this.client.get<ApiResponse<Hotel>>(
      `/hotels/${hotelId}`
    )
    return response.data
  }

  // ========== Room Endpoints ==========
  async getRooms(
    hotelId?: number,
    roomType?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<ApiResponse<Room[]>> {
    const params = {
      ...(hotelId && { hotelId }),
      ...(roomType && { roomType }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    }
    const response = await this.client.get<ApiResponse<Room[]>>(
      '/rooms',
      { params }
    )
    return response.data
  }

  async getRoomById(roomId: number): Promise<ApiResponse<Room>> {
    const response = await this.client.get<ApiResponse<Room>>(
      `/rooms/${roomId}`
    )
    return response.data
  }

  // ========== Booking Endpoints ==========
  async createBooking(data: BookingRequest): Promise<ApiResponse<Booking>> {
    const response = await this.client.post<ApiResponse<Booking>>(
      '/bookings',
      data
    )
    return response.data
  }

  async getBookingById(bookingId: number): Promise<ApiResponse<Booking>> {
    const response = await this.client.get<ApiResponse<Booking>>(
      `/bookings/${bookingId}`
    )
    return response.data
  }

  async cancelBooking(
    bookingId: number,
    cancellationReason: string
  ): Promise<ApiResponse<Booking>> {
    const response = await this.client.put<ApiResponse<Booking>>(
      `/bookings/${bookingId}/cancel`,
      { cancellationReason }
    )
    return response.data
  }

  // ========== Payment Endpoints ==========
  async processPayment(data: PaymentRequest): Promise<ApiResponse<Payment>> {
    const response = await this.client.post<ApiResponse<Payment>>(
      '/payments',
      data
    )
    return response.data
  }

  // ========== Review Endpoints ==========
  async createReview(data: ReviewRequest): Promise<ApiResponse<Review>> {
    const response = await this.client.post<ApiResponse<Review>>(
      '/reviews',
      data
    )
    return response.data
  }

  async getHotelReviews(
    hotelId: number,
    page: number = 0,
    size: number = 10,
    status?: string
  ): Promise<ApiResponse<PaginatedResponse<Review>>> {
    const params = {
      page,
      size,
      ...(status && { status }),
    }
    const response = await this.client.get<ApiResponse<PaginatedResponse<Review>>>(
      `/reviews/hotel/${hotelId}`,
      { params }
    )
    return response.data
  }
}

export const apiService = new ApiService()
