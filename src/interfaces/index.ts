import { Accounts } from '@prisma/client'

/**
 * Enum de tipos de evento que ocorrem na conta
 */
export enum EventType {
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

/**
 * Representação de uma resposta de um depósito em uma conta bancária.
 */
export interface DepositEvent {
  destination: Accounts
}

/**
 * Representação de uma resposta de um saque em uma conta bancária.
 */
export interface WithdrawEvent {
  origin: Accounts
}

/**
 * Representação de uma resposta de uma transferência em uma conta bancária.
 */
export interface TransferEvent {
  origin: Accounts
  destination: Accounts
}
