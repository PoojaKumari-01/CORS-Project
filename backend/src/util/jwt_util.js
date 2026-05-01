import jwt from "jsonwebtoken";

export function createJWTtoken(user) {
  const token = jwt.sign(user, "zordix", {
    expiresIn: "1d",
  });
  return token;
}
