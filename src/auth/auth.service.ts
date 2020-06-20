import { Injectable } from '@nestjs/common';
import { UserRepositiry } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepositiry)
        private userRepository: UserRepositiry
        ){}
}
