import Bottombar from '@/components/shared/bottombar'
import Leftsidebar from '@/components/shared/leftsidebar'
import Topbar from '@/components/shared/topbar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="w-full md:flex"> 
      <Topbar />
      <Leftsidebar />
      <section className="flex flex-1 h-full">
       <Outlet />
      </section>
      <Bottombar />
      </div>
  )
}

export default RootLayout