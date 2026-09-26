import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaWifi, FaSwimmingPool, FaDumbbell } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { apiService } from '@/services/api'
import { Hotel } from '@/types'

export default function Hotels() {
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minRating, setMinRating] = useState(0)

  useEffect(() => {
    fetchHotels()
  }, [page, city, minRating])

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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Bộ Lọc</h2>
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
                placeholder="Nhập thành phố"
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
                <option value={0}>Tất Cả</option>
                <option value={1}>1 Sao</option>
                <option value={2}>2 Sao</option>
                <option value={3}>3 Sao</option>
                <option value={4}>4 Sao</option>
                <option value={5}>5 Sao</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchHotels}
                className="btn-primary w-full"
              >
                Tìm Kiếm
              </button>
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
              {hotels.map((hotel) => (
                <div key={hotel.id} className="card p-6 flex flex-col md:flex-row gap-6">
                  {/* Image Placeholder */}
                  <div className="md:w-1/4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg h-48 md:h-auto flex items-center justify-center text-white text-4xl font-bold">
                    {hotel.hotelName.charAt(0)}
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
                          <div className="flex items-center gap-1 mb-2">
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
              ))}
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
