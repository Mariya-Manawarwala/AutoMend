import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Overview from '../features/mechanic/Overview'
import AvailableRequests from '../features/mechanic/AvailableRequests'
import MyJobs from '../features/mechanic/MyJobs'
import Earnings from '../features/mechanic/Earnings'
import History from '../features/mechanic/History'
import Notifications from '../features/customer/Notifications'
import Profile from '../features/customer/Profile'
import { FaClipboardList, FaWrench, FaMoneyBillWave, FaHistory, FaBell, FaCog, FaExclamationCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const MENU_ITEMS = [
  { key: 'overview', label: 'Overview', icon: FaClipboardList },
  { key: 'requests', label: 'Available Requests', icon: FaExclamationCircle, badge: 'New' },
  { key: 'jobs', label: 'My Jobs', icon: FaWrench },
  { key: 'earnings', label: 'Earnings', icon: FaMoneyBillWave },
  { key: 'history', label: 'History', icon: FaHistory },
  { key: 'notifications', label: 'Notifications', icon: FaBell },
  { key: 'settings', label: 'Profile Settings', icon: FaCog },
]

export default function GarageDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')

  const getHeaderInfo = () => {
    switch (tab) {
      case 'overview': return { title: `Mechanic Console`, sub: "Live job system and performance overview." }
      case 'requests': return { title: 'Available Requests', sub: 'Real-time feed of service requests near you.' }
      case 'jobs': return { title: 'My Jobs', sub: 'Manage your active service jobs and submit bills.' }
      case 'earnings': return { title: 'Earnings', sub: 'Track your revenue and monthly performance.' }
      case 'history': return { title: 'Service History', sub: 'Log of your completed jobs and repairs.' }
      case 'notifications': return { title: 'Notifications', sub: 'System alerts and job assignments.' }
      case 'settings': return { title: 'Profile Settings', sub: 'Manage your skills and preferences.' }
      default: return { title: MENU_ITEMS.find(i => i.key === tab)?.label, sub: 'Manage your workspace.' }
    }
  }

  const renderContent = () => {
    switch (tab) {
      case 'overview': return <Overview setTab={setTab} />
      case 'requests': return <AvailableRequests setTab={setTab} />
      case 'jobs': return <MyJobs />
      case 'earnings': return <Earnings setTab={setTab} />
      case 'history': return <History />
      case 'notifications': return <Notifications />
      case 'settings': return <Profile />
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
      userName={user?.name || 'James Rodriguez'}
      userRole="Senior Mechanic"
      userAvatar="JR"
    >
      {renderContent()}
    </DashboardLayout>
  )
}
