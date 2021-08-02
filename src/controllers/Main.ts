import {CurrentUser, JsonController, Post} from "routing-controllers";
import {Service} from "typedi";

import {User} from '../entities'
import {InjectRepository} from "typeorm-typedi-extensions";
import {Repository} from "typeorm";
import {UserToken} from "./UserToken";

@JsonController()
@Service()
export class MainController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
  }

  // returns user info, creating one if nonexistent.
  @Post('/connect')
  async connect(@CurrentUser() userToken: UserToken) {
    console.log(userToken);
    let user = await this.userRepo.findOne(userToken.sub);
    if (user === undefined) {
      user = new User(userToken.sub, userToken.name);
      await this.userRepo.save(user)
    }
    return {
      id: user.id,
      name: user.name,
    };
  }
}