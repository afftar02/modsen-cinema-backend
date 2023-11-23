import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto, UpdateCountryDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post('country')
  create(@Body() dto: CreateCountryDto) {
    return this.countryService.create(dto);
  }

  @Get('countries')
  findAll() {
    return this.countryService.findAll();
  }

  @Get('country/:id')
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(+id);
  }

  @Patch('country/:id')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete('country/:id')
  remove(@Param('id') id: string) {
    return this.countryService.remove(+id);
  }
}
