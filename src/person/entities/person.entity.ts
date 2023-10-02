import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { Avatar } from '../../avatar/entities/avatar.entity';

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

  @OneToOne(() => Avatar, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: Avatar;
}
