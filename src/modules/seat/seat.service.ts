import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatDto, UpdateSeatDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { SessionService } from '../session/session.service';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private repository: Repository<Seat>,
    private sessionService: SessionService,
    private dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  async checkExistingSeat(
    sessionId: number,
    dto: CreateSeatDto | UpdateSeatDto,
  ) {
    const sessionSeats = await this.findSessionSeats(sessionId);

    sessionSeats.forEach((seat) => {
      if (dto.number === seat.number && dto.row === seat.row) {
        const badRequestException = new BadRequestException(
          'Seat with this number and row is already exists in current session!',
        );

        this.logger.error(
          'Seat is already exists in current session',
          badRequestException.stack,
        );

        throw badRequestException;
      }
    });
  }

  async create(
    sessionId: number,
    dto: CreateSeatDto,
    queryRunner?: QueryRunner,
  ) {
    await this.checkExistingSeat(sessionId, dto);

    const seat = this.repository.create(dto);

    seat.session = await this.sessionService.findOne(sessionId);

    if (queryRunner) {
      return queryRunner.manager.save(seat);
    } else {
      return this.repository.save(seat);
    }
  }

  async generateDefault(sessionId: number, price: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const seats = [];
      const rowsNumber = 9;

      for (let i = 0; i < rowsNumber; i++) {
        const rowWidth = i === 0 || i === rowsNumber - 1 ? 6 : 8;

        for (let j = 0; j < rowWidth; j++) {
          const seat = new CreateSeatDto();

          seat.row = i + 1;
          seat.number = j + 1;
          seat.price = price;

          const { session, ...createdSeat } = await this.create(
            sessionId,
            seat,
            queryRunner,
          );
          seats.push(createdSeat);
        }
      }

      await queryRunner.commitTransaction();

      return seats;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Unable to generate seats', err.stack);
      throw new BadRequestException('Unable to generate default seats');
    } finally {
      await queryRunner.release();
    }
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

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        session: true,
        ticket: true,
      },
      select: {
        ticket: {
          id: true,
        },
      },
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
      const notFoundException = new NotFoundException('Seat not found');

      this.logger.error('Unable to find seat', notFoundException.stack);

      throw notFoundException;
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
      const notFoundException = new NotFoundException('Seat not found');

      this.logger.error('Unable to find seat', notFoundException.stack);

      throw notFoundException;
    }

    if (seat.ticket) {
      const conflictException = new ConflictException(
        'Seat with ticket cannot be deleted!',
      );

      this.logger.error(
        'Unable to delete seat with not-null ticket',
        conflictException.stack,
      );

      throw conflictException;
    }

    return this.repository.delete(id);
  }
}
