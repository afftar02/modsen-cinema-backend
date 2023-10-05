import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../storage';
import { IMAGE_SIZE_LIMIT } from '../constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../decorators/user-id.decorator';

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
    return this.avatarService.create(file);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.avatarService.remove(userId, +id);
  }
}
