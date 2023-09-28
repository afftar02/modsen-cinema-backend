import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('ticket')
  create(@Body() dto: CreateTicketDto) {
    return this.ticketService.create(dto);
  }

  @Get('tickets')
  findAll() {
    return this.ticketService.findAll();
  }

  @Get('ticket/:id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Patch('ticket/:id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete('ticket/:id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
