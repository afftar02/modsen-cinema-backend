import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { Review } from './entities';
import { MovieService } from '../movie/movie.service';
import { DataSource, Repository } from 'typeorm';
import { Movie } from '../movie/entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let movieService: MovieService;
  let reviewRepository: Repository<Review>;

  const review: Review = {
    id: 1,
    author: 'Author',
    rating: 4,
    description: 'Good movie',
    movie: null,
  };
  const updateResult = { generatedMaps: [], raw: [], affected: 1 };
  const deleteResult = { raw: [], affected: 1 };
  const mockDataSource = {
    createQueryRunner: () => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        save: jest.fn().mockResolvedValue(review),
        update: jest.fn().mockResolvedValue(updateResult),
        delete: jest.fn().mockResolvedValue(deleteResult),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    }),
  };

  const mockMovieService = {
    findOne: jest.fn(),
    updateMovieRating: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useClass: Repository,
        },
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
    movieService = module.get<MovieService>(MovieService);
    reviewRepository = module.get(getRepositoryToken(Review));
  });

  it('should be defined', () => {
    expect(reviewService).toBeDefined();
  });

  describe('create', () => {
    it('should create a review', async () => {
      const movieId = 1;
      const reviewDto: CreateReviewDto = {
        author: 'Author',
        rating: 4,
        description: 'Good movie',
      };
      jest.spyOn(movieService, 'findOne').mockResolvedValue(null);
      jest.spyOn(reviewRepository, 'create').mockReturnValue(review);

      const result = await reviewService.create(movieId, reviewDto);

      expect(result).toBe(review);
    });
  });

  describe('findByMovieId', () => {
    it('should find reviews by movie id', async () => {
      const movieId = 1;
      const reviews = [new Review(), new Review()];
      jest.spyOn(movieService, 'findOne').mockResolvedValue(new Movie());
      jest.spyOn(reviewRepository, 'find').mockResolvedValue(reviews);

      const result = await reviewService.findByMovieId(movieId);

      expect(result).toEqual(reviews);
    });
  });

  describe('findOne', () => {
    it('should return a review', async () => {
      const reviewId = 1;
      const review = new Review();
      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(review);

      const result = await reviewService.findOne(reviewId);

      expect(result).toBe(review);
    });

    it('should throw NotFoundException if review is not found', async () => {
      const reviewId = 1;
      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(undefined);

      try {
        await reviewService.findOne(reviewId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Review not found');
      }
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const reviewId = 1;
      const reviewDto: UpdateReviewDto = {
        rating: 5,
      };
      const review = {
        id: 1,
        author: 'Author',
        rating: 4,
        description: 'Good movie',
        movie: new Movie(),
      };
      jest.spyOn(reviewService, 'findOne').mockResolvedValue(review);

      const result = await reviewService.update(reviewId, reviewDto);

      expect(result).toBe(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const reviewId = 1;
      const review = {
        id: 1,
        author: 'Author',
        rating: 4,
        description: 'Good movie',
        movie: new Movie(),
      };
      jest.spyOn(reviewService, 'findOne').mockResolvedValue(review);

      const result = await reviewService.remove(reviewId);

      expect(result).toBe(deleteResult);
    });
  });
});
