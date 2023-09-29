import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Entity('seat')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  price: number;

  @Column()
  number: number;

  @Column()
  row: number;

  @ManyToOne(() => Session, (session) => session.seats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  session: Session;

  @ManyToOne(() => Ticket, (ticket) => ticket.seats, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  ticket: Ticket;
}
