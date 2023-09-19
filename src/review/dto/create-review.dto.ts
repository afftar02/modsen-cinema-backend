import { IsNotEmpty, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please, add an author of review' })
  author: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Review description cannot be empty' })
  description: string;

  @ApiProperty({
    minimum: 0,
    maximum: 10,
  })
  @Min(0, { message: 'Rating must be equal or greater than 0' })
  @Max(10, { message: 'Rating must be equal or less than 10' })
  rating: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Movie id cannot be empty' })
  movieId: number;
}
