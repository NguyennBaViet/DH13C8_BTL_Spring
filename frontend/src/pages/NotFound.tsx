import { Link } from 'react-router-dom'
import { FaHome, FaArrowLeft } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Trang Không Tìm Thấy</h2>
        <p className="text-xl text-primary-100 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-secondary px-8 py-3 text-lg flex items-center justify-center gap-2"
          >
            <FaHome /> Trang Chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline px-8 py-3 text-lg flex items-center justify-center gap-2 border-white text-white hover:bg-white hover:bg-opacity-10"
          >
            <FaArrowLeft /> Quay Lại
          </button>
        </div>

        <div className="mt-16">
          <div className="text-9xl mb-4">🏨</div>
          <p className="text-primary-100">
            Có thể bạn muốn tìm kiếm một khách sạn?
          </p>
          <Link
            to="/hotels"
            className="text-white underline hover:opacity-80 mt-2 inline-block text-lg"
          >
            Xem Danh Sách Khách Sạn →
          </Link>
        </div>
      </div>
    </div>
  )
}
