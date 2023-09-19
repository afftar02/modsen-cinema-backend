import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private repository: Repository<Review>,
    @Inject(MovieService)
    private movieService: MovieService,
  ) {}

  async create(dto: CreateReviewDto) {
    const review = this.repository.create(dto);

    review.movie = await this.movieService.findOne(dto.movieId);

    return this.repository.save(review);
  }

  findAll() {
    return this.repository.find({
      relations: {
        movie: true,
      },
      select: {
        movie: {
          id: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const review = await this.repository.findOne({
      where: { id },
      relations: {
        movie: true,
      },
      select: {
        movie: {
          id: true,
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: number, dto: UpdateReviewDto) {
    const review = await this.repository.findOneBy({ id });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const updateReview = this.repository.create(dto);

    if (dto.movieId) {
      updateReview.movie = await this.movieService.findOne(dto.movieId);
    }

    return this.repository.update(id, updateReview);
  }

  async remove(id: number) {
    const review = await this.repository.findOneBy({ id });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.repository.delete(id);
  }
}
