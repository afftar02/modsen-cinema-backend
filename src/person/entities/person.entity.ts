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
import { Token } from '../../token/entities/token.entity';

@Entity('person')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: string;

  @OneToMany(() => Ticket, (ticket) => ticket.person)
  tickets: Ticket[];

  @OneToOne(() => Avatar, (avatar) => avatar.person, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: Avatar;

  @OneToOne(() => Token, (token) => token.person, {
    nullable: true,
  })
  token: Token;
}
