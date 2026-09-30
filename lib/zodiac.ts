// Zodiac sign calculations and compatibility engine

export interface UserProfile {
  name: string
  dob: string // YYYY-MM-DD
  tob?: string // HH:mm (24-hour format)
  birthLocation: string
  sunSign: string
  moonSign: string
  risingSign: string
  element: 'Fire' | 'Earth' | 'Air' | 'Water'
}

interface SignInfo {
  name: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
  element: 'Fire' | 'Earth' | 'Air' | 'Water'
}

const zodiacSigns: SignInfo[] = [
  { name: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: 'Earth' },
  { name: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: 'Air' },
  { name: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: 'Water' },
  { name: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: 'Fire' },
  { name: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: 'Earth' },
  { name: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, element: 'Air' },
  { name: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, element: 'Water' },
  { name: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: 'Fire' },
  { name: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: 'Earth' },
  { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, element: 'Air' },
  { name: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, element: 'Water' },
  { name: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, element: 'Fire' },
]

export function calculateSunSign(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number)
  
  for (const sign of zodiacSigns) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return sign.name
      }
    } else {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign.name
      }
    }
  }
  
  return 'Unknown'
}

export function getElementFromSign(sign: string): 'Fire' | 'Earth' | 'Air' | 'Water' {
  const signInfo = zodiacSigns.find(s => s.name === sign)
  return signInfo?.element || 'Air'
}

// Approximate moon sign based on day of month (simplified)
export function calculateApproximateMoonSign(dateString: string): string {
  const [, , day] = dateString.split('-').map(Number)
  const moonPhaseIndex = Math.floor(day / 2.5) % 12
  return zodiacSigns[moonPhaseIndex].name
}

// Approximate rising sign based on time of birth (simplified)
export function calculateApproximateRisingSign(dateString: string, timeString?: string): string {
  const [, month, day] = dateString.split('-').map(Number)
  let index = (month * day) % 12
  
  if (timeString) {
    const [hour] = timeString.split(':').map(Number)
    index = (index + hour) % 12
  }
  
  return zodiacSigns[index].name
}

export interface CompatibilityReport {
  totalScore: number
  sunHarmony: { score: number; description: string }
  elementalSynergy: { score: number; description: string }
  moonCompatibility: { score: number; description: string }
}

export function calculateCompatibility(profile1: UserProfile, profile2: UserProfile): CompatibilityReport {
  const sunHarmony = calculateSunHarmony(profile1.sunSign, profile2.sunSign)
  const elementalSynergy = calculateElementalSynergy(profile1.element, profile2.element)
  const moonCompatibility = calculateMoonCompatibility(profile1.moonSign, profile2.moonSign)
  
  const totalScore = Math.round((sunHarmony.score + elementalSynergy.score + moonCompatibility.score) / 3)
  
  return {
    totalScore,
    sunHarmony,
    elementalSynergy,
    moonCompatibility,
  }
}

function calculateSunHarmony(sun1: string, sun2: string): { score: number; description: string } {
  if (sun1 === sun2) {
    return { score: 90, description: 'Same sun sign – natural understanding and connection' }
  }
  
  const sign1 = zodiacSigns.find(s => s.name === sun1)
  const sign2 = zodiacSigns.find(s => s.name === sun2)
  
  if (!sign1 || !sign2) {
    return { score: 50, description: 'Compatible sun signs' }
  }
  
  if (sign1.element === sign2.element) {
    return { score: 80, description: 'Same element – strong resonance' }
  }
  
  // Compatible pairs: Fire+Air, Earth+Water
  if (
    (sign1.element === 'Fire' && sign2.element === 'Air') ||
    (sign1.element === 'Air' && sign2.element === 'Fire') ||
    (sign1.element === 'Earth' && sign2.element === 'Water') ||
    (sign1.element === 'Water' && sign2.element === 'Earth')
  ) {
    return { score: 70, description: 'Harmonious elements – balanced dynamics' }
  }
  
  return { score: 45, description: 'Challenging elements – growth potential' }
}

function calculateElementalSynergy(elem1: string, elem2: string): { score: number; description: string } {
  if (elem1 === elem2) {
    return { score: 85, description: `${elem1} energy strongly aligned` }
  }
  
  if (
    (elem1 === 'Fire' && elem2 === 'Air') ||
    (elem1 === 'Air' && elem2 === 'Fire') ||
    (elem1 === 'Earth' && elem2 === 'Water') ||
    (elem1 === 'Water' && elem2 === 'Earth')
  ) {
    return { score: 75, description: 'Complementary elements – natural flow' }
  }
  
  return { score: 40, description: 'Different elemental approaches – requires patience' }
}

function calculateMoonCompatibility(moon1: string, moon2: string): { score: number; description: string } {
  if (moon1 === moon2) {
    return { score: 88, description: 'Aligned emotional natures – deep understanding' }
  }
  
  const sign1 = zodiacSigns.find(s => s.name === moon1)
  const sign2 = zodiacSigns.find(s => s.name === moon2)
  
  if (!sign1 || !sign2) {
    return { score: 50, description: 'Emotional compatibility present' }
  }
  
  if (sign1.element === sign2.element) {
    return { score: 78, description: 'Harmonious emotional expressions' }
  }
  
  if (
    (sign1.element === 'Fire' && sign2.element === 'Air') ||
    (sign1.element === 'Air' && sign2.element === 'Fire') ||
    (sign1.element === 'Earth' && sign2.element === 'Water') ||
    (sign1.element === 'Water' && sign2.element === 'Earth')
  ) {
    return { score: 68, description: 'Compatible emotional needs' }
  }
  
  return { score: 42, description: 'Different emotional wavelengths – opportunity to grow' }
}
