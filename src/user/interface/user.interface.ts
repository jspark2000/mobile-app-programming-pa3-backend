export interface User {
  id: string
  email: string
  profileUrl?: string
  sex?: 'Male' | 'Female' | 'Other'
  major?: string
  studentNo?: string
  nickname?: string
}
