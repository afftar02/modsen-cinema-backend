import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Entity('person')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: string;

  @OneToMany(() => Ticket, (ticket) => ticket.person)
  tickets: Ticket[];
}
