import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Overview from '../features/admin/Overview'
import Users from '../features/admin/Users'
import Mechanics from '../features/admin/Mechanics'
import Requests from '../features/admin/Requests'
import Jobs from '../features/admin/Jobs'
import Payments from '../features/admin/Payments'
import Services from '../features/admin/Services'
import Parts from '../features/admin/Parts'
import Coupons from '../features/admin/Coupons'
import Reviews from '../features/admin/Reviews'
import Settings from '../features/admin/Settings'
// Reusing generic notifications component since structure is identical
import Notifications from '../features/customer/Notifications'

import { FaChartPie, FaUsers, FaWrench, FaClipboardList, FaCar, FaCreditCard, FaCogs, FaTools, FaTicketAlt, FaStar, FaBell, FaCog } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const MENU_ITEMS = [
  { key: 'overview', label: 'Overview', icon: FaChartPie },
  { key: 'users', label: 'Users', icon: FaUsers },
  { key: 'mechanics', label: 'Mechanics', icon: FaWrench },
  { key: 'requests', label: 'Requests', icon: FaClipboardList, badge: '5' },
  { key: 'jobs', label: 'Active Jobs', icon: FaCar },
  { key: 'payments', label: 'Payments', icon: FaCreditCard },
  { key: 'services', label: 'Services Config', icon: FaCogs },
  { key: 'parts', label: 'Parts Inventory', icon: FaTools },
  { key: 'coupons', label: 'Coupons', icon: FaTicketAlt },
  { key: 'reviews', label: 'Reviews', icon: FaStar },
  { key: 'notifications', label: 'Alerts', icon: FaBell },
  { key: 'settings', label: 'System Settings', icon: FaCog },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')

  const getHeaderInfo = () => {
    switch (tab) {
      case 'overview': return { title: `System Control Center`, sub: "Global metrics and revenue tracking." }
      case 'users': return { title: 'User Management', sub: 'Monitor and manage registered customers.' }
      case 'mechanics': return { title: 'Mechanic Management', sub: 'Monitor platform mechanics and their performance.' }
      case 'requests': return { title: 'Service Requests', sub: 'Global view of all platform service requests.' }
      case 'jobs': return { title: 'Live Jobs', sub: 'Monitor all active jobs currently in progress.' }
      case 'payments': return { title: 'Financial Ledger', sub: 'Track all platform transactions and payouts.' }
      case 'services': return { title: 'Services Configuration', sub: 'Add, edit, or remove platform service offerings.' }
      case 'parts': return { title: 'Parts Inventory', sub: 'Manage parts catalog and pricing.' }
      case 'coupons': return { title: 'Coupon Engine', sub: 'Create and manage promotional campaigns.' }
      case 'reviews': return { title: 'Platform Reviews', sub: 'Monitor feedback for mechanics and garages.' }
      case 'notifications': return { title: 'System Alerts', sub: 'Monitor platform-wide alerts and logs.' }
      case 'settings': return { title: 'Global Settings', sub: 'Configure garage details and system preferences.' }
      default: return { title: MENU_ITEMS.find(i => i.key === tab)?.label, sub: 'Admin controls.' }
    }
  }

  const renderContent = () => {
    switch (tab) {
      case 'overview': return <Overview setTab={setTab} />
      case 'users': return <Users />
      case 'mechanics': return <Mechanics />
      case 'requests': return <Requests />
      case 'jobs': return <Jobs />
      case 'payments': return <Payments />
      case 'services': return <Services />
      case 'parts': return <Parts />
      case 'coupons': return <Coupons />
      case 'reviews': return <Reviews />
      case 'notifications': return <Notifications />
      case 'settings': return <Settings />
      default: return null
    }
  }

  const headerInfo = getHeaderInfo()

  return (
    <DashboardLayout 
      menuItems={MENU_ITEMS} 
      activeTab={tab} 
      setActiveTab={setTab}
      headerTitle={headerInfo.title}
      headerSub={headerInfo.sub}
      userName={user?.name || 'System Admin'}
      userRole="Administrator"
      userAvatar="A"
    >
      {renderContent()}
    </DashboardLayout>
  )
}
