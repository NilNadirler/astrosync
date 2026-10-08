'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, UserRound, ScanLine, History, Sparkles, MapPin, CalendarDays, Clock3, ShieldCheck, ChevronDown, ScanQrCode } from 'lucide-react'
import { calculateCompatibility, calculateApproximateMoonSign, calculateApproximateRisingSign, calculateSunSign, getElementFromSign, type CompatibilityReport, type UserProfile } from '@/lib/zodiac'
import { decodeProfile, encodeProfile, getProfile, saveProfile } from '@/lib/storage'
import { Scanner as QRScanner } from "@yudiel/react-qr-scanner"

type Tab = 'profile' | 'scan' | 'history'

const initialForm = { name: '', dob: '', tob: '', birthLocation: '', exactTimeUnknown: false }

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-xl ${className}`}>{children}</div>
}

function SignPill({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"><span className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</span><span className={`font-medium ${color}`}>{value}</span></div>
}

function ProfileForm({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [form, setForm] = useState(initialForm)
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name || !form.dob || !form.birthLocation) return
    const sunSign = calculateSunSign(form.dob)
    const profile: UserProfile = { name: form.name, dob: form.dob, tob: form.exactTimeUnknown ? undefined : form.tob, birthLocation: form.birthLocation, sunSign, moonSign: calculateApproximateMoonSign(form.dob), risingSign: calculateApproximateRisingSign(form.dob, form.exactTimeUnknown ? undefined : form.tob), element: getElementFromSign(sunSign) }
    saveProfile(profile)
    onComplete(profile)
  }
  return <form onSubmit={submit} className="flex flex-col gap-5">
    <div><p className="mb-2 text-sm font-medium text-white">Your cosmic identity</p><p className="text-sm leading-6 text-slate-400">Enter your birth details to reveal your celestial profile.</p></div>
    <label className="flex flex-col gap-2 text-sm text-slate-300">Name<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="What should we call you?" className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-slate-600 focus:border-fuchsia-400/70" /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm text-slate-300">Date of birth<input required type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-fuchsia-400/70 [color-scheme:dark]" /></label><label className="flex flex-col gap-2 text-sm text-slate-300">Time of birth<input type="time" value={form.tob} disabled={form.exactTimeUnknown} onChange={(e) => update('tob', e.target.value)} className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none disabled:opacity-40 focus:border-fuchsia-400/70 [color-scheme:dark]" /></label></div>
    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400"><input type="checkbox" checked={form.exactTimeUnknown} onChange={(e) => update('exactTimeUnknown', e.target.checked)} className="size-4 accent-fuchsia-400" /> Exact time unknown</label>
    <label className="flex flex-col gap-2 text-sm text-slate-300">Birth location<input required value={form.birthLocation} onChange={(e) => update('birthLocation', e.target.value)} placeholder="City, country" className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-slate-600 focus:border-fuchsia-400/70" /></label>
    <button className="mt-1 flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 font-semibold text-white shadow-[0_0_30px_rgba(192,132,252,0.25)] transition hover:brightness-110">Reveal my profile <Sparkles className="size-4" /></button>
  </form>
}

function ProfileCard({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
  const [copied, setCopied] = useState(false)
  const encoded = encodeProfile(profile)
  const copy = async () => { await navigator.clipboard.writeText(encoded); setCopied(true); setTimeout(() => setCopied(false), 1800) }
  return <div className="flex flex-col gap-5">
    <GlassCard className="relative overflow-hidden p-6"><div className="absolute -right-14 -top-14 size-40 rounded-full bg-fuchsia-500/20 blur-3xl" /><div className="relative flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.24em] text-fuchsia-300">Celestial ID</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{profile.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400"><MapPin className="size-3.5" />{profile.birthLocation}</p></div><div className="rounded-2xl border border-yellow-200/20 bg-yellow-300/10 p-3 text-yellow-200"><Sparkles className="size-5" /></div></div><div className="my-6 flex items-center justify-center"><div className="rounded-3xl border border-fuchsia-300/30 bg-gradient-to-br from-fuchsia-400/20 to-cyan-300/10 p-4 shadow-[0_0_45px_rgba(192,132,252,0.18)]"><QRCodeSVG value={encoded} size={150} bgColor="transparent" fgColor="#ffffff" level="M" /></div></div><div className="grid gap-2"><SignPill label="Sun" value={profile.sunSign} color="text-yellow-200" /><SignPill label="Moon" value={profile.moonSign} color="text-cyan-200" /><SignPill label="Rising" value={profile.risingSign} color="text-fuchsia-200" /></div><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-sm text-slate-400">Primary element</span><span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-200">{profile.element}</span></div></GlassCard><div className="flex gap-3"><button onClick={copy} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-medium text-white transition hover:bg-white/10">{copied ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}{copied ? 'Copied' : 'Copy profile payload'}</button><button onClick={onEdit} className="h-12 rounded-2xl border border-white/10 px-5 text-sm text-slate-300 transition hover:bg-white/10">Edit</button></div></div>
}

function ScoreRing({ score }: { score: number }) { return <div className="relative grid size-44 place-items-center rounded-full" style={{ background: `conic-gradient(#c084fc ${score * 3.6}deg, rgba(255,255,255,.08) 0deg)` }}><div className="grid size-36 place-items-center rounded-full bg-[#0b0a1d]"><div className="text-center"><div className="text-4xl font-semibold text-white">{score}%</div><div className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">cosmic sync</div></div></div></div> }

function Report({ report }: { report: CompatibilityReport }) {
  const [open, setOpen] = useState(0)
  const rows = [{ title: 'Sun sign harmony', data: report.sunHarmony, icon: '☼' }, { title: 'Elemental synergy', data: report.elementalSynergy, icon: '✦' }, { title: 'Emotional vibe', data: report.moonCompatibility, icon: '☾' }]
  return <div className="flex flex-col gap-5"><GlassCard className="flex flex-col items-center p-7 text-center"><p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Your connection</p><h2 className="mt-2 text-2xl font-semibold text-white">A promising alignment</h2><div className="my-6"><ScoreRing score={report.totalScore} /></div><p className="max-w-xs text-sm leading-6 text-slate-400">The stars suggest an easy flow with plenty of room for meaningful growth.</p></GlassCard><GlassCard className="overflow-hidden"><div className="border-b border-white/10 px-5 py-4"><h3 className="font-semibold text-white">Compatibility breakdown</h3><p className="mt-1 text-sm text-slate-400">Three layers of your cosmic connection</p></div>{rows.map((row, index) => <div key={row.title} className="border-b border-white/10 last:border-0"><button onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center gap-3 px-5 py-4 text-left"><span className="grid size-9 place-items-center rounded-xl bg-fuchsia-400/10 text-lg text-fuchsia-200">{row.icon}</span><span className="flex-1"><span className="block text-sm font-medium text-white">{row.title}</span><span className="block text-xs text-slate-500">{row.data.score}% resonance</span></span><ChevronDown className={`size-4 text-slate-500 transition ${open === index ? 'rotate-180' : ''}`} /></button><AnimatePresence>{open === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-4 pl-17 text-sm leading-6 text-slate-400">{row.data.description}</p></motion.div>}</AnimatePresence></div>)}</GlassCard><GlassCard className="p-5"><div className="flex gap-3"><div className="rounded-xl bg-yellow-300/10 p-2.5 text-yellow-200"><Sparkles className="size-4" /></div><div><h3 className="font-medium text-white">Numerology &amp; Life Path Match</h3><p className="mt-1 text-sm text-slate-500">Coming soon — another layer of cosmic insight.</p></div></div></GlassCard></div>
}

