import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa'
import useAuthStore from '@/store/useAuthStore'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-max">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
              <FaHome className="text-2xl" />
              <span>KhachSan</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
                Trang Chủ
              </Link>
              <Link to="/hotels" className="text-gray-700 hover:text-primary-600 transition">
                Khách Sạn
              </Link>

              {isLoggedIn ? (
                <>
                  <Link to="/my-bookings" className="text-gray-700 hover:text-primary-600 transition">
                    Đặt Phòng Của Tôi
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition">
                      <FaUser />
                      <span>{user?.fullName || 'Tài Khoản'}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                      >
                        Hồ Sơ
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg flex items-center gap-2"
                      >
                        <FaSignOutAlt /> Đăng Xuất
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-outline"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Đăng Ký
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang Chủ
              </Link>
              <Link
                to="/hotels"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Khách Sạn
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/my-bookings"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đặt Phòng Của Tôi
                  </Link>
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hồ Sơ
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
                  >
                    Đăng Xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng Ký
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container-max py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">KhachSan</h3>
              <p className="text-gray-300">
                Hệ thống đặt phòng khách sạn trực tuyến hiện đại với kiến trúc Microservices
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Về Chúng Tôi</h4>
              <ul className="text-gray-300 space-y-2">
                <li><a href="#" className="hover:text-white">Về KhachSan</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Tuyển Dụng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ Trợ</h4>
              <ul className="text-gray-300 space-y-2">
                <li><a href="#" className="hover:text-white">Trung Tâm Trợ Giúp</a></li>
                <li><a href="#" className="hover:text-white">Liên Hệ</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Pháp Lý</h4>
              <ul className="text-gray-300 space-y-2">
                <li><a href="#" className="hover:text-white">Điều Khoản Sử Dụng</a></li>
                <li><a href="#" className="hover:text-white">Chính Sách Riêng Tư</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-300">
            <p>&copy; 2024 KhachSan System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
