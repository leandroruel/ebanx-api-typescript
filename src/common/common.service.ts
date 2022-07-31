import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'
import { Response } from 'express'

@Injectable()
export class CommonService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Reseta o estado da aplicação
   * @param {Response} response o response do express
   * @returns {Promise<Response<any>>} resposta da requisição se OK ou erro
   */
  async resetState(response: Response): Promise<Response<any>> {
    try {
      await this.prismaService.balance.deleteMany({})
      await this.prismaService.account.deleteMany({})

      return response.status(HttpStatus.OK).json('OK')
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error)
    }
  }
}
