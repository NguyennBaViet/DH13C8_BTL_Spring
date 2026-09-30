import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe } from 'react-icons/fa'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/useAuthStore'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.phoneNumber || !formData.address || !formData.city || !formData.country) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu không khớp')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email không hợp lệ')
      return
    }

    try {
      setLoading(true)
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        country: formData.country,
      })
      toast.success('Đăng ký thành công!')
      navigate('/')
    } catch (error) {
      console.error('Register error:', error)
      toast.error('Đăng ký thất bại. Vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-600 to-primary-800 py-12">
      <div className="container-max">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary-600 mb-2">KhachSan</h1>
              <p className="text-gray-600">Tạo Tài Khoản Mới</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Họ và Tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Đường ABC"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCity className="inline mr-2" />
                  Thành Phố
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Hồ Chí Minh"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGlobe className="inline mr-2" />
                  Quốc Gia
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Việt Nam"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Ít nhất 8 ký tự</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="inline mr-2" />
                  Xác Nhận Mật Khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4"
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-primary-600 hover:underline">
                    Điều Khoản Sử Dụng
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 font-semibold mt-6 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Đăng Ký'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                Đăng Nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
