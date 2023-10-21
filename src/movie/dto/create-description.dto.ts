import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDescriptionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'English description cannot be empty' })
  en: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Russian description cannot be empty' })
  ru: string;
}
