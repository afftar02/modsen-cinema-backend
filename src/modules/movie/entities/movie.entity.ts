import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from '../../review/entities';
import { Country } from '../../country/entities';
import { Actor } from '../../actor/entities';
import { Genre } from '../../genre/entities';
import { Poster } from '../../poster/entities';
import { Trailer } from '../../trailer/entities';
import { Session } from '../../session/entities';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 'English title',
  })
  title_en: string;

  @Column({
    default: 'Russian title',
  })
  title_ru: string;

  @Column({
    default: 'English description',
  })
  description_en: string;

  @Column({
    default: 'Russian description',
  })
  description_ru: string;

  @Column({ type: 'real', nullable: true })
  rating: number;

  @Column()
  ageRestriction: number;

  @Column()
  quality: string;

  @Column({ nullable: true })
  start: Date;

  @Column()
  author: string;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @ManyToOne(() => Country, (country) => country.movies, {
    onDelete: 'SET NULL',
  })
  country: Country;

  @ManyToMany(() => Actor, (actor) => actor.movies)
  @JoinTable()
  actors: Actor[];

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToOne(() => Poster, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  poster: Poster;

  @OneToOne(() => Trailer, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  trailer: Trailer;

  @OneToMany(() => Session, (session) => session.movie)
  sessions: Session[];
}
