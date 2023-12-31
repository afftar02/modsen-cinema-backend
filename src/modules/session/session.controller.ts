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
import { SessionService } from './session.service';
import { CreateSessionDto, UpdateSessionDto } from './dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('movie/:movieId/session')
  create(@Param('movieId') movieId: string, @Body() dto: CreateSessionDto) {
    return this.sessionService.create(+movieId, dto);
  }

  @Get('movie/:movieId/sessions')
  @ApiQuery({ name: 'date', required: false })
  findMovieSessions(
    @Param('movieId') movieId: string,
    @Query('date') date?: Date,
  ) {
    return this.sessionService.findMovieSessions(+movieId, date);
  }

  @Patch('session/:id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(+id, updateSessionDto);
  }

  @Delete('session/:id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(+id);
  }
}
