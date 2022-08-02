import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator'
export class CreateAccountDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number

  @IsNumber()
  @IsNotEmpty()
  balance: number
}
