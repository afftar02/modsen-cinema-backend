import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post(':sessionId/seat')
  create(@Param('sessionId') sessionId: string, @Body() dto: CreateSeatDto) {
    return this.seatService.create(+sessionId, dto);
  }

  @Post(':sessionId/defaultSeats')
  @ApiQuery({ name: 'price' })
  generateDefault(
    @Param('sessionId') sessionId: string,
    @Query('price') price: number,
  ) {
    return this.seatService.generateDefault(+sessionId, price);
  }

  @Get(':sessionId/seats')
  findSessionSeats(@Param('sessionId') sessionId: string) {
    return this.seatService.findSessionSeats(+sessionId);
  }

  @Patch('seat/:id')
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatService.update(+id, updateSeatDto);
  }

  @Delete('seat/:id')
  remove(@Param('id') id: string) {
    return this.seatService.remove(+id);
  }
}
