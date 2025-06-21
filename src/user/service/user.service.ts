import { Injectable } from '@nestjs/common';
import { UserRepository } from '../reposiotry/user.repository';
import { User } from '../schema/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async createUser(data: Partial<User>) {
    let an = this.usersRepository.createUser(data);
    console.log('User created:', an);
    return an;
  }
}
