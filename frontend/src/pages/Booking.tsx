import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaCalendar, FaUsers, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { apiService } from '@/services/api'
import useAuthStore from '@/store/useAuthStore'
import { Room, Hotel } from '@/types'

export default function Booking() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [room, setRoom] = useState<Room | null>(null)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    guestName: user?.fullName || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phoneNumber || '',
    specialRequests: '',
  })

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails()
    }
  }, [roomId])

  const fetchRoomDetails = async () => {
    try {
      setLoading(true)
      const roomRes = await apiService.getRoomById(parseInt(roomId!))
      setRoom(roomRes.data)
      
      if (roomRes.data.hotelId) {
        const hotelRes = await apiService.getHotelById(roomRes.data.hotelId)
        setHotel(hotelRes.data)
      }
    } catch (error) {
      console.error('Failed to fetch room details:', error)
      toast.error('Không thể tải thông tin phòng')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value,
    }))
  }

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      return nights > 0 ? nights : 0
    }
    return 0
  }

  const nights = calculateNights()
  const totalPrice = room ? room.pricePerNight * nights : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng')
      return
    }

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      toast.error('Ngày trả phòng phải sau ngày nhận phòng')
      return
    }

    if (formData.numberOfGuests < 1 || formData.numberOfGuests > (room?.capacity || 1)) {
      toast.error(`Số khách phải từ 1 đến ${room?.capacity || 1}`)
      return
    }

    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
      toast.error('Vui lòng điền đầy đủ thông tin khách')
      return
    }

    try {
      setSubmitting(true)
      const bookingRes = await apiService.createBooking({
        userId: user!.id,
        roomId: parseInt(roomId!),
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.numberOfGuests,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        specialRequests: formData.specialRequests,
      })

      toast.success('Đặt phòng thành công!')
      
      // Redirect to payment with booking info
      navigate('/my-bookings')
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Đặt phòng thất bại. Vui lòng thử lại')
    } finally {
      setSubmitting(false)
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

  if (!room || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Không tìm thấy phòng</p>
          <Link to="/hotels" className="btn-primary inline-block">
            Quay Lại
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-max">
        <Link to={`/hotels/${hotel.id}`} className="text-primary-600 hover:underline mb-4 inline-flex items-center gap-2">
          <FaArrowLeft /> Quay Lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-6">Đặt Phòng</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Check-in & Check-out */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendar className="inline mr-2" />
                      Ngày Nhận Phòng
                    </label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      className="input-field"
                      disabled={submitting}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendar className="inline mr-2" />
                      Ngày Trả Phòng
                    </label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      className="input-field"
                      disabled={submitting}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUsers className="inline mr-2" />
                    Số Khách
                  </label>
                  <input
                    type="number"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    min="1"
                    max={room.capacity}
                    className="input-field"
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">Tối đa: {room.capacity} khách</p>
                </div>

                {/* Guest Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold mb-4">Thông Tin Khách</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Họ và Tên
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="input-field"
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="guestEmail"
                        value={formData.guestEmail}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="input-field"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="inline mr-2" />
                        Số Điện Thoại
                      </label>
                      <input
                        type="tel"
                        name="guestPhone"
                        value={formData.guestPhone}
                        onChange={handleChange}
                        placeholder="0123456789"
                        className="input-field"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu Cầu Đặc Biệt
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Ví dụ: Yêu cầu tầng cao, gần cửa sổ, ..."
                    rows={4}
                    className="input-field"
                    disabled={submitting}
                  />
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 mt-1"
                    disabled={submitting}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    Tôi đồng ý với Chính Sách Hủy và các Điều Khoản Sử Dụng
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-3 font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Đang xử lý...' : 'Đặt Phòng Ngay'}
                </button>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Tóm Tắt Đặt Phòng</h3>

              {/* Room Info */}
              <div className="mb-6 pb-6 border-b">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-32 flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {room.roomNumber}
                </div>
                <p className="font-semibold text-lg mb-1">{room.roomType}</p>
                <p className="text-sm text-gray-600 mb-2">{hotel.hotelName}</p>
                <p className="text-sm text-gray-600">{room.description}</p>
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-700">Giá mỗi đêm:</span>
                  <span className="font-semibold">{room.pricePerNight.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Số đêm:</span>
                  <span className="font-semibold">{nights}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-600">
                  <span>Tổng cộng:</span>
                  <span>{totalPrice.toLocaleString()} ₫</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Sức chứa:</span>
                  <span className="font-semibold">{room.capacity} khách</span>
                </div>
                <div className="flex justify-between">
                  <span>Diện tích:</span>
                  <span className="font-semibold">{room.areaSqm}m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Loại giường:</span>
                  <span className="font-semibold">{room.bedType}</span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-xs text-yellow-800">
                ⓘ Giá này chưa bao gồm thuế và phí dịch vụ. Bạn sẽ thanh toán khi hoàn tất đặt phòng.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
