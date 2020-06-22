import {jwtStrategy} from './jwt.strategy'
import { Test } from '@nestjs/testing'
import {UserRepositiry} from './user.repository'
import { async } from 'rxjs/internal/scheduler/async'
import { User } from './user.entity'
import { UnauthorizedException } from '@nestjs/common'

const mockUserRepository = () => ({
    findOne: jest.fn()
})

describe('JwtStrategy', () => {
    let jwtStr: jwtStrategy
    let userRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                jwtStrategy,
                {provide: UserRepositiry, useFactory: mockUserRepository}
            ]
        }).compile()

        jwtStr = await module.get<jwtStrategy>(jwtStrategy)
        userRepository = await module.get<UserRepositiry>(UserRepositiry)
    })

    describe('validate',  () => {
        it('validates and returns the user based on JWT payload', async () => {
            const user = new User()
            user.username = 'testuser'

            userRepository.findOne.mockResolvedValue(user)
            const result = await jwtStr.validate({username: 'testuser'})
            expect(userRepository.findOne).toHaveBeenCalledWith({username: 'testuser'})
            expect(result).toEqual(user)
        })

        it('throw an unauthorized exception as user cannot be found', () => {
            userRepository.findOne.mockResolvedValue(null)
            expect(jwtStr.validate({username: 'testuser'})).rejects.toThrow(UnauthorizedException)
        })
    })

})