import { forgotPasswordPrefix } from "../../constants";
import { redis } from "../../redis";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from 'bcryptjs';

import { User } from "../../entity/User";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";

@Resolver(User)
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
		@Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

		const user = await User.findOne(userId);
		if (!user) {
			return null;
		}

		await redis.del(forgotPasswordPrefix + token);

		// Could also use user.update to update the password field
		user.password = await bcrypt.hash(password, process.env.SALT!);

		await user.save();

		ctx.req.session.userId = user.id;

		return user;
  }
}
