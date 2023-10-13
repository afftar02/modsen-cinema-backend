import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ApiTags } from '@nestjs/swagger';
import { ActorCapitalizationPipe } from './pipes/actor-capitalization.pipe';

@Controller()
@ApiTags('Actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post('actor')
  create(@Body(ActorCapitalizationPipe) dto: CreateActorDto) {
    return this.actorService.create(dto);
  }

  @Get('actors')
  findAll() {
    return this.actorService.findAll();
  }

  @Get('actor/:id')
  findOne(@Param('id') id: string) {
    return this.actorService.findOne(+id);
  }

  @Patch('actor/:id')
  update(
    @Param('id') id: string,
    @Body(ActorCapitalizationPipe) updateActorDto: UpdateActorDto,
  ) {
    return this.actorService.update(+id, updateActorDto);
  }

  @Delete('actor/:id')
  remove(@Param('id') id: string) {
    return this.actorService.remove(+id);
  }
}
