import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private repository: Repository<Review>,
  ) {}

  create(dto: CreateReviewDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const review = await this.repository.findOneBy({ id });

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

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const review = await this.repository.findOneBy({ id });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.repository.delete(id);
  }
}
