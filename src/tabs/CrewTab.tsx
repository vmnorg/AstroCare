import { useState } from 'react'
import { useStore } from '../store'
import { 
  Users, 
  Smile, 
  Meh, 
  Frown, 
  Clock, 
  Utensils, 
  Sparkles,
  CalendarCheck2
} from 'lucide-react'

// Martian 4-hour circadian shift segments for instant high-visibility readability
interface ShiftBlock {
  timeRange: string
  label: string
}

const SHIFT_BLOCKS: ShiftBlock[] = [
  { timeRange: '00:00 - 04:00', label: 'Night Watch / Deep Rest' },
  { timeRange: '04:00 - 08:00', label: 'Early Shift / Wake Prep' },
  { timeRange: '08:00 - 12:00', label: 'Habitat Ops & Research' },
  { timeRange: '12:00 - 16:00', label: 'EVA & Heavy ARED Load' },
  { timeRange: '16:00 - 20:00', label: 'Shared Sync & Dinner' },
  { timeRange: '20:00 - 24:00', label: 'Maintenance & Sleep Prep' },
]

export default function CrewTab() {
  const { crew, updateCrewMood, teamCohesion, addToast } = useStore()
  const [selectedCrewId, setSelectedCrewId] = useState<string>('CDR')

  const selectedCrew = crew.find(c => c.id === selectedCrewId) || crew[0]

  // Large simplified activity matrix for each crew member across the 6 major shifts
  const getCrewShiftStatus = (memberId: string, shiftIndex: number) => {
    // 0: 00-04, 1: 04-08, 2: 08-12, 3: 12-16, 4: 16-20 (Shared), 5: 20-24
    switch (memberId) {
      case 'CDR':
        if (shiftIndex === 0) return { type: 'sleep', label: 'Sleep Phase (6.8h)', color: 'bg-blue-950/80 border-blue-800 text-blue-300' }
        if (shiftIndex === 1) return { type: 'wake', label: 'Morning Brief', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }
        if (shiftIndex === 2) return { type: 'work', label: 'Command Deck', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }
        if (shiftIndex === 3) return { type: 'exercise', label: 'ARED Load (1.5h)', color: 'bg-amber-600/30 border-amber-500/60 text-amber-300' }
        if (shiftIndex === 4) return { type: 'shared', label: 'Shared Habitat Dinner', color: 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold' }
        return { type: 'sleep-prep', label: 'Light Prep & Rest', color: 'bg-[#18202C] border-gray-700 text-gray-300' }

      case 'PLT':
        if (shiftIndex === 0 || shiftIndex === 1) return { type: 'sleep', label: 'Sleep Phase (7.2h)', color: 'bg-blue-950/80 border-blue-800 text-blue-300' }
        if (shiftIndex === 2) return { type: 'work', label: 'Lab Diagnostics', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }
        if (shiftIndex === 3) return { type: 'exercise', label: 'ARED Session', color: 'bg-amber-600/30 border-amber-500/60 text-amber-300' }
        if (shiftIndex === 4) return { type: 'shared', label: 'Shared Habitat Dinner', color: 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold' }
        return { type: 'work', label: 'Surgeon Telemetry Log', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }

      case 'MS1':
        if (shiftIndex === 0 || shiftIndex === 1) return { type: 'sleep', label: 'Sleep Phase (5.9h)', color: 'bg-blue-950/80 border-blue-800 text-blue-300' }
        if (shiftIndex === 2) return { type: 'exercise', label: 'ARED Session', color: 'bg-amber-600/30 border-amber-500/60 text-amber-300' }
        if (shiftIndex === 3) return { type: 'work', label: 'Rover Maintenance', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }
        if (shiftIndex === 4) return { type: 'shared', label: 'Shared Habitat Dinner', color: 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold' }
        return { type: 'work', label: 'Life Support Scrubber Duty', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }

      case 'MS2':
        if (shiftIndex === 0) return { type: 'sleep', label: 'Sleep Phase (7.5h)', color: 'bg-blue-950/80 border-blue-800 text-blue-300' }
        if (shiftIndex === 1) return { type: 'work', label: 'Surface Soil Analysis', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }
        if (shiftIndex === 2) return { type: 'exercise', label: 'ARED Session', color: 'bg-amber-600/30 border-amber-500/60 text-amber-300' }
        if (shiftIndex === 3) return { type: 'work', label: 'Botanical Growth Chamber', color: 'bg-[#1E293B] border-gray-700 text-gray-200' }
        if (shiftIndex === 4) return { type: 'shared', label: 'Shared Habitat Dinner', color: 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold' }
        return { type: 'sleep', label: 'Early Rest Prep', color: 'bg-blue-950/80 border-blue-800 text-blue-300' }

      default:
        return { type: 'work', label: 'Station Routine', color: 'bg-[#18202C] border-gray-700 text-gray-200' }
    }
  }

  const handleScheduleDinner = () => {
    addToast({
      title: 'Galley Schedule Dispatched',
      message: 'Habitat Galley automated dinner notification dispatched for 18:00 Sol Time. All 4 crew comm terminals updated.',
      type: 'success'
    })
  }

  const handleSelectMood = (mood: 'great' | 'okay' | 'struggling') => {
    updateCrewMood(selectedCrew.id, mood)
    addToast({
      title: 'Psychological Telemetry Recorded',
      message: `${selectedCrew.name} logged mental health status as "${mood.toUpperCase()}". Morale matrix updated.`,
      type: 'info'
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Behavioral Dynamics & Group Psychology</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">Crew & Mind Stability</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed mt-0.5">
            Mitigating psychological isolation, monitoring individual morale, and synchronizing crew schedules despite the Mars 39m 35s diurnal drift.
          </p>
        </div>

        {/* Team Cohesion Badge */}
        <div className="w-full sm:w-auto bg-[#131820] border border-[#1F2937] px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl flex items-center gap-4 sm:gap-5 shadow-lg shadow-black/40">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-emerald-500/40 flex items-center justify-center font-black font-mono text-emerald-400 text-lg sm:text-xl tabular-nums shadow-sm shadow-emerald-500/30 flex-shrink-0">
            {teamCohesion}%
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold tracking-wider">Team Cohesion Index</div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Optimal Sync
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono">0 Friction Triggers</span>
          </div>
        </div>
      </div>

      {/* Simplified, Big & Clear Circadian Alignment Timeline */}
      <div className="bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#1F2937]">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Sol 412 Circadian Alignment Timeline
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 sm:mt-1">
              4-Hour Martian Shift Blocks & Shared Awake Overlap
            </h3>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-medium">
            <span className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-md bg-blue-950 border border-blue-700" /> Sleep
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-md bg-amber-600/40 border border-amber-500" /> ARED
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-md bg-[#1E293B] border border-gray-600" /> Ops
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 text-emerald-300 font-bold">
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-md bg-emerald-500/30 border border-emerald-500 shadow-sm shadow-emerald-500/40" /> Shared Meal
            </span>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-medium lg:hidden">
          <span>👈 Swipe horizontally to view 24h timeline 👉</span>
        </div>

        {/* Large Visual Shift Blocks Table */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="min-w-[700px] space-y-3">
            {/* Column Headers with Time Windows */}
            <div className="grid grid-cols-12 gap-2.5 sm:gap-3 mb-2 text-xs font-mono font-bold text-gray-400">
              <div className="col-span-2 text-gray-500">CREW MEMBER</div>
              {SHIFT_BLOCKS.map((shift, idx) => (
                <div 
                  key={idx} 
                  className={`text-center p-2 rounded-xl border ${
                    idx === 4 
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-black' 
                      : 'bg-[#18202C] border-[#1F2937] text-gray-300'
                  }`}
                  style={{ gridColumn: 'span 1' }}
                >
                  <div className="text-[10px] sm:text-[11px] font-bold">{shift.timeRange.split(' - ')[0]}</div>
                  <div className="text-[8px] sm:text-[9px] text-gray-500 hidden sm:block truncate">{shift.label.split(' ')[0]}</div>
                </div>
              ))}
            </div>

            {/* Large Blocks Per Astronaut */}
            {crew.map((member) => (
              <div key={member.id} className="grid grid-cols-12 gap-2.5 sm:gap-3 items-center">
                {/* Astronaut Identity Column */}
                <div className="col-span-2 flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-[#18202C] border border-[#1F2937]">
                  <span className="text-xl sm:text-2xl">{member.avatar}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{member.name.split(' ')[1] || member.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">{member.role.split(' ')[0]}</div>
                  </div>
                </div>

                {/* The 6 Large Blocks */}
                {SHIFT_BLOCKS.map((_, idx) => {
                  const shift = getCrewShiftStatus(member.id, idx)
                  const isShared = idx === 4

                  return (
                    <div
                      key={idx}
                      className={`h-14 sm:h-16 rounded-xl border flex flex-col justify-center items-center text-center p-1.5 sm:p-2 transition-transform hover:scale-[1.02] cursor-default ${shift.color} ${
                        isShared ? 'ring-2 ring-emerald-500/50 shadow-md shadow-emerald-950/40' : ''
                      }`}
                      style={{ gridColumn: 'span 1' }}
                    >
                      <span className="text-[10px] sm:text-[11px] font-bold line-clamp-1">{shift.label.split(' (')[0]}</span>
                      {shift.label.includes('(') && (
                        <span className="text-[8px] sm:text-[9px] font-mono opacity-80">{shift.label.match(/\((.*?)\)/)?.[1]}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Highlighted Shared Social Banner */}
        <div className="p-4 sm:p-5 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 shadow-lg shadow-emerald-950/20">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-emerald-500/20 rounded-xl text-emerald-400 flex-shrink-0 mt-0.5">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-wider">
                  Optimal Social Sync Window Identified
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  18:00 – 19:30 Sol Time
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-1 max-w-2xl leading-relaxed">
                All 4 crew members are confirmed awake and clear of scheduled maintenance. 
                NASA Behavioral Health recommends assembling in the central Galley module for a shared meal.
              </p>
            </div>
          </div>
          <button 
            onClick={handleScheduleDinner}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all whitespace-nowrap shadow-md shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
          >
            <CalendarCheck2 className="w-4 h-4" />
            Schedule Meal Notice
          </button>
        </div>
      </div>

      {/* Row 2: Daily Mood Check-in & Crew Manifest Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Mood Check-In Widget */}
        <div className="lg:col-span-5 bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4 sm:space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Psychological Assessment</span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 sm:mt-1">Daily Mood Check-in</h3>
              </div>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>

            <p className="text-xs text-gray-400 mb-4 sm:mb-5 leading-relaxed">
              Log confidential emotional resilience telemetry for Sol 412. Unobtrusive 3-state design prevents survey fatigue.
            </p>

            {/* Astronaut Selector Pills */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
              {crew.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedCrewId(m.id)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCrewId === m.id
                      ? 'bg-blue-500/20 border-blue-500 text-white shadow-md shadow-blue-950/30'
                      : 'bg-[#18202C] border-[#1F2937] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{m.avatar} {m.name.split(' ')[1] || m.name}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-bold uppercase ${
                    m.mood === 'great' ? 'bg-emerald-500/20 text-emerald-400' :
                    m.mood === 'okay' ? 'bg-amber-500/20 text-amber-400' :
                    m.mood === 'struggling' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {m.mood || 'Pending'}
                  </span>
                </button>
              ))}
            </div>

            {/* 3-Emoji Selector */}
            <div className="p-4 sm:p-6 bg-[#18202C] border border-[#1F2937] rounded-2xl text-center space-y-3 sm:space-y-4">
              <span className="text-xs text-gray-300 font-semibold block">
                How is <strong className="text-white">{selectedCrew.name}</strong> feeling right now?
              </span>
              <div className="flex items-center justify-around sm:justify-center gap-2 sm:gap-6">
                <button
                  onClick={() => handleSelectMood('great')}
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer min-w-[70px] ${
                    selectedCrew.mood === 'great'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-105 shadow-md shadow-emerald-950/40'
                      : 'border-transparent text-gray-400 hover:text-emerald-400 hover:bg-white/5'
                  }`}
                >
                  <Smile className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="text-xs font-bold">Great</span>
                </button>

                <button
                  onClick={() => handleSelectMood('okay')}
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer min-w-[70px] ${
                    selectedCrew.mood === 'okay'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 scale-105 shadow-md shadow-amber-950/40'
                      : 'border-transparent text-gray-400 hover:text-amber-400 hover:bg-white/5'
                  }`}
                >
                  <Meh className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="text-xs font-bold">Okay</span>
                </button>

                <button
                  onClick={() => handleSelectMood('struggling')}
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer min-w-[70px] ${
                    selectedCrew.mood === 'struggling'
                      ? 'bg-red-500/20 border-red-500 text-red-400 scale-105 shadow-md shadow-red-950/40'
                      : 'border-transparent text-gray-400 hover:text-red-400 hover:bg-white/5'
                  }`}
                >
                  <Frown className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="text-xs font-bold">Struggling</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-gray-500 flex items-center justify-between pt-2">
            <span>NASA Behavioral Log Level 2</span>
            <span>Anonymous peer review</span>
          </div>
        </div>

        {/* 4-Crew Manifest Cards */}
        <div className="lg:col-span-7 bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Crew Manifest</span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">Sol 412 Readiness Summary</h3>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {crew.map(m => (
              <div key={m.id} className="p-3.5 sm:p-4 bg-[#18202C] border border-[#1F2937] rounded-xl space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{m.avatar}</span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-none">{m.name}</div>
                      <div className="text-[11px] sm:text-xs text-gray-400 mt-1">{m.role}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold uppercase font-mono ${
                    m.mood === 'great' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    m.mood === 'okay' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    m.mood === 'struggling' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {m.mood || 'Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2.5 sm:pt-3 border-t border-[#2A3444] text-xs font-mono">
                  <div>
                    <span className="text-gray-500 block text-[9px] sm:text-[10px] uppercase">ARED</span>
                    <span className="text-white font-bold text-[11px] sm:text-xs">{m.exerciseHours}h / 2.5h</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] sm:text-[10px] uppercase">Sleep</span>
                    <span className="text-white font-bold text-[11px] sm:text-xs">{m.sleepHours}h</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] sm:text-[10px] uppercase">Drift</span>
                    <span className="text-emerald-400 font-bold text-[11px] sm:text-xs">+{m.circadianDrift}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 sm:p-4 bg-[#18202C] rounded-xl border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs text-gray-400">
            <span>Overall Habitat Psychological Morale:</span>
            <span className="text-emerald-400 font-bold text-xs sm:text-sm">94% Stable (Zero cabin fever indicators)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
