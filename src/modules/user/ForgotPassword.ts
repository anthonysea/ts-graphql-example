import { Arg, Mutation, Resolver } from "type-graphql";

import { User } from "../../entity/User";
import { createForgotPasswordUrl } from "../utils/createForgotPasswordUrl";
import { sendEmail } from "../utils/sendEmail";

@Resolver(User)
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

		if (!user) {
			return false;
		}

		await sendEmail(email, await createForgotPasswordUrl(user.id))

    return true;
  }
}
