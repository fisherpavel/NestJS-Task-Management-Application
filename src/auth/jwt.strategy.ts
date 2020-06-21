import {PassportStrategy} from '@nestjs/passport'
import {Strategy, ExtractJwt} from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from './jwt-payload.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepositiry } from './user.repository'
import { User } from './user.entity'
import * as config from 'config'


@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepositiry)
        private userRepository: UserRepositiry
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
        })
    }

    async validate(payload: JwtPayload): Promise<User>{
        const {username} = payload
        const user = await this.userRepository.findOne({username})

        if(!user){
            throw new UnauthorizedException()
        }
        return user
    }
}