import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateActorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Surname cannot be empty' })
  @Transform(({ value }) => value.toLowerCase())
  surname: string;
}
