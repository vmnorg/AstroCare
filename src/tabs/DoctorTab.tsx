import React, { useState } from 'react'
import { useStore } from '../store'
import { 
  Radio, 
  Send, 
  FileText, 
  Paperclip, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Inbox,
  ShieldCheck,
  HardDrive
} from 'lucide-react'

export default function DoctorTab() {
  const { outbox, addToOutbox, owltMinutes, rttMinutes, addToast } = useStore()

  // Form State for One-Shot Report Builder
  const [subject, setSubject] = useState('Crew Member Tanaka — Right Flank Pain & Hematuria Concern')
  const [symptoms, setSymptoms] = useState('Intermittent sharp right flank pain (5/10), radiating anteriorly. No fever. Blood pressure 130/85. Suspected nephrolithiasis due to 0.38g calcium excretion.')
  const [painLevel, setPainLevel] = useState(5)
  const [attachments, setAttachments] = useState<string[]>([
    'ultrasound_right_kidney_sol412.dcm (2.4 MB)',
    'vitals_12h_continuous_stream.csv (38 KB)'
  ])
  const [newAttachmentName, setNewAttachmentName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justQueuedId, setJustQueuedId] = useState<string | null>(null)

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return
    setAttachments([...attachments, newAttachmentName.trim()])
    setNewAttachmentName('')
    addToast({
      title: 'File Attached',
      message: `Diagnostic asset "${newAttachmentName.trim()}" bundled into upload payload.`,
      type: 'info'
    })
  }

  const handleQueueReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !symptoms.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Simulate cryptographic package seal and write to local flash storage
    setTimeout(() => {
      const generatedId = `msg-${Date.now()}`
      addToOutbox({
        type: 'report',
        subject,
        body: `[Pain Level: ${painLevel}/10] ${symptoms}`,
        attachments
      })

      setJustQueuedId(generatedId)
      setIsSubmitting(false)

      addToast({
        title: 'Report Cached to Flash Vault',
        message: 'Telemetry package encrypted and saved to Habitat Outbox. Uplink queued for next Deep Space Network contact.',
        type: 'success'
      })

      // Reset recent flash after 4 seconds
      setTimeout(() => {
        setJustQueuedId(null)
      }, 4000)
    }, 700)
  }

  const handleAcknowledge = () => {
    addToast({
      title: 'Ground Directive Acknowledged',
      message: 'Flight Surgeon Vance orders executed: 800mg Ibuprofen & fluid bolus administered to patient. Logged to Station EHR.',
      type: 'success'
    })
  }

  const handleReportDrift = () => {
    addToast({
      title: 'STALENESS ALERT: Clinical Drift Escalated',
      message: 'Pain worsened beyond 7/10. Ground directive cancelled. High-Priority Emergency re-consultation queued to Houston Flight Surgeon.',
      type: 'error'
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Banner: Store-and-Forward Physics Explanation */}
      <div className="p-4 sm:p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 shadow-lg shadow-blue-950/20">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-blue-500/20 rounded-xl text-blue-400 mt-0.5 sm:mt-1 flex-shrink-0">
            <Radio className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase tracking-wider">
                Store-and-Forward Telemedicine
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-mono">DSN Link</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              One-Way Light Time: ~{owltMinutes} Min · Round-Trip Time: ~{rttMinutes} Min
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-3xl leading-relaxed">
              Interactive video calls are impossible between Earth & Mars. Transmissions queue into local flash storage and upload asynchronously when the DSN high-gain orbital antenna aligns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#131820] border border-[#1F2937] rounded-xl text-left sm:text-right font-mono text-xs">
            <span className="text-gray-500 block text-[9px] sm:text-[10px] uppercase font-bold">UPLINK RATE</span>
            <span className="text-emerald-400 font-bold text-xs sm:text-sm">256 kbps (DSN X-Band)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: One-Shot Builder (Left) + Outbox & Earth Replies (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: One-Shot Report Builder */}
        <div className="lg:col-span-6 bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4 sm:space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Clinical Telemetry Bundler</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">One-Shot Medical Report Builder</h3>
              </div>
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>

            <p className="text-xs text-gray-400 mb-4 sm:mb-5 leading-relaxed">
              Because of the 40-minute RTT, package all clinical symptoms, pain ratings, and ultrasound diagnostics into a single comprehensive bundle.
            </p>

            <form onSubmit={handleQueueReport} className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-[11px] sm:text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
                  Report Subject & Patient
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#18202C] border border-[#1F2937] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Crew Member X — Symptom description"
                />
              </div>

              {/* Pain Scale Rating 1-10 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Current Pain Severity Rating
                  </label>
                  <span className={`text-xs font-black font-mono px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full ${
                    painLevel >= 7 ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    painLevel >= 4 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {painLevel} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2.5 bg-[#1F2937] rounded-lg"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-500 mt-1 font-mono">
                  <span>1 (Mild)</span>
                  <span>5 (Flank Pain)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] sm:text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
                  Clinical Examination & Findings
                </label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full bg-[#18202C] border border-[#1F2937] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                  placeholder="Describe onset, duration, palpation, and current countermeasures tried..."
                />
              </div>

              {/* Attachments Section */}
              <div>
                <label className="text-[11px] sm:text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
                  Attached Diagnostic Telemetry ({attachments.length})
                </label>
                <div className="space-y-2 mb-3">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#18202C] border border-[#1F2937] rounded-xl text-xs">
                      <span className="text-gray-300 flex items-center gap-2 font-mono truncate mr-2">
                        <Paperclip className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="truncate">{file}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                        className="text-gray-500 hover:text-red-400 text-sm px-1.5 cursor-pointer flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newAttachmentName}
                    onChange={(e) => setNewAttachmentName(e.target.value)}
                    placeholder="Attach file (e.g. ecg_strip_lead2.png)"
                    className="flex-1 bg-[#18202C] border border-[#1F2937] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#253042] hover:bg-[#2D3A50] text-gray-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Attach
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 sm:py-4 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer shadow-lg ${
                    isSubmitting
                      ? 'bg-amber-600 animate-pulse text-white'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40 hover:scale-[1.01]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <HardDrive className="w-4 h-4 animate-spin" />
                      <span>WRITING TO FLASH VAULT...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Queue for Earth Sync (Store & Forward)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Outbox & Smart Doctor Reply with Drift Warning */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8">
          {/* Smart Doctor Reply Card (The Drift Check - NASA Challenge Requirement) */}
          <div className="bg-[#131820] border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xl shadow-amber-950/20 space-y-3.5 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2A3444]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-wider">
                  Ground Control Directive Received
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-gray-400">
                RTT Elapsed: 42 Min
              </span>
            </div>

            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Flight Surgeon Dr. Vance
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                  NASA JSC Houston
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Re: Crew Member Tanaka — Right Flank Pain & Nephrolithiasis Protocol
              </div>
            </div>

            {/* CRUCIAL NASA REQUIREMENT: The Drift Check Alert */}
            <div className="p-3.5 sm:p-4 bg-amber-500/15 border-2 border-amber-500/50 rounded-xl text-xs text-amber-200 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-300 text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                <span>⚠️ MANDATORY CLINICAL STALENESS ALERT</span>
              </div>
              <p className="leading-relaxed text-[11px] sm:text-xs">
                <strong>42 minutes have passed since this report was sent.</strong> If patient's pain level has drifted above <strong>7/10</strong> or peritoneal signs have manifested since initial capture, <strong>DO NOT follow these instructions</strong>. Re-evaluate vitals and send an emergency priority update immediately.
              </p>
            </div>

            <div className="bg-[#18202C] p-3.5 sm:p-4 rounded-xl border border-[#1F2937] text-xs text-gray-200 space-y-2 sm:space-y-2.5">
              <div className="font-bold text-white">Prescribed Ground Directives:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-300 leading-relaxed text-[11px] sm:text-xs">
                <li>Administer <strong>800mg Oral Ibuprofen</strong> with 500 mL electrolytic hydration bolus.</li>
                <li>Conduct repeat handheld ultrasound on right ureterovesical junction at Sol 412 18:00.</li>
                <li>If acute urinary retention occurs, prepare sterile catheter from <strong>Medical Pack #3</strong>.</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={handleAcknowledge}
                className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                Acknowledge Directive (Pain &lt; 7/10)
              </button>

              <button
                onClick={handleReportDrift}
                className="w-full sm:flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 border-2 border-red-500/50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Report Drift (Pain &gt; 7/10)
              </button>
            </div>
          </div>

          {/* Outbox / Transmission Queue with Visual Feedback */}
          <div className="bg-[#131820] border border-[#1F2937] rounded-2xl p-4 sm:p-6 lg:p-7 space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                  Local Outbox ({outbox.length})
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Local Vault Synced
              </span>
            </div>

            <div className="space-y-3">
              {outbox.map((msg, index) => {
                const isJustQueued = msg.id === justQueuedId || (index === 0 && msg.isRecent)

                return (
                  <div 
                    key={msg.id} 
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-500 space-y-2 ${
                      isJustQueued
                        ? 'bg-emerald-500/15 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-2 ring-emerald-400/60'
                        : 'bg-[#18202C] border-[#1F2937]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        {isJustQueued && (
                          <span className="text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500 text-black uppercase tracking-wider animate-pulse flex-shrink-0">
                            QUEUED
                          </span>
                        )}
                        <span className="text-xs font-bold text-white truncate">{msg.subject}</span>
                      </div>
                      <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase flex-shrink-0 ${
                        msg.status === 'reply-received' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        msg.status === 'transmitting' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{msg.body}</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-[#2A3444]/60 text-[10px] sm:text-[11px] text-gray-400 font-mono">
                      <span>Attachments: {msg.attachments.length} items</span>
                      <span>Queued: Sol 412 (Local Vault)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
