import { UserRole } from './enums'

export interface User {
  id: string
  email: string
  phone?: string
  displayName: string
  avatarUrl?: string
  role: UserRole
  loginProvider: 'google' | 'line'
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  userId: string
  bio?: string
  address?: string
  preferredLocale: 'th' | 'en'
}
