import { 
  Controller, 
  Patch, 
  Delete, 
  UseGuards, 
  Body, 
  Req, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from '../service/user.service';
import { UpdateProfileNameDto } from '../dtos/user-profile.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('profile/name')
  @ApiOperation({ summary: 'Update user profile name' })
  async updateProfileName(
    @Req() req, 
    @Body() updateProfileNameDto: UpdateProfileNameDto
  ) {
    return this.userService.updateProfileName(req.user.id, updateProfileNameDto);
  }

  @Patch('profile/picture')
  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @Req() req, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.updateProfilePicture(req.user.id, file);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(@Req() req) {
    await this.userService.deleteAccount(req.user.id);
    return { message: 'Account deleted successfully' };
  }
} 