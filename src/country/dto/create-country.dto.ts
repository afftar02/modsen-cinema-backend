import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCountryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Country title cannot be empty' })
  @Transform(({ value }) => value.toLowerCase())
  title: string;
}
