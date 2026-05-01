import { NODE_ENV } from "./env_config.js";

const httpOnly = NODE_ENV === "production";
const secure = NODE_ENV === "production";
const sameSite = NODE_ENV === "production" ? "None" : "lax";

export const options = {
  domain: "localhost",
  maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
  httpOnly,
  secure,
  sameSite,
  path: "/",
};
