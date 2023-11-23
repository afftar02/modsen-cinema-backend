import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../../shared/common/storage';
import { IMAGE_EXT, IMAGE_SIZE_LIMIT } from '../../shared/common/constants';
import { JwtAuthGuard } from '../auth/guards';
import { UserId } from '../../shared/common/decorators';

@Controller('avatar')
@ApiTags('Avatar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

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
  create(@UserId() userId: number, @UploadedFile() file: Express.Multer.File) {
    return this.avatarService.create(userId, file);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.avatarService.remove(userId, +id);
  }
}
