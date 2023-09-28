import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('session')
  create(@Body() dto: CreateSessionDto) {
    return this.sessionService.create(dto);
  }

  @Get('sessions')
  findAll() {
    return this.sessionService.findAll();
  }

  @Get('session/:id')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(+id);
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
