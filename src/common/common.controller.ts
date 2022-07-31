import { Controller, Post, Res } from '@nestjs/common'
import { CommonService } from './common.service'
import { Response } from 'express'

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('reset')
  reset(@Res() response: Response): Promise<Response<string>> {
    return this.commonService.resetState(response)
  }
}
