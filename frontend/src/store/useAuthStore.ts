import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { apiService } from '@/services/api'
import { User, LoginRequest, RegisterRequest, AuthStore } from '@/types'

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isLoggedIn: false,

        login: async (email: string, password: string) => {
          try {
            const response = await apiService.login({
              email,
              password,
            })

            const { data } = response
            const user: User = {
              id: data.userId,
              email: data.email,
              fullName: data.fullName,
              phoneNumber: '',
              address: '',
              city: '',
              country: '',
              status: 'ACTIVE',
              userType: 'CUSTOMER',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            }

            localStorage.setItem('token', data.accessToken)
            localStorage.setItem('user', JSON.stringify(user))

            set({
              token: data.accessToken,
              user,
              isLoggedIn: true,
            })
          } catch (error) {
            console.error('Login failed:', error)
            throw error
          }
        },

        register: async (data: RegisterRequest) => {
          try {
            const response = await apiService.register(data)

            const { data: authData } = response
            const user: User = {
              id: authData.userId,
              email: authData.email,
              fullName: authData.fullName,
              phoneNumber: '',
              address: data.address,
              city: data.city,
              country: data.country,
              status: 'ACTIVE',
              userType: 'CUSTOMER',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            }

            localStorage.setItem('token', authData.accessToken)
            localStorage.setItem('user', JSON.stringify(user))

            set({
              token: authData.accessToken,
              user,
              isLoggedIn: true,
            })
          } catch (error) {
            console.error('Register failed:', error)
            throw error
          }
        },

        logout: () => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          set({
            user: null,
            token: null,
            isLoggedIn: false,
          })
        },

        setUser: (user: User) => {
          set({ user })
          localStorage.setItem('user', JSON.stringify(user))
        },

        setToken: (token: string) => {
          set({ token })
          localStorage.setItem('token', token)
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isLoggedIn: state.isLoggedIn,
        }),
      }
    )
  )
)

export default useAuthStore
