import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import {
  AuthResult,
  RegistrationResponse,
  SigninData,
} from '../type/auth.type';
import { UsersService } from '../../user/service/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(input: AuthDto): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException(
        'User not authorized to access this resource',
      );
    }

    return await this.signin(user);
  }

  async validateUser(input: AuthDto): Promise<SigninData | null> {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch =
      user && (await bcrypt.compare(input.password, user.password));

    if (isMatch) {
      return {
        email: user.email,
        password: user.password,
      };
    }
    return null;
  }

  async signUp(user: SigninData): Promise<RegistrationResponse> {
    const existingUser = await this.usersService.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('Email already registered....');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const payload = { email: user.email, sub: hashedPassword };
    const accessToken = await this.jwtService.signAsync(payload);

    const newUserDoc = await this.usersService.createUser({
      email: user.email,
      password: hashedPassword,
    });

    const newUser = newUserDoc.toObject();

    return {
      accessToken,
      email: newUser.email,
    };
  }

  async signin(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(authDto.password, user.password);
    if (!isValid)
      throw new UnauthorizedException(
        'Invalid Password!......Please try again...',
      );

    return this.generateToken(user);
  }

  async generateToken(user: any): Promise<AuthResult> {
    const payload = {
      email: user.email,
      sub: user._id,
      userName: user.userName,
    };

    return {
      email: user.email,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
