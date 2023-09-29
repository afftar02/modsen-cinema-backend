import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { In, Repository } from 'typeorm';
import { SessionService } from '../session/session.service';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private repository: Repository<Seat>,
    @Inject(SessionService)
    private sessionService: SessionService,
  ) {}

  async checkExistingSeat(
    sessionId: number,
    dto: CreateSeatDto | UpdateSeatDto,
  ) {
    const sessionSeats = await this.findSessionSeats(sessionId);

    sessionSeats.forEach((seat) => {
      if (dto.number === seat.number && dto.row === seat.row) {
        throw new BadRequestException(
          'Seat with this number and row is already exists in current session!',
        );
      }
    });
  }

  async create(sessionId: number, dto: CreateSeatDto) {
    await this.checkExistingSeat(sessionId, dto);

    const seat = this.repository.create(dto);

    seat.session = await this.sessionService.findOne(sessionId);

    return this.repository.save(seat);
  }

  async findSessionSeats(sessionId: number) {
    await this.sessionService.findOne(sessionId);

    return this.repository.find({
      where: {
        session: {
          id: sessionId,
        },
      },
      relations: {
        ticket: true,
      },
      select: {
        ticket: {
          id: true,
        },
      },
    });
  }

  findByIds(ids: number[]) {
    return this.repository.findBy({
      id: In(ids),
    });
  }

  async update(id: number, dto: UpdateSeatDto) {
    const seat = await this.repository.findOne({
      where: { id },
      relations: {
        session: true,
      },
    });

    if (!seat) {
      throw new NotFoundException('Seat not found');
    }

    await this.checkExistingSeat(seat.session.id, dto);

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const seat = await this.repository.findOne({
      where: { id },
      relations: {
        ticket: true,
      },
    });

    if (!seat) {
      throw new NotFoundException('Seat not found');
    }

    if (seat.ticket) {
      throw new ConflictException('Seat with ticket cannot be deleted!');
    }

    return this.repository.delete(id);
  }
}
