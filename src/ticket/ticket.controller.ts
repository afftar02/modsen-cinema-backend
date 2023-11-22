import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../shared/common/decorators/user-id.decorator';
import { LanguageValidationPipe } from '../shared/common/pipes/language-validation.pipe';

@Controller()
@ApiTags('Ticket')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('ticket')
  create(@UserId() userId: number, @Body() dto: CreateTicketDto) {
    return this.ticketService.create(userId, dto);
  }

  @Get(':language/tickets')
  findByPersonId(
    @UserId() userId: number,
    @Param('language', LanguageValidationPipe) language: string,
  ) {
    return this.ticketService.findByPersonId(userId, language);
  }

  @Get(':language/ticket/:id')
  findOne(
    @UserId() userId: number,
    @Param('id') id: string,
    @Param('language', LanguageValidationPipe) language: string,
  ) {
    return this.ticketService.findOne(userId, +id, language);
  }

  @Patch('ticket/:id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(userId, +id, updateTicketDto);
  }

  @Delete('ticket/:id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.ticketService.remove(userId, +id);
  }
}
