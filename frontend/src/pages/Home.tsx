import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaCalendar, FaUsers, FaStar } from 'react-icons/fa'

export default function Home() {
  const [searchCity, setSearchCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to hotels page with search params
    const params = new URLSearchParams()
    if (searchCity) params.append('city', searchCity)
    window.location.href = `/hotels?${params.toString()}`
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-max">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Tìm Khách Sạn Lý Tưởng</h1>
            <p className="text-xl text-primary-100">
              Khám phá hàng ngàn khách sạn tuyệt vời trên toàn quốc
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Thành Phố
              </label>
              <input
                type="text"
                placeholder="Nhập thành phố"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2" />
                Ngày Nhận Phòng
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2" />
                Ngày Trả Phòng
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline mr-2" />
                Số Khách
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                className="input-field"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FaSearch /> Tìm Kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16">
        <div className="container-max">
          <h2 className="text-3xl font-bold mb-4">Khách Sạn Nổi Bật</h2>
          <p className="text-gray-600 mb-8">Những lựa chọn hàng đầu từ khách hàng của chúng tôi</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Hotel Card 1 */}
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-48 flex items-center justify-center text-white text-xl font-bold">
                Luxury Hotel
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Luxury Hotel</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Khách sạn 5 sao tuyệt vời tại trung tâm thành phố
                </p>
                <Link to="/hotels" className="btn-primary w-full text-center">
                  Chi Tiết
                </Link>
              </div>
            </div>

            {/* Featured Hotel Card 2 */}
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-accent-400 to-accent-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                Premium Hotel
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Premium Hotel</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(4)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Khách sạn 4 sao với dịch vụ chuyên nghiệp
                </p>
                <Link to="/hotels" className="btn-primary w-full text-center">
                  Chi Tiết
                </Link>
              </div>
            </div>

            {/* Featured Hotel Card 3 */}
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48 flex items-center justify-center text-white text-xl font-bold">
                Boutique Hotel
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Boutique Hotel</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(4)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Khách sạn boutique độc đáo với thiết kế hiện đại
                </p>
                <Link to="/hotels" className="btn-primary w-full text-center">
                  Chi Tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-16">
        <div className="container-max">
          <h2 className="text-3xl font-bold mb-12 text-center">Tại Sao Chọn KhachSan?</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary-600 mb-4">100K+</div>
              <h3 className="text-lg font-bold mb-2">Khách Sạn</h3>
              <p className="text-gray-600">Hàng trăm ngàn lựa chọn trên toàn quốc</p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary-600 mb-4">1M+</div>
              <h3 className="text-lg font-bold mb-2">Khách Hàng</h3>
              <p className="text-gray-600">Triệu khách hàng tin tưởng dịch vụ của chúng tôi</p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary-600 mb-4">24/7</div>
              <h3 className="text-lg font-bold mb-2">Hỗ Trợ</h3>
              <p className="text-gray-600">Đội ngũ hỗ trợ khách hàng luôn sẵn sàng</p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary-600 mb-4">✓</div>
              <h3 className="text-lg font-bold mb-2">Giá Tốt</h3>
              <p className="text-gray-600">Đảm bảo giá rẻ nhất trên thị trường</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Đặt Phòng?</h2>
          <p className="text-lg mb-8 text-primary-100">
            Bắt đầu hành trình của bạn ngay hôm nay và khám phá những khách sạn tuyệt vời
          </p>
          <Link to="/hotels" className="btn-secondary inline-block">
            Xem Tất Cả Khách Sạn
          </Link>
        </div>
      </section>
    </div>
  )
}
