import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 'password123', description: 'Password (6-20 characters)' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password?: string;
}
