import { confirmUserPrefix } from "src/constants";
import { v4 } from "uuid";
import { redis } from "../../redis";

export const createConfirmationUrl = async (userId: number) => {
	const token = v4();

	redis.set(confirmUserPrefix + token, userId, "ex", 60*60*24);

	return `http://localhost:3000/user/confirm/${token}`;
}