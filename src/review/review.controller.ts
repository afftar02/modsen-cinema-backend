import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':movieId/review')
  create(@Param('movieId') movieId: string, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(+movieId, dto);
  }

  @Get(':movieId/reviews')
  findByMovieId(@Param('movieId') movieId: string) {
    return this.reviewService.findByMovieId(+movieId);
  }

  @Get('review/:id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch('review/:id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete('review/:id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
