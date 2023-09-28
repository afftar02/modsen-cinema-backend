import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isPaid: boolean;

  @Column()
  isVisited: boolean;
}
