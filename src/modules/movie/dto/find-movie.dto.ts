import { Review } from 'src/modules/review/entities';
import { Country } from 'src/modules/country/entities';
import { Actor } from 'src/modules/actor/entities';
import { Genre } from 'src/modules/genre/entities';
import { Poster } from 'src/modules/poster/entities';
import { Trailer } from 'src/modules/trailer/entities';
import { Movie } from '../entities';

export class FindMovieDto {
  constructor(movie: Movie, language: string) {
    for (const key in movie) {
      if (key.startsWith('title')) {
        if (key.slice(-2) === language) {
          this.title = movie[key];
        }
      } else if (key.startsWith('description')) {
        if (key.slice(-2) === language) {
          this.description = movie[key];
        }
      } else {
        this[key] = movie[key];
      }
    }
  }

  id: number;

  title: string;

  description: string;

  rating: number;

  ageRestriction: number;

  quality: string;

  start: Date;

  author: string;

  reviews?: Review[];

  country?: Country;

  actors?: Actor[];

  genres?: Genre[];

  poster?: Poster;

  trailer?: Trailer;
}
