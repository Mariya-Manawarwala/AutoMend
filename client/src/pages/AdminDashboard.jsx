import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Overview from '../features/admin/Overview'
import Users from '../features/admin/Users'
import Mechanics from '../features/admin/Mechanics'
import Jobs from '../features/admin/Jobs'
import Payments from '../features/admin/Payments'
import Services from '../features/admin/Services'
import Parts from '../features/admin/Parts'
import Reviews from '../features/admin/Reviews'
import Settings from '../features/admin/Settings'
import { FaChartPie, FaUsers, FaWrench, FaCar, FaCreditCard, FaCogs, FaTools, FaTicketAlt, FaStar, FaCog } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useAdminStats } from '../hooks/useAdminHooks'

const MENU_ITEMS = [
  { key: 'overview', label: 'Overview', icon: FaChartPie },
  { key: 'users', label: 'Users', icon: FaUsers },
  { key: 'mechanics', label: 'Mechanics', icon: FaWrench },
  { key: 'jobs', label: 'Active Jobs', icon: FaCar },
  { key: 'payments', label: 'Payments', icon: FaCreditCard },
  { key: 'services', label: 'Services Config', icon: FaCogs },
  { key: 'parts', label: 'Parts Inventory', icon: FaTools },
  { key: 'reviews', label: 'Reviews', icon: FaStar },
  { key: 'settings', label: 'System Settings', icon: FaCog },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [tabFilter, setTabFilter] = useState(null)
  
  const { data: stats } = useAdminStats()

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setTabFilter(null)
  }

  const handleOverviewNavigate = (newTab, filter) => {
    setTab(newTab)
    setTabFilter(filter)
  }

  const menuItemsWithBadges = MENU_ITEMS.map(item => {
    if (item.key === 'mechanics' && stats?.actionCenter?.pendingMechanics > 0) {
      return { ...item, badge: stats.actionCenter.pendingMechanics }
    }
    return item
  })

  const getHeaderInfo = () => {
    // ... Switch logic remains similar but uses MENU_ITEMS
    switch (tab) {
      case 'overview': return { title: `Your Overview`, sub: "Global metrics and revenue tracking." }
      case 'users': return { title: 'User Management', sub: 'Monitor and manage registered customers.' }
      case 'mechanics': return { title: 'Mechanic Management', sub: 'Monitor platform mechanics and their performance.' }
      case 'jobs': return { title: 'Live Jobs', sub: 'Monitor all active jobs currently in progress.' }
      case 'payments': return { title: 'Financial Ledger', sub: 'Track all platform transactions and payouts.' }
      case 'services': return { title: 'Services Configuration', sub: 'Add, edit, or remove platform service offerings.' }
      case 'parts': return { title: 'Parts Inventory', sub: 'Manage parts catalog and pricing.' }
      case 'reviews': return { title: 'Platform Reviews', sub: 'Monitor feedback for mechanics and garages.' }
      case 'settings': return { title: 'Global Settings', sub: 'Configure garage details and system preferences.' }
      default: return { title: MENU_ITEMS.find(i => i.key === tab)?.label, sub: 'Admin controls.' }
    }
  }

  const renderContent = () => {
    switch (tab) {
      case 'overview': return <Overview setTab={handleOverviewNavigate} />
      case 'users': return <Users />
      case 'mechanics': return <Mechanics initialFilter={tabFilter} />
      case 'jobs': return <Jobs />
      case 'payments': return <Payments />
      case 'services': return <Services />
      case 'parts': return <Parts />
      case 'reviews': return <Reviews />
      case 'settings': return <Settings />
      default: return null
    }
  }

  const headerInfo = getHeaderInfo()

  return (
    <DashboardLayout 
      menuItems={menuItemsWithBadges} 
      activeTab={tab} 
      setActiveTab={handleTabChange}
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
