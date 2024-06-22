export interface Game {
  id: string
  hostId: string
  date: string
  type: 'Duo' | 'In-House'
  participantId?: string
}
