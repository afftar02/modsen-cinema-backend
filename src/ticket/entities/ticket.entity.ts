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

  @Column()
  isPaid: boolean;

  @Column()
  isVisited: boolean;

  @OneToMany(() => Seat, (seat) => seat.ticket)
  seats: Seat[];

  @ManyToOne(() => Person, (person) => person.tickets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  person: Person;
}
