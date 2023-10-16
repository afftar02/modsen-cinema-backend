import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'English title cannot be empty' })
  title_en: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Russian title cannot be empty' })
  title_ru: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'English description cannot be empty' })
  description_en: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Russian description cannot be empty' })
  description_ru: string;

  @ApiProperty({
    minimum: 0,
    maximum: 18,
  })
  @IsNotEmpty({ message: 'Please, add age restriction' })
  @Min(0, { message: 'Age restriction must be equal or greater than 0' })
  @Max(18, { message: 'Age restriction must be equal or less than 18' })
  ageRestriction: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please, add quality of movie' })
  quality: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'Movie start date is incorrect' })
  start: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Movie author cannot be empty' })
  author: string;

  @ApiProperty()
  @IsOptional()
  countryId: number;

  @ApiProperty({
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  actorIds: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  genreIds: number[];

  @ApiProperty()
  @IsOptional()
  posterId: number;

  @ApiProperty()
  @IsOptional()
  trailerId: number;
}
