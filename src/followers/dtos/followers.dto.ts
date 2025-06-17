import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowerDto {
  @ApiProperty({
    example: 'follower@example.com',
    description: 'The email of the user who wants to follow',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  followerEmail: string;

  @ApiProperty({
    example: 'following@example.com',
    description: 'The email of the user to be followed',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  followingEmail: string;
}
