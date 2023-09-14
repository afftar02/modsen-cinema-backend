import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Country title cannot be empty' })
  title: string;
}
