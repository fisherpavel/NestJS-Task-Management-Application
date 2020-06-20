import { Repository, EntityRepository } from "typeorm"
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepositiry extends Repository<User> {
    
}