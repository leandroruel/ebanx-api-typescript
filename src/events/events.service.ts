import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AccountsService } from '@src/accounts/accounts.service'
import {
  DESTINATION_ACCOUNT_NOT_EXISTS,
  EVENT_NOT_SUPPORTED,
  ORIGIN_ACCOUNT_NOT_EXISTS
} from '@src/constants'
import {
  DepositEvent,
  Event,
  EventResponse,
  EventType,
  TransferEvent,
  WithdrawEvent
} from '@src/interfaces'
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

    if (data.type.toUpperCase() === EventType.TRANSFER) {
      return this.tranferEvent(response, data)
    }

    if (data.type.toUpperCase() === EventType.WITHDRAW) {
      return this.withdrawEvent(response, data)
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

  async tranferEvent(
    response: Response,
    data: Event
  ): Promise<Response<TransferEvent>> {
    const { amount, destination, origin } = data
    const originAccountExists = await this.accountExists(origin)
    const destinationAccountExists = await this.accountExists(destination)

    if (!originAccountExists) {
      throw new HttpException(ORIGIN_ACCOUNT_NOT_EXISTS, HttpStatus.BAD_REQUEST)
    }

    if (!destinationAccountExists) {
      throw new HttpException(
        DESTINATION_ACCOUNT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST
      )
    }

    const originAccount = await this.accountService.transfer(
      origin,
      destination,
      Number(amount)
    )

    const destinationAccount = await this.accountService.getAccount(origin)

    return response.status(HttpStatus.CREATED).json({
      origin: {
        id: origin,
        balance: originAccount.balance
      },
      destination: {
        id: destination,
        balance: destinationAccount.balance
      }
    })
  }

  async withdrawEvent(
    response: Response,
    data: Event
  ): Promise<Response<WithdrawEvent>> {
    const { origin, amount } = data
    const accountExists = await this.accountExists(origin)

    if (!accountExists) {
      return response.status(HttpStatus.NOT_FOUND).send(String(0))
    }

    const { id, balance } = await this.accountService.withDraw(origin, amount)

    return response.status(HttpStatus.OK).json({
      origin: {
        id: id,
        balance: Number(balance)
      }
    })
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