function ManuelScanner({ profile, onMatch }: { profile: UserProfile; onMatch: (report: CompatibilityReport) => void }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle')
  const submit = () => { const other = decodeProfile(value.trim()); if (!other) { setStatus('error'); return } onMatch(calculateCompatibility(profile, other)); setStatus('success') }
  return <div className="flex flex-col gap-5"><GlassCard className="overflow-hidden p-5">
  <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-fuchsia-300/25 bg-[#09081a]"><div className="absolute inset-7 rounded-xl border border-cyan-300/20" /><div className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" /><ScanLine className="relative size-20 text-fuchsia-200" /><span className="absolute bottom-5 text-xs uppercase tracking-[0.2em] text-slate-500">Camera scanner ready</span></div><div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400"><ShieldCheck className="size-4 text-emerald-300" />Your data stays on this device</div></GlassCard><GlassCard className="p-5"><div className="mb-4 flex items-center gap-3"><div className="rounded-xl bg-cyan-300/10 p-2.5 text-cyan-200"><ScanQrCode className="size-4" /></div><div>
    <h3 className="font-medium text-white">Paste a profile code</h3><p className="text-sm text-slate-500">Use the fallback if camera access is unavailable.</p></div></div><textarea value={value} onChange={(e) => { setValue(e.target.value); setStatus('idle') }} placeholder="Paste the shared profile payload here..." className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-300/50" /><button onClick={submit} disabled={!value.trim()} className="mt-3 h-12 w-full rounded-2xl bg-cyan-300/15 font-medium text-cyan-100 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-40">Find your cosmic sync</button>{status === 'error' && <p className="mt-3 text-center text-sm text-rose-300">That profile code could not be read. Try copying it again.</p>}</GlassCard></div>
}

function Scanner({
  profile,
  onMatch,
}: {
  profile: UserProfile
  onMatch: (report: CompatibilityReport) => void
}) {
  const [status, setStatus] = useState("idle")
  const [value, setValue] = useState('')

  const handleScan = (results: any[]) => {
    if (!results || results.length === 0) return

    const rawValue = results[0]?.rawValue
    if (!rawValue) return

    const other = decodeProfile(rawValue)

    if (!other) {
      setStatus("error")
      return
    }

    const report = calculateCompatibility(profile, other)

    onMatch(report)
    setStatus("success")
  }

  return (
    <div className="flex flex-col gap-5">
      <GlassCard className="overflow-hidden p-5">
        <div className="aspect-square w-full overflow-hidden rounded-2xl">
          <QRScanner
            onScan={handleScan}
            constraints={{ facingMode: "environment" }}
            styles={{
              container: {
                width: "100%",
                height: "100%",
              },
              video: {
                width: "100%",
                height: "100%",
              },
            }}
          />
        </div>

        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">
            QR kodu okunamadı.
          </p>
        )}

        {status === "success" && (
          <p className="mt-4 text-sm text-green-400">
            QR kodu başarıyla okundu!
          </p>
        )}

        {status === "idle" && (
          <p className="mt-4 text-sm text-slate-400">
            Diğer kişinin AstroSync QR kodunu kameraya göster.
          </p>
        )}
      </GlassCard>
      <ManuelScanner
  profile={profile}
  onMatch={onMatch}
/>
    </div>
  )
}

