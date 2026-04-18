import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import ProfileNav from '../components/ProfileNav'

const Layout = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A0B' }}>
      <Sidebar />
      <ProfileNav />
      <main className="flex-1 ml-60">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout