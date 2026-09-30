import { useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaLock, FaCamera } from 'react-icons/fa'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/useAuthStore'
import { apiService } from '@/services/api'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const response = await apiService.updateUser(user!.id, profileData)
      const updatedUser = {
        ...user!,
        ...profileData,
      }
      setUser(updatedUser)
      toast.success('Cập nhật hồ sơ thành công!')
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Cập nhật hồ sơ thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    try {
      setLoading(true)
      await apiService.changePassword(
        user!.id,
        passwordData.oldPassword,
        passwordData.newPassword
      )
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Đổi mật khẩu thành công!')
    } catch (error) {
      console.error('Change password error:', error)
      toast.error('Đổi mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-max">
        <h1 className="text-3xl font-bold mb-8">Hồ Sơ Của Tôi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user?.fullName.charAt(0).toUpperCase()}
                </div>
                <button className="btn-secondary text-sm w-full flex items-center justify-center gap-2">
                  <FaCamera /> Đổi Ảnh
                </button>
              </div>

              {/* User Info */}
              <div className="border-t pt-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Trạng Thái</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    ● Hoạt Động
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Ngày Đăng Ký</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(user?.createdAt || '').toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 px-6 font-semibold border-b-2 transition ${
                    activeTab === 'profile'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaUser className="inline mr-2" /> Thông Tin Cá Nhân
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-4 px-6 font-semibold border-b-2 transition ${
                    activeTab === 'security'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaLock className="inline mr-2" /> Bảo Mật
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="inline mr-2" />
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="input-field bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Không thể thay đổi email</p>
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
                        value={profileData.phoneNumber}
                        onChange={handleProfileChange}
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
                        value={profileData.address}
                        onChange={handleProfileChange}
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
                        value={profileData.city}
                        onChange={handleProfileChange}
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
                        value={profileData.country}
                        onChange={handleProfileChange}
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 disabled:opacity-50"
                    >
                      {loading ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}
                    </button>
                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-6">
                      ⓘ Hãy chọn một mật khẩu mạnh gồm ít nhất 8 ký tự
                    </div>

                    {/* Old Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật Khẩu Hiện Tại
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật Khẩu Mới
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác Nhận Mật Khẩu Mới
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 disabled:opacity-50"
                    >
                      {loading ? 'Đang cập nhật...' : 'Đổi Mật Khẩu'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
