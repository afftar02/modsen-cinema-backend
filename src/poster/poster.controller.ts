import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { PosterService } from './poster.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../storage';
import { IMAGE_EXT, IMAGE_SIZE_LIMIT } from '../constants';

@Controller('poster')
@ApiTags('Poster')
export class PosterController {
  constructor(private readonly posterService: PosterService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      limits: {
        fileSize: IMAGE_SIZE_LIMIT,
      },
      fileFilter: (req: Request, file, cb) => {
        if (!IMAGE_EXT.includes(file.mimetype)) {
          const badRequestException = new BadRequestException(
            `Invalid file type`,
          );

          return cb(badRequestException, false);
        }

        return cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(@UploadedFile() file: Express.Multer.File) {
    return this.posterService.create(file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posterService.remove(+id);
  }
}
