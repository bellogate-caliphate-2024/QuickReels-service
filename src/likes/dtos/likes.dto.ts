import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  contentId: string;

  @IsOptional()
  time?: Date;
}
