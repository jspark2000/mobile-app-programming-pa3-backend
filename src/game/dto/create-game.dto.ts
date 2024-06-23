import { IsString } from 'class-validator'

export class CreateGameDTO {
  @IsString()
  date: string

  @IsString()
  type: 'Duo' | 'In-House'
}
