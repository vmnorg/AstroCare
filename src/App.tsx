import { useStore, type TabId } from './store'
import { 
  Activity, 
  Users, 
  Radio, 
  ShieldAlert, 
  Satellite, 
  Wifi, 
  WifiOff, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  AlertOctagon 
} from 'lucide-react'
import HealthTab from './tabs/HealthTab'
import CrewTab from './tabs/CrewTab'
import DoctorTab from './tabs/DoctorTab'
import EmergencyTab from './tabs/EmergencyTab'

const tabs = [
  { id: 'health' as TabId, label: 'My Health & Body', icon: Activity },
  { id: 'crew' as TabId, label: 'Crew & Mind', icon: Users },
  { id: 'doctor' as TabId, label: 'Earth Doctor', icon: Radio },
  { id: 'emergency' as TabId, label: 'Emergency / SOS', icon: ShieldAlert },
]

function ToastContainer() {
  const { toasts, removeToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-blue-500/50 bg-[#111620]'
        let textTitle = 'text-blue-300'
        let Icon = Info

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/60 bg-[#0E1B15] shadow-lg shadow-emerald-950/30'
          textTitle = 'text-emerald-300'
          Icon = CheckCircle2
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/60 bg-[#1D170E] shadow-lg shadow-amber-950/30'
          textTitle = 'text-amber-300'
          Icon = AlertTriangle
        } else if (toast.type === 'error') {
          borderClass = 'border-red-500/60 bg-[#200F12] shadow-lg shadow-red-950/40'
          textTitle = 'text-red-300'
          Icon = AlertOctagon
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border ${borderClass} transition-all duration-300 animate-in slide-in-from-bottom-5 backdrop-blur-md`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${textTitle}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${textTitle}`}>
                      {toast.title}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {toast.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-white p-1 rounded transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TopBar() {
  const { currentSol, solTime, owltMinutes, ppCO2 } = useStore()
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-[#1F2937] bg-[#0D1117] flex-shrink-0">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <Satellite className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            AstroCare
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-normal bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              FLIGHT-CERTIFIED 0.38G
            </span>
          </h1>
          <p className="text-[11px] text-gray-400 -mt-0.5">Mars Surface Medical Operating System</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131820] border border-[#1F2937]">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-gray-400">Sol {currentSol}</span>
          <span className="text-white font-mono font-bold tabular-nums text-sm">{solTime}</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131820] border border-[#1F2937]">
          <Wifi className="w-4 h-4 text-amber-400" />
          <span className="text-gray-400">Earth OWLT</span>
          <span className="text-amber-400 font-mono font-bold tabular-nums text-sm">{owltMinutes} min</span>
        </div>

        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${ppCO2 > 4.0 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-[#131820] border-[#1F2937]'}`}>
          <span className="text-gray-400">Cabin ppCO₂</span>
          <span className={`font-mono font-bold tabular-nums text-sm ${ppCO2 > 4.0 ? 'text-amber-400 font-black' : 'text-emerald-400'}`}>
            {ppCO2} mmHg
          </span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131820] border border-[#1F2937]">
          <WifiOff className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-300 font-medium">Store & Forward Vault</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80" />
        </div>
      </div>
    </header>
  )
}

function Sidebar() {
  const { activeTab, setActiveTab, emergencyActive } = useStore()
  return (
    <nav className="w-64 flex-shrink-0 border-r border-[#1F2937] bg-[#0D1117] flex flex-col py-6 px-4 gap-2">
      <div className="px-3 pb-3 mb-1 border-b border-[#1F2937]/70">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Operational Subsystems
        </span>
      </div>

      {tabs.map(tab => {
        const active = activeTab === tab.id
        const isEmergency = tab.id === 'emergency'
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left
              ${active
                ? isEmergency
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-md shadow-red-950/40'
                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-950/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
              }
              ${isEmergency && emergencyActive ? 'animate-pulse ring-2 ring-red-500' : ''}
            `}
          >
            <tab.icon className={`w-5 h-5 flex-shrink-0 ${active ? (isEmergency ? 'text-red-400' : 'text-blue-400') : 'text-gray-500'}`} />
            <span className="truncate">{tab.label}</span>
          </button>
        )
      })}

      <div className="mt-auto p-4 rounded-xl bg-[#131820] border border-[#1F2937] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ares Station Alpha</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
        <p className="text-xs text-white font-medium">Mars Surface Hab (Elysium)</p>
        <div className="text-[11px] text-gray-400 pt-1 border-t border-[#1F2937]/60 flex items-center justify-between font-mono">
          <span>4 Crew Active</span>
          <span>0.38g Surface</span>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  const { activeTab } = useStore()
  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans bg-[#0B0E14]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          {activeTab === 'health' && <HealthTab />}
          {activeTab === 'crew' && <CrewTab />}
          {activeTab === 'doctor' && <DoctorTab />}
          {activeTab === 'emergency' && <EmergencyTab />}
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
