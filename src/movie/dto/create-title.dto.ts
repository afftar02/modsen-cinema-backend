import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTitleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'English title cannot be empty' })
  en: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Russian title cannot be empty' })
  ru: string;
}
