import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaWifi, FaSwimmingPool, FaDumbbell, FaArrowRight } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { apiService } from '@/services/api'
import { Hotel, Room, Review } from '@/types'

export default function HotelDetail() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hotelId) {
      fetchHotelDetails()
    }
  }, [hotelId])

  const fetchHotelDetails = async () => {
    try {
      setLoading(true)
      const [hotelRes, roomsRes, reviewsRes] = await Promise.all([
        apiService.getHotelById(parseInt(hotelId!)),
        apiService.getRooms(parseInt(hotelId!)),
        apiService.getHotelReviews(parseInt(hotelId!)),
      ])

      setHotel(hotelRes.data)
      setRooms(roomsRes.data || [])
      setReviews(reviewsRes.data.content || [])
    } catch (error) {
      console.error('Failed to fetch hotel details:', error)
      toast.error('Không thể tải thông tin khách sạn')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy khách sạn</p>
          <Link to="/hotels" className="btn-primary mt-4 inline-block">
            Quay Lại
          </Link>
        </div>
      </div>
    )
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)
      : hotel.starRating

  return (
    <div className="min-h-screen py-8">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8">
          <Link to="/hotels" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Quay Lại Danh Sách
          </Link>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg h-64 flex items-center justify-center text-white text-6xl font-bold mb-4">
                  {hotel.hotelName.charAt(0)}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{hotel.hotelName}</h1>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(Math.round(hotel.starRating))].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                  <span className="text-gray-600">({averageRating} ⭐)</span>
                </div>

                <p className="text-gray-700 mb-6">{hotel.description}</p>

                <div className="space-y-3 text-gray-700">
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary-600" />
                    {hotel.address}, {hotel.city}, {hotel.country}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaPhone className="text-primary-600" />
                    {hotel.phoneNumber}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-primary-600" />
                    {hotel.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock className="text-primary-600" />
                    Nhận phòng: {hotel.checkInTime} | Trả phòng: {hotel.checkOutTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Tiện Nghi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FaWifi, label: 'WiFi Miễn Phí' },
                  { icon: FaSwimmingPool, label: 'Bể Bơi' },
                  { icon: FaDumbbell, label: 'Phòng Gym' },
                  { icon: FaClock, label: '24/7 Lễ Tân' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="text-primary-600 text-xl" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Các Phòng Khách</h2>
          {rooms.length === 0 ? (
            <p className="text-gray-600">Không có phòng khách trống</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="card p-6">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-40 flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {room.roomNumber}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{room.roomType}</h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Phòng số: {room.roomNumber}</p>
                    <p>Sức chứa: {room.capacity} khách</p>
                    <p>Diện tích: {room.areaSqm}m²</p>
                    <p>Loại giường: {room.bedType}</p>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{room.description}</p>

                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold text-sm mb-2">Tiện Nghi:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {room.pricePerNight.toLocaleString()} ₫
                    </span>
                    <Link
                      to={`/booking/${room.id}`}
                      className="btn-primary flex items-center gap-2"
                    >
                      Đặt <FaArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Đánh Giá Khách Hàng</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">Chưa có đánh giá</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="card p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{review.title}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(review.overallRating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Ngày: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
