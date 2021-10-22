import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";

@Resolver(User)
export class RegisterResolver {
  // Use the Authorized decorator to add authentication to certain queries/mutations
  // It will use the authChecker function passed to the buildSchema function in index.ts
  // @Authorized
  // Can also create your own middleware to add authentication for more fine-tuned control
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "hello world";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    console.log(process.env.SALT!);
    const hashedPassword = await bcrypt.hash(password, 12); 

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }
}
