import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'
import { Balance, Prisma } from '@prisma/client'
import { Response } from 'express'

@Injectable()
export class BalanceService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Adiciona saldo à uma conta co determinado id
   * @param data
   * @returns
   */
  async create(data: Prisma.BalanceCreateInput): Promise<Balance> {
    return this.prismaService.balance.create({ data })
  }

  /**
   * Retorna o saldo de uma conta com determinado id
   * @param {number} id o id da conta
   * @returns
   */
  async getBalance(id: number, response: Response): Promise<Response<number>> {
    try {
      const {
        balance: { amount }
      } = await this.prismaService.account.findFirst({
        where: { id: Number(id) },
        include: {
          balance: {
            select: { amount: true }
          }
        }
      })

      return response.status(HttpStatus.OK).json(amount)
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json(0)
    }
  }
}
