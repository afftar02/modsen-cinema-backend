import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto, FindMovieDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Movie } from './entities';
import { CountryService } from '../country/country.service';
import { ActorService } from '../actor/actor.service';
import { GenreService } from '../genre/genre.service';
import { PosterService } from '../poster/poster.service';
import { TrailerService } from '../trailer/trailer.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private repository: Repository<Movie>,
    private countryService: CountryService,
    private actorService: ActorService,
    private genreService: GenreService,
    private posterService: PosterService,
    private trailerService: TrailerService,
    private readonly logger: Logger,
  ) {}

  async bindRelations(movie: Movie, dto: CreateMovieDto | UpdateMovieDto) {
    if (dto.countryId) {
      movie.country = await this.countryService.findOne(dto.countryId);
    }
    if (dto.actorIds) {
      movie.actors = await this.actorService.findByIds(dto.actorIds);
    }
    if (dto.genreIds) {
      movie.genres = await this.genreService.findByIds(dto.genreIds);
    }
    if (dto.posterId) {
      movie.poster = await this.posterService.findOne(dto.posterId);
    }
    if (dto.trailerId) {
      movie.trailer = await this.trailerService.findOne(dto.trailerId);
    }
    if (dto.title) {
      for (const translation in dto.title) {
        movie[`title_${translation}`] = dto.title[translation];
      }
    }
    if (dto.description) {
      for (const translation in dto.description) {
        movie[`description_${translation}`] = dto.description[translation];
      }
    }
  }

  async create(dto: CreateMovieDto) {
    const movie = this.repository.create(dto);

    await this.bindRelations(movie, dto);

    return this.repository.save(movie);
  }

  async findAllLocalized(language: string) {
    const movies = await this.repository.find({
      relations: {
        genres: true,
        poster: true,
      },
    });

    return movies.map((movie) => new FindMovieDto(movie, language));
  }

  async findOne(id: number) {
    const movie = await this.repository.findOne({
      where: { id },
      relations: {
        reviews: true,
        country: true,
        actors: true,
        genres: true,
        poster: true,
        trailer: {
          preview: true,
        },
      },
    });

    if (!movie) {
      const notFoundException = new NotFoundException('Movie not found');

      this.logger.error('Unable to find movie', notFoundException.stack);

      throw notFoundException;
    }

    return movie;
  }

  async findOneLocalized(id: number, language: string) {
    const movie = await this.findOne(id);

    return new FindMovieDto(movie, language);
  }

  async update(id: number, dto: UpdateMovieDto) {
    const movie = await this.findOne(id);

    const updateMovie = {
      ...movie,
      ...this.repository.create(dto),
    };

    await this.bindRelations(updateMovie, dto);

    if (dto.posterId && movie.poster) {
      await this.posterService.remove(movie.poster.id);
    }
    if (dto.trailerId && movie.trailer) {
      await this.trailerService.remove(movie.trailer.id);
    }

    return this.repository.save(updateMovie);
  }

  async remove(id: number) {
    const movie = await this.findOne(id);

    if (movie.poster) {
      await this.posterService.remove(movie.poster.id);
    }
    if (movie.trailer) {
      await this.trailerService.remove(movie.trailer.id);
    }

    return this.repository.delete(id);
  }

  async updateMovieRating(movieId: number, queryRunner: QueryRunner) {
    const movie = await queryRunner.manager.findOne(Movie, {
      where: { id: movieId },
      relations: {
        reviews: true,
      },
    });

    const averageRating =
      movie.reviews.reduce(
        (ratingSum, currentReview) => ratingSum + currentReview.rating,
        0,
      ) / movie.reviews.length;

    movie.rating = Number(averageRating.toFixed(1));

    return queryRunner.manager.save(movie);
  }
}
