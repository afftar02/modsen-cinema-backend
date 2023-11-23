import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from '../../movie/entities';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  title: string;

  @OneToMany(() => Movie, (movie) => movie.country)
  movies: Movie[];
}
