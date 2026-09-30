import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from '@/store/useAuthStore'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Hotels from '@/pages/Hotels'
import HotelDetail from '@/pages/HotelDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Booking from '@/pages/Booking'
import MyBookings from '@/pages/MyBookings'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'

function App() {
  const { isLoggedIn } = useAuthStore()

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/hotels" element={<Layout><Hotels /></Layout>} />
        <Route path="/hotels/:hotelId" element={<Layout><HotelDetail /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        {isLoggedIn ? (
          <>
            <Route path="/booking/:roomId" element={<Layout><Booking /></Layout>} />
            <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
          </>
        ) : (
          <>
            <Route path="/booking/:roomId" element={<Navigate to="/login" />} />
            <Route path="/my-bookings" element={<Navigate to="/login" />} />
            <Route path="/profile" element={<Navigate to="/login" />} />
          </>
        )}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
