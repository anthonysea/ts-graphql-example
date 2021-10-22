import { forgotPasswordPrefix } from "../../constants";
import { v4 } from "uuid";
import { redis } from "../../redis";

export const createForgotPasswordUrl = async (userId: number) => {
	const token = v4();

	await redis.set(forgotPasswordPrefix + token, userId, "ex", 60*60*24);

	return `http://localhost:3000/user/forgotPassword/${token}`;
}