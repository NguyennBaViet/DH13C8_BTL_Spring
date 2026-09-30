import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaCalendar, FaUsers, FaStar } from 'react-icons/fa'
import { apiService } from '@/services/api'
import { Hotel } from '@/types'

// Hàm tự động xử lý link ảnh thường hoặc link chia sẻ Google Drive
const getImageUrl = (url?: string) => {
  if (!url) return ''
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
  }
  return url
}

export default function Home() {
  const [searchCity, setSearchCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([])

  useEffect(() => {
    // Lấy 6 khách sạn nổi bật từ Database
    apiService
        .getHotels(0, 6)
        .then((res) => {
          if (res.data && res.data.content) {
            setFeaturedHotels(res.data.content)
          }
        })
        .catch((err) => console.error('Failed to fetch featured hotels:', err))
  }, [])

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
              {featuredHotels.map((hotel) => (
                  <div key={hotel.id} className="card overflow-hidden flex flex-col">
                    <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 h-52 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                      {(hotel as any).imageUrl ? (
                          <img
                              src={getImageUrl((hotel as any).imageUrl)}
                              alt={hotel.hotelName}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                          />
                      ) : (
                          <span>{hotel.hotelName}</span>
                      )}
                      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <FaMapMarkerAlt className="text-red-400" /> {hotel.city}
                  </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{hotel.hotelName}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(Math.round(hotel.starRating || 5))].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {hotel.description}
                        </p>
                      </div>

                      <Link
                          to={`/hotels/${hotel.id}`}
                          className="btn-primary w-full text-center inline-block"
                      >
                        Chi Tiết
                      </Link>
                    </div>
                  </div>
              ))}
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