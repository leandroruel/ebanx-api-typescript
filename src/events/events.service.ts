import { HttpStatus, Injectable } from '@nestjs/common'
import { AccountsService } from '@src/accounts/accounts.service'
import {
  DESTINATION_ACCOUNT_ALREADY_EXISTS,
  EVENT_NOT_SUPPORTED
} from '@src/constants'
import { DepositEvent, Event, EventResponse, EventType } from '@src/interfaces'
import { Response } from 'express'

@Injectable()
export class EventService {
  constructor(private accountService: AccountsService) {}

  /**
   *
   * @param {Response} response the response object
   * @param {Event} data
   * @returns {Promise<Response<EventResponse>>}
   */
  async accountEvent(
    response: Response,
    data: Event
  ): Promise<Response<EventResponse>> {
    if (data.type.toUpperCase() === EventType.DEPOSIT) {
      return this.depositEvent(response, data)
    }

    return response.status(HttpStatus.BAD_REQUEST).send(EVENT_NOT_SUPPORTED)
  }

  /**
   * Create a new account with a balance
   */
  async depositEvent(
    response: Response,
    data: Event
  ): Promise<Response<DepositEvent>> {
    const { amount, destination } = data
    const accountExists = await this.accountExists(destination)

    if (accountExists) {
      //get the actual account before updating it
      const account = await this.accountService.getAccount(destination)

      // update the account balance
      const { id, balance } = await this.accountService.update({
        id: destination,
        balance: Number(account.balance) + Number(amount)
      })

      return response.status(HttpStatus.CREATED).json({
        destination: {
          id,
          balance
        }
      })
    }

    const { id, balance } = await this.accountService.create({
      id: Number(destination),
      balance: Number(amount)
    })

    if (id) {
      return response
        .status(HttpStatus.CREATED)
        .json({ destination: { id: id, balance } })
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
