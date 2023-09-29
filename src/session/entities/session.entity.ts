import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { Seat } from '../../seat/entities/seat.entity';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  format: string;

  @ManyToOne(() => Movie, (movie) => movie.sessions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  movie: Movie;

  @OneToMany(() => Seat, (seat) => seat.session)
  seats: Seat[];
}
