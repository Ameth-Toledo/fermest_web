import { useState } from 'react'
import SupportSidebar from '../components/SupportSidebar'
import TicketsPanel from '../components/TicketsPanel'
import ClientsPanel from '../components/ClientsPanel'
import CodesPanel from '../components/CodesPanel'

type SupportSection = 'tickets' | 'clients' | 'codes'

const SupportView = () => {
  const [section, setSection] = useState<SupportSection>('tickets')

  return (
    <div className="flex h-screen bg-[#0A0A0B] overflow-hidden">
      <SupportSidebar active={section} onChange={setSection} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {section === 'tickets' && <TicketsPanel />}
        {section === 'clients' && <ClientsPanel />}
        {section === 'codes'   && <CodesPanel />}
      </main>
    </div>
  )
}

export default SupportView
