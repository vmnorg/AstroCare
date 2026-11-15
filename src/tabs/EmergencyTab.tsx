import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { 
  AlertOctagon, 
  Wind, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  Zap, 
  Heart,
  ShieldCheck
} from 'lucide-react'

interface EmergencyStep {
  id: number
  title: string
  subtext: string
  actionLabel: string
  detail: string
  critical: boolean
  role: 'RESCUER' | 'ASSISTANT'
}

export default function EmergencyTab() {
  const { emergencyActive, activateEmergency, deactivateEmergency, addToast } = useStore()

  // Environmental Handoff State
  const [activeHazard, setActiveHazard] = useState<'NONE' | 'FIRE' | 'DEPRESS' | 'ECLSS'>('NONE')
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [cprCount, setCprCount] = useState<number>(0)
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false)

  // Metronome effect for CPR (100-120 bpm)
  useEffect(() => {
    let interval: any = null
    if (isMetronomeActive) {
      interval = setInterval(() => {
        setCprCount((prev) => (prev + 1) % 30)
      }, 550) // ~110 bpm
    }
    return () => clearInterval(interval)
  }, [isMetronomeActive])

  const steps: EmergencyStep[] = [
    {
      id: 1,
      title: "1. SECURE CABIN AIRFLOW",
      subtext: "Verify oxygen partial pressure and isolate habitat scrubbers if toxic smoke or Halon gas is present.",
      actionLabel: "CONFIRM AIRFLOW ISOLATED",
      detail: "Check overhead Vent Switch V-02. If flashing Amber, clamp oxygen bleed line. Ensure suit seals intact if depressurization alarm is active.",
      critical: true,
      role: 'ASSISTANT'
    },
    {
      id: 2,
      title: "2. CHECK HEART RATE & RESPONSIVENESS",
      subtext: "Attach finger probe from Pack A. Shake patient shoulders firmly and call name loudly in visor.",
      actionLabel: "VITALS CONFIRMED (INITIATE CPR IF NO PULSE)",
      detail: "Telemetry pad reads: 42 bpm (Severe Bradycardia). If pulse disappears entirely, immediately initiate 30:2 chest compressions at 100-120 bpm.",
      critical: true,
      role: 'RESCUER'
    },
    {
      id: 3,
      title: "3. ADMINISTER KIT #2 (AUTOINJECTOR)",
      subtext: "Retrieve Yellow Hardcase #2 from starboard rack. Apply intramuscularly through outer flight suit.",
      actionLabel: "CONFIRM KIT #2 ADMINISTERED (LOG TIME)",
      detail: "Press auto-injector firmly against lateral thigh muscle until loud audible click sounds. Hold in place for 10 full seconds.",
      critical: true,
      role: 'RESCUER'
    },
    {
      id: 4,
      title: "4. DEPLOY AUTOMATED DEFIBRILLATOR / SUCTION",
      subtext: "Apply defibrillator gel pads as illustrated on lid (Sternum & Apex). Stand clear during automated rhythm analysis.",
      actionLabel: "DEFIBRILLATOR PADS ATTACHED & CHARGING",
      detail: "AED will speak loud audio directives. Stand completely clear of patient body when orange LED flashes.",
      critical: false,
      role: 'ASSISTANT'
    }
  ]

  const handleHazardToggle = (hazard: 'FIRE' | 'DEPRESS' | 'ECLSS') => {
    const next = activeHazard === hazard ? 'NONE' : hazard
    setActiveHazard(next)
    if (next !== 'NONE') {
      addToast({
        title: `CRITICAL HANDOFF: ${hazard}`,
        message: `Environmental emergency protocol for ${hazard} activated. Life support cross-links clamped.`,
        type: 'error'
      })
    } else {
      addToast({
        title: 'Hazard Protocol Cleared',
        message: `Environmental handoff ${hazard} cleared by crew operator.`,
        type: 'info'
      })
    }
  }

  const handleStepAdvance = () => {
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    addToast({
      title: `Step ${currentStep} Completed`,
      message: `${steps[currentStep - 1]?.title} verified. Advancing to next emergency action.`,
      type: 'success'
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* High-Contrast Emergency Header Strip */}
      <div className={`p-4 sm:p-6 rounded-2xl border-3 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 transition-all ${
        emergencyActive || activeHazard !== 'NONE'
          ? 'bg-red-950/50 border-red-500 shadow-2xl shadow-red-950/60 ring-2 ring-red-500/50' 
          : 'bg-[#131820] border-[#1F2937]'
      }`}>
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-red-600 rounded-2xl text-white animate-pulse shadow-lg shadow-red-600/50 flex-shrink-0 mt-0.5 sm:mt-0">
            <AlertOctagon className="w-7 h-7 sm:w-9 sm:h-9" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-red-600 text-white tracking-widest uppercase shadow-sm">
                CODE RED · FIRST-AID
              </span>
              <span className="text-[10px] sm:text-xs text-red-300 font-mono font-bold">NON-MEDICAL CREW</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              AstroCare Emergency Tactical Guidance
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5 font-medium">
              Simplified emergency procedures for Sol 412 habitat anomalies. Audio guidance active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {emergencyActive ? (
            <button
              onClick={() => {
                deactivateEmergency()
                addToast({
                  title: 'Emergency Stood Down',
                  message: 'Habitat SOS cancelled. Life support returned to nominal Sol 412 monitoring.',
                  type: 'info'
                })
              }}
              className="w-full md:w-auto px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs sm:text-sm font-bold rounded-xl border border-gray-600 transition-colors cursor-pointer text-center"
            >
              Stand Down Alert
            </button>
          ) : (
            <button
              onClick={() => {
                activateEmergency()
                addToast({
                  title: 'HABITAT SOS BROADCAST',
                  message: 'Station-wide Code Red alarm engaged. Distress beacon queued on DSN priority channel.',
                  type: 'error'
                })
              }}
              className="w-full md:w-auto px-6 py-3.5 sm:px-7 sm:py-4 bg-red-600 hover:bg-red-500 text-white text-sm sm:text-base font-black rounded-xl transition-all shadow-xl shadow-red-900/60 flex items-center justify-center gap-2.5 animate-bounce cursor-pointer"
            >
              <Zap className="w-5 h-5" />
              TRIGGER HABITAT SOS
            </button>
          )}
        </div>
      </div>

      {/* Environmental Handoff Keys (FIRE / DEPRESS / ECLSS) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
            Environmental Hazard Handoff (EVA Glove Soft-Keys)
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 font-mono hidden xs:inline">Life support isolation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          {/* FIRE Button */}
          <button
            onClick={() => handleHazardToggle('FIRE')}
            className={`min-h-[88px] sm:min-h-[120px] p-3.5 sm:p-5 rounded-2xl border-3 flex items-center justify-center flex-row sm:flex-col gap-3 sm:gap-2 transition-all font-black text-base sm:text-xl cursor-pointer ${
              activeHazard === 'FIRE'
                ? 'bg-red-600 border-white text-white shadow-2xl shadow-red-600/70 scale-[1.01]'
                : 'bg-[#18202C] border-red-500/40 text-red-400 hover:bg-red-950/40'
            }`}
          >
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
            <div className="text-left sm:text-center">
              <div>FIRE / HALON</div>
              <div className="text-[11px] sm:text-xs font-medium opacity-85 mt-0.5">Isolate Module & Halon Dump</div>
            </div>
          </button>

          {/* DEPRESS Button */}
          <button
            onClick={() => handleHazardToggle('DEPRESS')}
            className={`min-h-[88px] sm:min-h-[120px] p-3.5 sm:p-5 rounded-2xl border-3 flex items-center justify-center flex-row sm:flex-col gap-3 sm:gap-2 transition-all font-black text-base sm:text-xl cursor-pointer ${
              activeHazard === 'DEPRESS'
                ? 'bg-amber-500 border-white text-black shadow-2xl shadow-amber-500/70 scale-[1.01]'
                : 'bg-[#18202C] border-amber-500/40 text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
            <div className="text-left sm:text-center">
              <div>RAPID DEPRESS</div>
              <div className="text-[11px] sm:text-xs font-medium opacity-85 mt-0.5">Don Visor & Lock Bulkhead</div>
            </div>
          </button>

          {/* ECLSS/AIR Button */}
          <button
            onClick={() => handleHazardToggle('ECLSS')}
            className={`min-h-[88px] sm:min-h-[120px] p-3.5 sm:p-5 rounded-2xl border-3 flex items-center justify-center flex-row sm:flex-col gap-3 sm:gap-2 transition-all font-black text-base sm:text-xl cursor-pointer ${
              activeHazard === 'ECLSS'
                ? 'bg-blue-600 border-white text-white shadow-2xl shadow-blue-600/70 scale-[1.01]'
                : 'bg-[#18202C] border-blue-500/40 text-blue-400 hover:bg-blue-950/40'
            }`}
          >
            <Wind className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
            <div className="text-left sm:text-center">
              <div>ECLSS / AIR FAULT</div>
              <div className="text-[11px] sm:text-xs font-medium opacity-85 mt-0.5">Purge O₂ & Flush CO₂ Loop</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Checklist Workflow Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Visual Step-by-Step Interactive Checklist */}
        <div className="lg:col-span-8 bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#1F2937]">
            <div>
              <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                Step-by-Step Non-Medical Checklist
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Step {currentStep <= steps.length ? currentStep : steps.length} of {steps.length}
              </h3>
            </div>
            <button
              onClick={() => {
                setCurrentStep(1)
                addToast({
                  title: 'Checklist Reset',
                  message: 'Emergency procedure reset to Step 1: Secure Cabin Airflow.',
                  type: 'info'
                })
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#18202C] hover:bg-[#253042] text-gray-300 text-xs font-bold rounded-xl border border-[#1F2937] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-4 sm:space-y-5">
            {steps.map((step) => {
              const isCurrent = currentStep === step.id
              const isDone = currentStep > step.id

              return (
                <div
                  key={step.id}
                  className={`p-4 sm:p-6 lg:p-7 rounded-2xl border-3 transition-all ${
                    isCurrent
                      ? 'bg-red-500/15 border-red-500 shadow-2xl shadow-red-950/40 ring-2 ring-red-400/50'
                      : isDone
                        ? 'bg-[#18202C]/60 border-emerald-500/50 opacity-80'
                        : 'bg-[#18202C]/40 border-[#1F2937] opacity-40'
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl flex-shrink-0 mt-0.5 ${
                        isDone 
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/40' 
                          : isCurrent 
                            ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/50' 
                            : 'bg-gray-800 text-gray-400'
                      }`}>
                        {isDone ? '✓' : step.id}
                      </div>

                      <div className="flex-1 space-y-1.5 sm:space-y-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                            {step.title}
                          </h4>
                          <span className="text-[10px] sm:text-xs font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700 font-mono">
                            {step.role}
                          </span>
                        </div>

                        {/* CRUCIAL REQUIREMENT: Large, legible text-xl to text-2xl instruction */}
                        <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-100 leading-snug pt-0.5 sm:pt-1">
                          {step.subtext}
                        </p>
                        
                        {isCurrent && (
                          <div className="mt-3 sm:mt-4 p-3.5 sm:p-5 bg-black/60 rounded-xl border-2 border-red-500/40 text-sm sm:text-base md:text-lg font-bold text-red-200 leading-relaxed">
                            <span className="text-red-400 font-black block text-[11px] sm:text-xs uppercase tracking-wider mb-1">
                              ⚡ IMMEDIATE DIRECTIVE:
                            </span>
                            {step.detail}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Massive, Glove-Friendly Action Button for Active Step */}
                    {isCurrent && (
                      <div className="pt-3 sm:pt-4 border-t border-red-500/40 flex justify-end">
                        <button
                          onClick={handleStepAdvance}
                          className="w-full min-h-[68px] sm:min-h-[88px] px-4 sm:px-8 py-4 sm:py-5 bg-red-600 hover:bg-red-500 text-white font-black text-sm sm:text-lg md:text-xl rounded-2xl transition-all flex items-center justify-center gap-2.5 sm:gap-3 shadow-2xl shadow-red-900/60 cursor-pointer uppercase tracking-wider hover:scale-[1.01]"
                        >
                          <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" />
                          <span>{step.actionLabel}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {currentStep > steps.length && (
              <div className="p-6 sm:p-8 bg-emerald-500/20 border-3 border-emerald-500 rounded-2xl text-center space-y-3 shadow-xl shadow-emerald-950/40">
                <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-400 mx-auto" />
                <h4 className="text-xl sm:text-2xl font-black text-white">All Emergency Steps Successfully Executed</h4>
                <p className="text-sm sm:text-base text-emerald-200 max-w-xl mx-auto font-medium">
                  Patient airway and perfusion stabilized. Diagnostic telemetry transmission queued to Earth Doctor. Maintain continuous vitals observation.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black rounded-xl cursor-pointer"
                  >
                    Restart First-Aid Protocol
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Audio Metronome & Medical Kit Map */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          {/* Audio CPR Metronome Card */}
          <div className="bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                  CPR Cadence (110 BPM)
                </span>
              </div>
              <Volume2 className={`w-5 h-5 ${isMetronomeActive ? 'text-red-400 animate-pulse' : 'text-gray-500'}`} />
            </div>

            <div className="p-4 sm:p-6 bg-[#18202C] rounded-2xl text-center border border-[#1F2937] space-y-2.5 sm:space-y-3">
              <div className="text-3xl sm:text-4xl font-black font-mono text-white tabular-nums">
                {isMetronomeActive ? cprCount + 1 : '0'} <span className="text-sm sm:text-base font-normal text-gray-400">/ 30</span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Compressions Cycle</div>

              <div className="w-full bg-[#1F2937] h-3 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((cprCount + 1) / 30) * 100}%` }}
                />
              </div>

              <button
                onClick={() => {
                  const nextState = !isMetronomeActive
                  setIsMetronomeActive(nextState)
                  addToast({
                    title: nextState ? 'CPR Cadence Active' : 'CPR Cadence Paused',
                    message: nextState ? '110 BPM visual and audio pacing active for 30:2 compression cycle.' : 'Metronome stopped.',
                    type: nextState ? 'warning' : 'info'
                  })
                }}
                className={`mt-3 w-full py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  isMetronomeActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
              >
                {isMetronomeActive ? 'Stop Metronome' : 'Start CPR Cadence (110 BPM)'}
              </button>
            </div>
          </div>

          {/* Quick Hardware Medical Packs Locator */}
          <div className="bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Habitat Medical Hardcases
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs">
              <div className="p-3 sm:p-3.5 bg-[#18202C] border border-[#1F2937] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm">Kit #1: Airway & Suction</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">Starboard Bay 01 • Blue Seal</div>
                </div>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">READY</span>
              </div>

              <div className="p-3 sm:p-3.5 bg-[#18202C] border-2 border-amber-500/50 rounded-xl flex items-center justify-between shadow-md shadow-amber-950/20">
                <div>
                  <div className="font-bold text-amber-300 text-xs sm:text-sm">Kit #2: Epinephrine / Trauma</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">Port Bay 02 • Yellow Case</div>
                </div>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 font-bold">PRIMARY</span>
              </div>

              <div className="p-3 sm:p-3.5 bg-[#18202C] border border-[#1F2937] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm">Kit #3: Tourniquet & Hemostat</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">Center Deck • Red Bag</div>
                </div>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
