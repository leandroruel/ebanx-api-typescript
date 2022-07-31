/**
 * Enum de tipos de evento que ocorrem na conta
 */
enum EventType {
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT'
}

/**
 * Representação de um evento de uma conta bancária
 */
export interface Event {
  type: EventType
  destination?: number
  origin?: number
  amount: number
}
