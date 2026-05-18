import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Overview from '../features/customer/Overview'
import Requests from '../features/customer/Requests'
import AddRequest from '../features/customer/AddRequest'
import Vehicles from '../features/customer/Vehicles'
import Payments from '../features/customer/Payments'
import Reviews from '../features/customer/Reviews'
import Profile from '../features/customer/Profile'
import { FaClipboardList, FaCar, FaCreditCard, FaTicketAlt, FaStar, FaCog } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const MENU_ITEMS = [
  { key: 'overview', label: 'Overview', icon: FaClipboardList },
  { key: 'requests', label: 'My Requests', icon: FaClipboardList },
  { key: 'vehicles', label: 'My Vehicles', icon: FaCar },
  { key: 'payments', label: 'Payments', icon: FaCreditCard },
  { key: 'reviews', label: 'Reviews', icon: FaStar },
  { key: 'settings', label: 'Profile Settings', icon: FaCog },
]

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [editingRequest, setEditingRequest] = useState(null)

  const getHeaderInfo = () => {
    switch (tab) {
      case 'overview': return { title: `Your Overview`, sub: "Here's what's happening with your garage services." }
      case 'requests': return { title: 'My Requests', sub: 'Track and manage your service requests.' }
      case 'add-request': return { title: editingRequest ? 'Edit Service Request' : 'New Service Request', sub: 'Book an expert mechanic for your vehicle.' }
      case 'vehicles': return { title: 'My Vehicles', sub: 'Manage your cars and fleet.' }
      case 'payments': return { title: 'Payments', sub: 'View your payment history and details.' }
      case 'reviews': return { title: 'My Reviews', sub: 'Rate your experience with our services.' }
      case 'settings': return { title: 'Profile Settings', sub: 'Manage your personal information and preferences.' }
      default: return { title: MENU_ITEMS.find(i => i.key === tab)?.label, sub: 'Manage your account details.' }
    }
  }

  const renderContent = () => {
    switch (tab) {
      case 'overview': return <Overview setTab={setTab} />
      case 'requests': return <Requests setTab={setTab} setEditingRequest={setEditingRequest} />
      case 'add-request': return <AddRequest setTab={setTab} editData={editingRequest} clearEdit={() => setEditingRequest(null)} />
      case 'vehicles': return <Vehicles />
      case 'payments': return <Payments />
      case 'reviews': return <Reviews />
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
      userAvatar={user?.name?.charAt(0)}
    >
      {renderContent()}
    </DashboardLayout>
  )
}
