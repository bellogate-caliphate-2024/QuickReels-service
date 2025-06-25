import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileNameDto {
  @ApiProperty({ example: 'John Doe', description: 'New user name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateProfilePictureDto {
  @ApiProperty({ description: 'Profile picture file' })
  @IsNotEmpty()
  file: Express.Multer.File;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Profile picture file' })
  @IsOptional()
  file?: Express.Multer.File;
} 