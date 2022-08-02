import { HttpStatus, Injectable } from '@nestjs/common'
import { AccountsService } from '@src/accounts/accounts.service'
import {
  DESTINATION_ACCOUNT_ALREADY_EXISTS,
  EVENT_NOT_SUPPORTED
} from '@src/constants'
import { Event, EventType } from '@src/interfaces'
import { Response } from 'express'

@Injectable()
export class EventService {
  constructor(private accountService: AccountsService) {}

  async accountEvent(response: Response, data: Event) {
    if (data.type === EventType.DEPOSIT) {
      return this.createAccountWithBalance(response, data)
    }

    return response.status(400).send(EVENT_NOT_SUPPORTED)
  }

  /**
   * Create a new account with a balance
   */
  async createAccountWithBalance(response: Response, data: Event) {
    const { amount, destination } = data
    const accountExists = await this.accountExists(destination)

    if (accountExists) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send(DESTINATION_ACCOUNT_ALREADY_EXISTS)
    }

    const { id, balance } = await this.accountService.create({
      id: Number(destination),
      balance: Number(amount)
    })

    if (id) {
      return response.status(201).send({
        destination: {
          id: id,
          balance
        }
      })
    }
  }

  /**
   * Check if an account exists
   * @param {number} id the id of the account
   * @returns {Promise<boolean>} true if the account exists, false otherwise
   */
  async accountExists(id: number): Promise<boolean> {
    return (await this.accountService.getAccount(id)) !== null
  }
}
