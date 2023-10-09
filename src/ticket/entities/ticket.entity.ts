import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seat } from '../../seat/entities/seat.entity';
import { Person } from '../../person/entities/person.entity';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false,
  })
  isPaid: boolean;

  @Column({
    default: false,
  })
  isVisited: boolean;

  @Column({
    default: false,
  })
  isMissed: boolean;

  @Column({
    default: 0,
  })
  discount: number;

  @OneToMany(() => Seat, (seat) => seat.ticket)
  seats: Seat[];

  @ManyToOne(() => Person, (person) => person.tickets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  person: Person;
}
