import { UserProfile } from './zodiac'

const PROFILE_STORAGE_KEY = 'astrosync_profile'

export function saveProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  }
}

export function getProfile(): UserProfile | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
  if (!stored) {
    return null
  }
  
  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse stored profile:', error)
    return null
  }
}

export function clearProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
  }
}

export function encodeProfile(profile: UserProfile): string {
  return btoa(JSON.stringify(profile))
}

export function decodeProfile(encoded: string): UserProfile | null {
  try {
    return JSON.parse(atob(encoded))
  } catch (error) {
    console.error('Failed to decode profile:', error)
    return null
  }
}
