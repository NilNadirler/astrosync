'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Clock3, MapPin, Sparkles, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { calculateApproximateMoonSign, calculateApproximateRisingSign, calculateSunSign, getElementFromSign, UserProfile } from '@/lib/zodiac'

interface ProfileFormProps {
  onComplete: (profile: UserProfile) => void
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [location, setLocation] = useState('')
  const [exactTimeUnknown, setExactTimeUnknown] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !dob || !location.trim()) {
      setError('Please complete your name, birth date, and location.')
      return
    }

    const sunSign = calculateSunSign(dob)
    const moonSign = calculateApproximateMoonSign(dob)
    const risingSign = calculateApproximateRisingSign(dob, exactTimeUnknown ? undefined : tob)
    onComplete({
      name: name.trim(),
      dob,
      tob: exactTimeUnknown ? undefined : tob,
      birthLocation: location.trim(),
      sunSign,
      moonSign,
      risingSign,
      element: getElementFromSign(sunSign),
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-white/10 bg-white/[0.06] shadow-2xl shadow-purple-950/20 backdrop-blur-xl">
        <CardHeader className="gap-3 border-b border-white/10 pb-6">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-300/10 text-purple-200">
            <Sparkles data-icon="inline-start" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Create your cosmic ID</CardTitle>
            <CardDescription className="mt-2 text-slate-400">Your stars are already aligned. Let's map them.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-slate-300">Your name</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Luna Moon" className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="dob" className="text-slate-300">Date of birth</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="border-white/10 bg-white/5 pl-10 text-white [color-scheme:dark]" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="tob" className="text-slate-300">Time of birth <span className="text-slate-500">(optional)</span></Label>
                <div className="relative">
                  <Clock3 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input id="tob" type="time" value={tob} onChange={(e) => setTob(e.target.value)} disabled={exactTimeUnknown} className="border-white/10 bg-white/5 pl-10 text-white [color-scheme:dark]" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Label htmlFor="unknown-time" className="cursor-pointer text-sm text-slate-300">Exact time unknown</Label>
              <Switch id="unknown-time" checked={exactTimeUnknown} onCheckedChange={setExactTimeUnknown} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location" className="text-slate-300">Birth location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600" />
              </div>
            </div>
            {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
            <Button type="submit" className="mt-1 h-12 w-full bg-purple-400 font-semibold text-slate-950 shadow-lg shadow-purple-500/20 hover:bg-purple-300">
              Reveal my chart <ArrowRight data-icon="inline-end" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ProfileFormDemo() { return null }

export default ProfileForm
