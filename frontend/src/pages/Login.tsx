import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/useAuthStore'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">KhachSan</h1>
          <p className="text-gray-600">Đăng Nhập Tài Khoản</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline mr-2" />
              Mật Khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4"
              disabled={loading}
            />
            <label htmlFor="remember" className="text-sm text-gray-700">
              Ghi nhớ tôi
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Đăng Nhập Với Google
          </button>
          <button
            type="button"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Đăng Nhập Với Facebook
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Đăng Ký Ngay
          </Link>
        </p>

        {/* Forgot Password */}
        <p className="text-center mt-4">
          <a href="#" className="text-primary-600 text-sm hover:underline">
            Quên Mật Khẩu?
          </a>
        </p>
      </div>
    </div>
  )
}
