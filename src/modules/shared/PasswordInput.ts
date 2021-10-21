import { Field, InputType } from "type-graphql";
import { Min } from "class-validator";

@InputType()
export class PasswordInput {
	@Min(5)
  @Field()
  password: string;
}
