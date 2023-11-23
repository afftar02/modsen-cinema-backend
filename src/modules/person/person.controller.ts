import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { UpdatePersonDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { UserId } from '../../shared/common/decorators';

@Controller('person')
@ApiTags('Person')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  async findOne(@UserId() userId: number) {
    const { password, ...person } = await this.personService.findOne(userId);

    return person;
  }

  @Patch()
  async update(
    @UserId() userId: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    const { password, ...person } = await this.personService.update(
      userId,
      updatePersonDto,
    );

    return person;
  }

  @Delete()
  remove(@UserId() userId: number) {
    return this.personService.remove(userId);
  }
}
