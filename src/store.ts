import { create } from 'zustand'

export type TabId = 'health' | 'crew' | 'doctor' | 'emergency'

export interface CrewMember {
  id: string
  name: string
  role: string
  avatar: string
  hr: number
  spo2: number
  bp: string
  temp: number
  sleepHours: number
  mood: 'great' | 'okay' | 'struggling' | null
  exerciseHours: number
  boneDensityLoss: number
  circadianDrift: number
}

export interface OutboxMessage {
  id: string
  type: 'report' | 'query'
  subject: string
  body: string
  attachments: string[]
  sentAt: number
  status: 'queued' | 'transmitting' | 'delivered' | 'reply-received'
  isRecent?: boolean
  replyAt?: number
  replyBody?: string
  replyWarning?: string
}

export interface ToastNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
}

export interface AppState {
  activeTab: TabId
  setActiveTab: (tab: TabId) => void

  currentSol: number
  solTime: string
  earthTime: string
  owltMinutes: number
  rttMinutes: number

  ppCO2: number
  cabinTemp: number
  cabinPressure: number
  humidity: number

  crew: CrewMember[]
  updateCrewMood: (crewId: string, mood: 'great' | 'okay' | 'struggling') => void
  logExercise: (crewId: string, hours: number) => void

  teamCohesion: number

  outbox: OutboxMessage[]
  addToOutbox: (msg: Omit<OutboxMessage, 'id' | 'sentAt' | 'status'>) => void

  emergencyActive: boolean
  activateEmergency: () => void
  deactivateEmergency: () => void

  bodyRegion: string | null
  setBodyRegion: (region: string | null) => void

  // Notification Toast System
  toasts: ToastNotification[]
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
}

const CREW_DATA: CrewMember[] = [
  {
    id: 'CDR', name: 'Commander Reyes', role: 'Commander', avatar: '👩‍🚀',
    hr: 72, spo2: 97, bp: '118/76', temp: 36.7, sleepHours: 6.8,
    mood: 'great', exerciseHours: 1.5, boneDensityLoss: 0.8, circadianDrift: 12
  },
  {
    id: 'PLT', name: 'Dr. Okafor', role: 'Flight Surgeon', avatar: '👨‍⚕️',
    hr: 68, spo2: 98, bp: '122/78', temp: 36.6, sleepHours: 7.2,
    mood: 'okay', exerciseHours: 2.1, boneDensityLoss: 0.6, circadianDrift: 18
  },
  {
    id: 'MS1', name: 'Engineer Tanaka', role: 'Systems Engineer', avatar: '👨‍🔧',
    hr: 78, spo2: 96, bp: '130/85', temp: 36.8, sleepHours: 5.9,
    mood: 'okay', exerciseHours: 0.8, boneDensityLoss: 1.2, circadianDrift: 25
  },
  {
    id: 'MS2', name: 'Scientist Johansson', role: 'Research Scientist', avatar: '👩‍🔬',
    hr: 65, spo2: 99, bp: '110/70', temp: 36.5, sleepHours: 7.5,
    mood: 'great', exerciseHours: 2.4, boneDensityLoss: 0.4, circadianDrift: 8
  },
]

export const useStore = create<AppState>((set) => ({
  activeTab: 'health',
  setActiveTab: (tab) => set({ activeTab: tab }),

  currentSol: 412,
  solTime: '14:32:08',
  earthTime: '2031-03-15T09:12:00Z',
  owltMinutes: 20,
  rttMinutes: 40,

  ppCO2: 4.2,
  cabinTemp: 22.1,
  cabinPressure: 101.3,
  humidity: 45,

  crew: CREW_DATA,
  updateCrewMood: (crewId, mood) => set((state) => ({
    crew: state.crew.map(c => c.id === crewId ? { ...c, mood } : c)
  })),
  logExercise: (crewId, hours) => set((state) => ({
    crew: state.crew.map(c => c.id === crewId ? { ...c, exerciseHours: Math.min(c.exerciseHours + hours, 2.5) } : c)
  })),

  teamCohesion: 82,

  outbox: [
    {
      id: 'msg-001',
      type: 'report',
      subject: 'Crew Member Tanaka — Flank Pain Report',
      body: 'Tanaka reporting intermittent right flank pain (5/10) for 48 hours. No fever. Ultrasound attached.',
      attachments: ['ultrasound_tanaka_sol410.dcm'],
      sentAt: Date.now() - 42 * 60 * 1000,
      status: 'reply-received',
      isRecent: false,
      replyAt: Date.now() - 2 * 60 * 1000,
      replyBody: 'Likely renal calculi. Administer 800mg Ibuprofen q8h with 500mL fluid bolus. If pain persists >72h or fever develops, prepare for ureteral stent procedure using Kit #4.',
      replyWarning: '⚠️ Alert: 42 minutes have passed since this report was sent. If pain level has increased above 7/10, do NOT follow these instructions — send an updated report immediately.'
    },
  ],
  addToOutbox: (msg) => set((state) => ({
    outbox: [
      {
        ...msg,
        id: `msg-${Date.now()}`,
        sentAt: Date.now(),
        status: 'queued',
        isRecent: true,
      },
      ...state.outbox.map(o => ({ ...o, isRecent: false })),
    ]
  })),

  emergencyActive: false,
  activateEmergency: () => set({ emergencyActive: true }),
  deactivateEmergency: () => set({ emergencyActive: false }),

  bodyRegion: null,
  setBodyRegion: (region) => set({ bodyRegion: region }),

  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const now = new Date()
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, timestamp }]
    }))

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, 5000)
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
}))

// Chart data generators
export const heartRateData = [
  { day: 'Sol 406', value: 71, min: 60, max: 85 },
  { day: 'Sol 407', value: 68, min: 60, max: 85 },
  { day: 'Sol 408', value: 74, min: 60, max: 85 },
  { day: 'Sol 409', value: 72, min: 60, max: 85 },
  { day: 'Sol 410', value: 76, min: 60, max: 85 },
  { day: 'Sol 411', value: 70, min: 60, max: 85 },
  { day: 'Sol 412', value: 72, min: 60, max: 85 },
]

export const sleepData = [
  { day: 'Sol 406', value: 7.1, min: 7, max: 9 },
  { day: 'Sol 407', value: 6.8, min: 7, max: 9 },
  { day: 'Sol 408', value: 7.5, min: 7, max: 9 },
  { day: 'Sol 409', value: 6.2, min: 7, max: 9 },
  { day: 'Sol 410', value: 5.9, min: 7, max: 9 },
  { day: 'Sol 411', value: 6.5, min: 7, max: 9 },
  { day: 'Sol 412', value: 6.8, min: 7, max: 9 },
]
