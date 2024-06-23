import { IsString } from 'class-validator'

export class UpdateUserDTO {
  @IsString()
  nickname: string

  @IsString()
  major: string

  @IsString()
  sex: 'Male' | 'Female' | 'Other'
}
