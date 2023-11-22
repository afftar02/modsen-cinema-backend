import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { LANGUAGES } from '../constants';

@Injectable()
export class LanguageValidationPipe implements PipeTransform {
  transform(value: string) {
    if (!LANGUAGES.includes(value)) {
      throw new BadRequestException('Supported languages: ' + LANGUAGES);
    }
    return value;
  }
}
