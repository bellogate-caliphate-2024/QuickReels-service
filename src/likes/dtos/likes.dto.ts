import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user who liked the content' })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ example: 'post_456', description: 'The ID of the content being liked' })
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiPropertyOptional({ example: '2024-05-20T14:30:00Z', description: 'The time the like occurred' })
  @IsOptional()
  time?: Date;
}