export default function AstroSyncApp() {
  const [profile, setProfile] = useState<UserProfile | null>(() => null)
  const [tab, setTab] = useState<Tab>('profile')
  const [report, setReport] = useState<CompatibilityReport | null>(null)
  const [editing, setEditing] = useState(false)
  const nav = [{ id: 'profile' as Tab, label: 'Profile', icon: UserRound }, { id: 'scan' as Tab, label: 'Scan QR', icon: ScanLine }, { id: 'history' as Tab, label: 'History', icon: History }]
  const content = useMemo(() => { if (!profile || editing) return <ProfileForm onComplete={(next) => { setProfile(next); setEditing(false) }} />; if (tab === 'scan') return report ? <Report report={report} /> : <Scanner profile={profile} onMatch={(next) => setReport(next)} />; if (tab === 'history') return <GlassCard className="p-6 text-center"><History className="mx-auto size-10 text-slate-600" /><h2 className="mt-4 text-lg font-medium text-white">Your match history</h2><p className="mt-2 text-sm leading-6 text-slate-500">Scan a profile to start building your cosmic story.</p></GlassCard>; return <ProfileCard profile={profile} onEdit={() => setEditing(true)} /> }, [profile, editing, tab, report])
  return <main className="min-h-screen overflow-x-hidden bg-[#070619] text-white"><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(124,58,237,.28),transparent_42%),radial-gradient(circle_at_100%_45%,rgba(34,211,238,.08),transparent_30%)]" /><div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 pb-28 pt-8"><header className="mb-8 flex items-center justify-between"><div><div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-600 shadow-[0_0_20px_rgba(192,132,252,.35)]"><Sparkles className="size-4 text-white" /></div><span className="text-lg font-semibold tracking-tight">AstroSync</span></div><p className="mt-2 pl-10 text-xs text-slate-500">Discover your cosmic connection</p></div><div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs text-emerald-200">{profile ? 'Profile active' : 'New journey'}</div></header><AnimatePresence mode="wait"><motion.section key={`${tab}-${editing}-${Boolean(report)}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .2 }}>{content}</motion.section></AnimatePresence><nav className="fixed bottom-4 left-1/2 z-10 flex w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 bg-[#11102a]/90 p-1.5 shadow-2xl backdrop-blur-xl">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setTab(id); if (id !== 'scan') setReport(null) }} className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] transition ${tab === id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Icon className="size-4" /><span>{label}</span></button>)}</nav></div></main>
}
