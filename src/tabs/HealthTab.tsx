import { useStore, heartRateData, sleepData } from '../store'
import { 
  Heart, 
  Brain, 
  Activity, 
  Dumbbell, 
  AlertTriangle, 
  ChevronRight, 
  Moon, 
  Plus,
  Wind
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceArea 
} from 'recharts'

export default function HealthTab() {
  const { crew, logExercise, ppCO2, bodyRegion, setBodyRegion, addToast } = useStore()
  const commander = crew[0] // CDR Reyes

  // Selected region default to 'heart' if null
  const selectedRegion = bodyRegion || 'heart'

  const exercisePercent = Math.min(100, Math.round((commander.exerciseHours / 2.5) * 100))

  const handleBoostAirflow = () => {
    addToast({
      title: 'ECLSS Scrubber Active',
      message: 'Ventilation booster sequence initiated on Loop B. Cabin ppCO₂ drawdown initiated towards < 3.0 mmHg nominal.',
      type: 'warning'
    })
  }

  const handleLogExercise = () => {
    logExercise('CDR', 0.5)
    addToast({
      title: 'ARED Load Session Logged',
      message: '+30 Minutes of resistive countermeasure recorded for Commander Reyes. 0.38g musculoskeletal buffer updated.',
      type: 'success'
    })
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner: Smart Environment Alert (NASA Metric: ppCO2 > 4.0 mmHg is Alert) */}
      {ppCO2 > 4.0 && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg shadow-amber-950/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 mt-1 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/25 text-amber-300 uppercase tracking-wider">
                  Cabin Life Support Advisory
                </span>
                <span className="text-xs text-gray-400 font-mono">Loop Sensor #04</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Cabin ppCO₂ Elevated ({ppCO2} mmHg) — Cognitive Fatigue & Headache Risk
              </h3>
              <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
                Nominal spacecraft atmosphere is &lt; 3.0 mmHg (Alert threshold &gt; 4.0 mmHg). Elevated ppCO₂ on Sol 412 correlates with REM sleep fragmentation and impaired crew performance.
              </p>
              <div className="pt-1 flex items-center gap-4 text-xs font-medium text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4" /> Recommended Action: Increase Hab CO₂ Scrubber draw rate to 140%
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleBoostAirflow}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-all whitespace-nowrap shadow-md shadow-amber-900/30 self-start md:self-center flex items-center gap-2 cursor-pointer"
          >
            <Wind className="w-4 h-4" />
            Boost Airflow
          </button>
        </div>
      )}

      {/* Row 1: Interactive Body Map + Organ Details + ARED Exercise Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive 2D Body Silhouette */}
        <div className="lg:col-span-5 bg-[#131820] border border-[#1F2937] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Biometric Sensor Telemetry</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{commander.name}</h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold font-mono">
              0.38g Mars Bio-Lock
            </span>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 justify-center py-4">
            {/* SVG Silhouette with interactive targets */}
            <div className="relative w-44 h-80 flex items-center justify-center">
              <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-md">
                {/* Silhouette background */}
                <path 
                  d="M100 20 C115 20, 125 35, 125 55 C125 70, 115 82, 100 82 C85 82, 75 70, 75 55 C75 35, 85 20, 100 20 Z 
                     M80 90 L120 90 L145 110 L160 180 L145 190 L135 140 L135 220 L150 370 L125 375 L115 245 L100 245 L85 245 L75 375 L50 370 L65 220 L65 140 L55 190 L40 180 L55 110 Z" 
                  fill="#18202C" 
                  stroke="#2E384D" 
                  strokeWidth="2" 
                />

                {/* Head Target */}
                <g 
                  onClick={() => setBodyRegion('head')} 
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="100" cy="52" r="24" 
                    fill={selectedRegion === 'head' ? 'rgba(59, 130, 246, 0.45)' : 'rgba(31, 41, 55, 0.6)'} 
                    stroke={selectedRegion === 'head' ? '#3B82F6' : '#4B5563'} 
                    strokeWidth="2.5" 
                  />
                  <Brain className="w-5 h-5 text-blue-400" x="90" y="42" />
                </g>

                {/* Heart / Chest Target */}
                <g 
                  onClick={() => setBodyRegion('heart')} 
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="100" cy="130" r="28" 
                    fill={selectedRegion === 'heart' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(31, 41, 55, 0.6)'} 
                    stroke={selectedRegion === 'heart' ? '#EF4444' : '#4B5563'} 
                    strokeWidth="2.5" 
                  />
                  <Heart className="w-6 h-6 text-red-400" x="88" y="118" />
                </g>

                {/* Bones / Legs Target */}
                <g 
                  onClick={() => setBodyRegion('bones')} 
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="100" cy="290" r="32" 
                    fill={selectedRegion === 'bones' ? 'rgba(245, 158, 11, 0.45)' : 'rgba(31, 41, 55, 0.6)'} 
                    stroke={selectedRegion === 'bones' ? '#F59E0B' : '#4B5563'} 
                    strokeWidth="2.5" 
                  />
                  <Activity className="w-6 h-6 text-amber-400" x="88" y="278" />
                </g>
              </svg>
            </div>

            {/* Region Selector Buttons */}
            <div className="flex flex-col gap-3 w-full sm:w-48">
              <button 
                onClick={() => setBodyRegion('head')}
                className={`p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                  selectedRegion === 'head' 
                    ? 'bg-blue-500/20 border-blue-500/60 text-blue-300 shadow-md shadow-blue-950/30' 
                    : 'bg-[#18202C] border-[#1F2937] text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span>Head & Sleep</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>

              <button 
                onClick={() => setBodyRegion('heart')}
                className={`p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                  selectedRegion === 'heart' 
                    ? 'bg-red-500/20 border-red-500/60 text-red-300 shadow-md shadow-red-950/30' 
                    : 'bg-[#18202C] border-[#1F2937] text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Cardiovascular</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>

              <button 
                onClick={() => setBodyRegion('bones')}
                className={`p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                  selectedRegion === 'bones' 
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md shadow-amber-950/30' 
                    : 'bg-[#18202C] border-[#1F2937] text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Bones & 0.38g</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>

              <div className="p-3 bg-[#18202C] rounded-xl border border-[#1F2937] text-[11px] text-gray-400 leading-normal">
                Click any organ node to focus telemetry and check physiological adaptations.
              </div>
            </div>
          </div>
        </div>

        {/* Selected Region Telemetry Breakdown + ARED */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-[#131820] border border-[#1F2937] rounded-2xl p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {selectedRegion === 'head' && 'Cranial & Circadian Diagnostics'}
                  {selectedRegion === 'heart' && 'Cardiovascular & Vital Signs'}
                  {selectedRegion === 'bones' && 'Musculoskeletal & 0.38g Gravity Impact'}
                </span>
                <span className="text-xs text-gray-500 font-mono">Live Telemetry Link</span>
              </div>

              {selectedRegion === 'head' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Last Sol Sleep</span>
                      <div className="text-3xl font-black font-mono text-white mt-1 tabular-nums">
                        {commander.sleepHours} <span className="text-sm font-normal text-gray-400">hrs</span>
                      </div>
                      <p className="text-xs text-amber-400 mt-1 font-medium">Target: 8.0h (Circadian lag)</p>
                    </div>
                    <div className="p-4 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Circadian Drift (39m Sol)</span>
                      <div className="text-3xl font-black font-mono text-white mt-1 tabular-nums">
                        +{commander.circadianDrift} <span className="text-sm font-normal text-gray-400">min/sol</span>
                      </div>
                      <p className="text-xs text-emerald-400 mt-1 font-medium">Light therapy aligned</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 leading-relaxed">
                    💡 <strong>NASA Protocol Note:</strong> The Mars 24h 39m 35s day causes natural circadian desynchronosis. Scheduled light visor suppression active for Sol 412.
                  </div>
                </div>
              )}

              {selectedRegion === 'heart' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Resting HR</span>
                      <div className="text-2xl font-black font-mono text-emerald-400 mt-1 tabular-nums">
                        {commander.hr} <span className="text-xs text-gray-400 font-normal">bpm</span>
                      </div>
                      <span className="text-[11px] text-emerald-400/80">Nominal 60-85</span>
                    </div>

                    <div className="p-3.5 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Blood Oxygen</span>
                      <div className="text-2xl font-black font-mono text-emerald-400 mt-1 tabular-nums">
                        {commander.spo2}%
                      </div>
                      <span className="text-[11px] text-emerald-400/80">SpO₂ &gt; 95%</span>
                    </div>

                    <div className="p-3.5 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Blood Pressure</span>
                      <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums">
                        {commander.bp}
                      </div>
                      <span className="text-[11px] text-gray-400">Optimal mmHg</span>
                    </div>

                    <div className="p-3.5 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Core Temp</span>
                      <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums">
                        {commander.temp}°C
                      </div>
                      <span className="text-[11px] text-gray-400">36.5 - 37.5°C</span>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 leading-relaxed">
                    ✓ <strong>Cardiovascular Status:</strong> All hemodynamics within standard flight limits for long-duration Martian stay. No ectopic beats observed.
                  </div>
                </div>
              )}

              {selectedRegion === 'bones' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Bone Mineral Density Loss</span>
                      <div className="text-3xl font-black font-mono text-amber-400 mt-1 tabular-nums">
                        -{commander.boneDensityLoss}% <span className="text-sm font-normal text-gray-400">/ mo</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-medium">Mars gravity: 0.38g</p>
                    </div>

                    <div className="p-4 bg-[#18202C] rounded-xl border border-[#1F2937]">
                      <span className="text-xs text-gray-400 font-medium">Calcium Excretion</span>
                      <div className="text-3xl font-black font-mono text-white mt-1 tabular-nums">
                        240 <span className="text-sm font-normal text-gray-400">mg/d</span>
                      </div>
                      <p className="text-xs text-amber-400 mt-1 font-medium">Elevated risk of kidney stones</p>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 leading-relaxed">
                    ⚠️ <strong>0.38g Mars Countermeasure:</strong> NASA flight rules dictate 2.5 hours of daily resistive load (ARED) to prevent irreversible trabecular bone loss.
                  </div>
                </div>
              )}
            </div>

            {/* ARED Exercise Tracker Component */}
            <div className="mt-6 pt-5 border-t border-[#1F2937]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <Dumbbell className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    ARED Daily Resistive Exercise Goal
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {commander.exerciseHours} / 2.5 Hours Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#1F2937] h-4 rounded-full overflow-hidden flex p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    commander.exerciseHours >= 2.0 
                      ? 'bg-emerald-500' 
                      : commander.exerciseHours >= 1.0 
                        ? 'bg-amber-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${exercisePercent}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 text-xs">
                <span className="text-gray-400">
                  {exercisePercent >= 100 
                    ? '🎉 Goal achieved for Sol 412! Bone matrix maintained.' 
                    : `${(2.5 - commander.exerciseHours).toFixed(1)}h remaining today to prevent bone demineralization.`}
                </span>
                <button
                  onClick={handleLogExercise}
                  disabled={commander.exerciseHours >= 2.5}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-900/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Log +30 Min
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Dynamic 7-Day Trends with Green Normal Range Bands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Heart Rate Chart */}
        <div className="bg-[#131820] border border-[#1F2937] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">7-Day Hemodynamics</span>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mt-1">
                Resting Heart Rate (BPM)
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                  Target: 60-85
                </span>
              </h3>
            </div>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hrColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131820', borderColor: '#1F2937', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                {/* Green Shaded Normal Range */}
                <ReferenceArea y1={60} y2={85} fill="#10B981" fillOpacity={0.08} strokeOpacity={0} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#hrColor)" name="Heart Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-500/30 inline-block border border-emerald-500/60" />
            Green envelope shows astronaut flight envelope. No tachycardic anomalies detected.
          </p>
        </div>

        {/* Sleep Duration Chart */}
        <div className="bg-[#131820] border border-[#1F2937] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Circadian Stability</span>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mt-1">
                Sleep Duration (Hours)
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono">
                  Target: 7.0 - 9.0h
                </span>
              </h3>
            </div>
            <Moon className="w-5 h-5 text-blue-400" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis domain={[4, 10]} stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131820', borderColor: '#1F2937', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                {/* Blue Shaded Target Range */}
                <ReferenceArea y1={7.0} y2={9.0} fill="#3B82F6" fillOpacity={0.08} strokeOpacity={0} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#sleepColor)" name="Sleep Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-500/30 inline-block border border-blue-500/60" />
            Sleep dip on Sol 409-410 correlated with elevated ambient CO₂ (4.2 mmHg).
          </p>
        </div>
      </div>
    </div>
  )
}
