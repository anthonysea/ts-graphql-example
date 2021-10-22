// Type definitions for variables stored in the .env file
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SESSION_SECRET: string;
			NODE_ENV: "development" | "production";
			SALT: string;
			POSTGRES_USER: "string";
			POSTGRES_PASSWORD: "password";
		}
	}
}

export {}