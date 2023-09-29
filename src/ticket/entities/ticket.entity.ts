import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from '../../seat/entities/seat.entity';

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
}
