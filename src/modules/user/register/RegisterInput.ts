import { Field, InputType } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { doesEmailExist } from "./doesEmailExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(2, 255)
  firstName: string;

  @Field()
  @Length(2, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @doesEmailExist({ message: "Email already in use." })
  email: string;

  @Field()
  password: string;
}
