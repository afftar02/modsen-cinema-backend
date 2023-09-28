import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private repository: Repository<Ticket>,
  ) {}

  create(dto: CreateTicketDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const ticket = await this.repository.findOne({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto) {
    const ticket = await this.repository.findOneBy({ id });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const ticket = await this.repository.findOne({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return this.repository.delete(id);
  }
}
