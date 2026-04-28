import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Overview from '../features/customer/Overview'
import Requests from '../features/customer/Requests'
import AddRequest from '../features/customer/AddRequest'
import Vehicles from '../features/customer/Vehicles'
import Payments from '../features/customer/Payments'
import Coupons from '../features/customer/Coupons'
import Reviews from '../features/customer/Reviews'
import Notifications from '../features/customer/Notifications'
import Profile from '../features/customer/Profile'
import { FaClipboardList, FaCar, FaCreditCard, FaTicketAlt, FaStar, FaBell, FaCog } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const MENU_ITEMS = [
  { key: 'overview', label: 'Overview', icon: FaClipboardList },
  { key: 'requests', label: 'My Requests', icon: FaClipboardList },
  { key: 'vehicles', label: 'My Vehicles', icon: FaCar },
  { key: 'payments', label: 'Payments', icon: FaCreditCard },
  { key: 'coupons', label: 'Coupons', icon: FaTicketAlt },
  { key: 'reviews', label: 'Reviews', icon: FaStar },
  { key: 'notifications', label: 'Notifications', icon: FaBell, badge: '2' },
  { key: 'settings', label: 'Profile Settings', icon: FaCog },
]

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')

  const getHeaderInfo = () => {
    switch (tab) {
      case 'overview': return { title: `Welcome back, ${user?.name?.split(' ')[0] || 'Customer'}!`, sub: "Here's what's happening with your garage services." }
      case 'requests': return { title: 'My Requests', sub: 'Track and manage your service requests.' }
      case 'add-request': return { title: 'New Service Request', sub: 'Book an expert mechanic for your vehicle.' }
      case 'vehicles': return { title: 'My Vehicles', sub: 'Manage your cars and fleet.' }
      case 'payments': return { title: 'Payments', sub: 'View your payment history and details.' }
      case 'coupons': return { title: 'My Coupons', sub: 'Apply coupons and save on your services.' }
      case 'reviews': return { title: 'My Reviews', sub: 'Rate your experience with our services.' }
      case 'notifications': return { title: 'Notifications', sub: 'Stay updated with your latest activities.' }
      case 'settings': return { title: 'Profile Settings', sub: 'Manage your personal information and preferences.' }
      default: return { title: MENU_ITEMS.find(i => i.key === tab)?.label, sub: 'Manage your account details.' }
    }
  }

  const renderContent = () => {
    switch (tab) {
      case 'overview': return <Overview setTab={setTab} />
      case 'requests': return <Requests setTab={setTab} />
      case 'add-request': return <AddRequest setTab={setTab} />
      case 'vehicles': return <Vehicles />
      case 'payments': return <Payments />
      case 'coupons': return <Coupons />
      case 'reviews': return <Reviews />
      case 'notifications': return <Notifications />
      case 'settings': return <Profile />
      default: return null
    }
  }

  const headerInfo = getHeaderInfo()

  return (
    <DashboardLayout 
      menuItems={MENU_ITEMS} 
      activeTab={tab === 'add-request' ? 'requests' : tab} 
      setActiveTab={setTab}
      headerTitle={headerInfo.title}
      headerSub={headerInfo.sub}
      userName={user?.name}
      userRole={user?.role}
    >
      {renderContent()}
    </DashboardLayout>
  )
}
