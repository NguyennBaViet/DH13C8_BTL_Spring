import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCalendar, FaMapMarkerAlt, FaDollarSign, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/useAuthStore'

interface MockBooking {
  id: number
  bookingNumber: string
  hotelName: string
  roomType: string
  city: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  totalPrice: number
  bookingStatus: string
  paymentStatus: string
}

export default function MyBookings() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<MockBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

  useEffect(() => {
    // Simulate fetching bookings
    setTimeout(() => {
      const mockBookings: MockBooking[] = [
        {
          id: 1,
          bookingNumber: 'BK2024011500001',
          hotelName: 'Luxury Hotel',
          roomType: 'DOUBLE',
          city: 'Ho Chi Minh',
          checkInDate: '2024-02-01',
          checkOutDate: '2024-02-03',
          numberOfGuests: 2,
          totalPrice: 1600000,
          bookingStatus: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
        {
          id: 2,
          bookingNumber: 'BK2024011500002',
          hotelName: 'Premium Hotel',
          roomType: 'SINGLE',
          city: 'Da Nang',
          checkInDate: '2024-02-10',
          checkOutDate: '2024-02-12',
          numberOfGuests: 1,
          totalPrice: 800000,
          bookingStatus: 'PENDING',
          paymentStatus: 'PENDING',
        },
        {
          id: 3,
          bookingNumber: 'BK2024011500003',
          hotelName: 'Boutique Hotel',
          roomType: 'SUITE',
          city: 'Hanoi',
          checkInDate: '2024-01-15',
          checkOutDate: '2024-01-17',
          numberOfGuests: 2,
          totalPrice: 2000000,
          bookingStatus: 'CANCELLED',
          paymentStatus: 'REFUNDED',
        },
      ]
      setBookings(mockBookings)
      setLoading(false)
    }, 500)
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true
    return booking.bookingStatus.toLowerCase() === filter.toLowerCase()
  })

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FaClock /> },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', icon: <FaCheckCircle /> },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: <FaTimesCircle /> },
      CHECKED_IN: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <FaCheckCircle /> },
      CHECKED_OUT: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <FaCheckCircle /> },
    }
    const config = statusMap[status] || statusMap['PENDING']
    const statusText: Record<string, string> = {
      PENDING: 'Chờ Xác Nhận',
      CONFIRMED: 'Đã Xác Nhận',
      CANCELLED: 'Đã Hủy',
      CHECKED_IN: 'Đã Nhận Phòng',
      CHECKED_OUT: 'Đã Trả Phòng',
    }

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.icon}
        {statusText[status]}
      </span>
    )
  }

  const handleCancel = (bookingId: number) => {
    if (window.confirm('Bạn có chắc muốn hủy đặt phòng này?')) {
      toast.success('Đặt phòng đã được hủy')
      setBookings(bookings.map(b => 
        b.id === bookingId 
          ? { ...b, bookingStatus: 'CANCELLED', paymentStatus: 'REFUNDED' }
          : b
      ))
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-max">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Đặt Phòng Của Tôi</h1>
          <p className="text-gray-600">Quản lý và theo dõi các đặt phòng của bạn</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' && 'Tất Cả'}
              {status === 'pending' && 'Chờ Xác Nhận'}
              {status === 'confirmed' && 'Đã Xác Nhận'}
              {status === 'cancelled' && 'Đã Hủy'}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔄</div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg mb-4">Chưa có đặt phòng nào</p>
            <Link to="/hotels" className="btn-primary inline-block">
              Tìm Khách Sạn Ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.hotelName}
                        </h3>
                        <p className="text-sm text-gray-500">#{booking.bookingNumber}</p>
                      </div>
                      <div>
                        {getStatusBadge(booking.bookingStatus)}
                      </div>
                    </div>

                    <p className="text-gray-700 font-semibold mb-3">
                      {booking.roomType} - {booking.numberOfGuests} khách
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary-600" />
                        {booking.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-primary-600" />
                        {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-primary-600" />
                        {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-primary-600" />
                        {booking.totalPrice.toLocaleString()} ₫
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="w-full md:w-auto flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded text-xs font-semibold text-center ${
                      booking.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : booking.paymentStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.paymentStatus === 'PAID' && '✓ Đã Thanh Toán'}
                      {booking.paymentStatus === 'PENDING' && '⏱ Chờ Thanh Toán'}
                      {booking.paymentStatus === 'REFUNDED' && 'Đã Hoàn Tiền'}
                    </span>

                    <div className="flex gap-2">
                      {booking.bookingStatus === 'PENDING' && booking.paymentStatus === 'PENDING' && (
                        <>
                          <button className="flex-1 btn-primary text-sm py-2">
                            Thanh Toán
                          </button>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="flex-1 btn-secondary text-sm py-2"
                          >
                            Hủy
                          </button>
                        </>
                      )}
                      {booking.bookingStatus === 'CONFIRMED' && (
                        <button className="flex-1 btn-outline text-sm py-2">
                          Chi Tiết
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
