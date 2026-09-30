import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaWifi, FaSwimmingPool, FaDumbbell } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { apiService } from '@/services/api'
import { Hotel } from '@/types'

// Danh sách các danh mục thành phố phổ biến (như danh mục sản phẩm bài cũ)
const CITY_CATEGORIES = [
  { label: 'Tất Cả Điểm Đến', value: '' },
  { label: 'Hà Nội', value: 'Hà Nội' },
  { label: 'Đà Nẵng', value: 'Đà Nẵng' },
  { label: 'TP. Hồ Chí Minh', value: 'Hồ Chí Minh' },
  { label: 'Đà Lạt', value: 'Đà Lạt' },
  { label: 'Nha Trang', value: 'Nha Trang' },
  { label: 'Phú Quốc', value: 'Phú Quốc' },
]

export default function Hotels() {
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minRating, setMinRating] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchHotels()
  }, [page, city, minRating])

  // Hàm tự động chuyển đổi link Google Drive sang link xem trực tiếp CDN
  const getImageUrl = (url?: string) => {
    if (!url) return ''
    if (url.includes('drive.google.com')) {
      const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
      if (idMatch && idMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${idMatch[1]}`
      }
    }
    return url
  }

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await apiService.getHotels(
          page,
          10,
          city || undefined,
          minRating || undefined
      )
      setHotels(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch hotels:', error)
      toast.error('Không thể tải danh sách khách sạn')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = () => {
    setPage(0)
  }

  const handleCategoryClick = (selectedCity: string) => {
    setCity(selectedCity)
    setPage(0)
  }

  const renderAmenities = () => {
    const amenities = [
      { icon: FaWifi, label: 'WiFi' },
      { icon: FaSwimmingPool, label: 'Bể Bơi' },
      { icon: FaDumbbell, label: 'Phòng Gym' },
    ]
    return amenities.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1 text-sm text-gray-600">
        <Icon className="text-primary-600" />
          {label}
      </span>
    ))
  }

  return (
      <div className="min-h-screen py-8">
        <div className="container-max">
          {/* Filters & Categories */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Danh Mục Điểm Đến</h2>

            {/* Thanh nút bấm Danh Mục (Categories) */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100">
              {CITY_CATEGORIES.map((item) => {
                const isActive = city.toLowerCase() === item.value.toLowerCase()
                return (
                    <button
                        key={item.label}
                        onClick={() => handleCategoryClick(item.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isActive
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {item.label}
                    </button>
                )
              })}
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-3">Bộ Lọc Chi Tiết</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành Phố
                </label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value)
                      handleFilterChange()
                    }}
                    placeholder="Nhập thành phố khác..."
                    className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Tối Thiểu
                </label>
                <select
                    value={minRating}
                    onChange={(e) => {
                      setMinRating(parseInt(e.target.value))
                      handleFilterChange()
                    }}
                    className="input-field"
                >
                  <option value={0}>Tất Cả Hạng Sao</option>
                  <option value={1}>1 Sao trở lên</option>
                  <option value={2}>2 Sao trở lên</option>
                  <option value={3}>3 Sao trở lên</option>
                  <option value={4}>4 Sao trở lên</option>
                  <option value={5}>5 Sao</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                    onClick={fetchHotels}
                    className="btn-primary w-full"
                >
                  Tìm Kiếm
                </button>
                {(city !== '' || minRating !== 0) && (
                    <button
                        onClick={() => {
                          setCity('')
                          setMinRating(0)
                          setPage(0)
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                    >
                      Xóa lọc
                    </button>
                )}
              </div>
            </div>
          </div>

          {/* Hotels List */}
          {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="text-4xl">🔄</div>
                </div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
          ) : hotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Không tìm thấy khách sạn phù hợp</p>
              </div>
          ) : (
              <>
                <div className="space-y-6">
                  {hotels.map((hotel) => {
                    // Hỗ trợ cả kiểu đặt tên camelCase (imageUrl) lẫn snake_case (image_url) từ Backend
                    const rawImgUrl = (hotel as any).imageUrl || (hotel as any).image_url
                    const displayImgUrl = getImageUrl(rawImgUrl)
                    const hasValidImage = displayImgUrl && !imageErrors[hotel.id]

                    return (
                        <div key={hotel.id} className="card p-6 flex flex-col md:flex-row gap-6">
                          {/* Hiển thị Ảnh Google Drive hoặc Khung chữ cái đầu nếu lỗi */}
                          <div className="md:w-1/4 rounded-lg h-48 md:h-auto overflow-hidden flex-shrink-0">
                            {hasValidImage ? (
                                <img
                                    src={displayImgUrl}
                                    alt={hotel.hotelName}
                                    className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                                    onError={() =>
                                        setImageErrors((prev) => ({ ...prev, [hotel.id]: true }))
                                    }
                                />
                            ) : (
                                <div className="w-full h-full min-h-[12rem] bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold rounded-lg">
                                  {hotel.hotelName.charAt(0)}
                                </div>
                            )}
                          </div>

                          {/* Hotel Info */}
                          <div className="md:w-3/4 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900">
                                    {hotel.hotelName}
                                  </h3>
                                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                                    <FaMapMarkerAlt className="text-primary-600" />
                                    {hotel.address}, {hotel.city}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 mb-2 justify-end">
                                    {[...Array(hotel.starRating)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                              {hotel.availableRooms}/{hotel.totalRooms} phòng trống
                            </span>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-3">{hotel.description}</p>

                              <div className="flex flex-wrap gap-3 mb-4">
                                {renderAmenities()}
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <FaPhone /> {hotel.phoneNumber}
                          </span>
                                <span className="flex items-center gap-2">
                            <FaEnvelope /> {hotel.email}
                          </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                              <div>
                                <p className="text-sm text-gray-600">Check-in: {hotel.checkInTime}</p>
                                <p className="text-sm text-gray-600">Check-out: {hotel.checkOutTime}</p>
                              </div>
                              <Link
                                  to={`/hotels/${hotel.id}`}
                                  className="btn-primary"
                              >
                                Xem Chi Tiết
                              </Link>
                            </div>
                          </div>
                        </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <button
                          onClick={() => setPage(Math.max(0, page - 1))}
                          disabled={page === 0}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        Trước
                      </button>
                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`px-3 py-2 rounded ${
                                    page === i
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                              {i + 1}
                            </button>
                        ))}
                      </div>
                      <button
                          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                          disabled={page === totalPages - 1}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  )
}