import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Surname cannot be empty' })
  surname: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 4,
    maxLength: 16,
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(4, 16, {
    message: 'Password length must be from 4 to 16 characters',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsIn(['MALE', 'FEMALE'], {
    message: 'Gender must be equal to MALE or FEMALE',
  })
  gender: string;
}
