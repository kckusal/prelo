import { hash as argon2Hash, verify as argon2Verify } from "argon2";
import jwt, { type SignOptions } from "jsonwebtoken";

import customConfig from "../config/default";

export const hashUserPassword = async (plainTextPassword: string) => {
  // Cannot find module ./lib/binding/napi-v3/argon2.node issue:
  // https://stackoverflow.com/questions/74908810/error-cannot-find-module-lib-binding-napi-v3-argon2-node
  return argon2Hash(plainTextPassword);
};

export const compareUserPassword = async ({
  hashedPassword,
  plainTextPassword,
}: {
  hashedPassword: string;
  plainTextPassword: string;
}) => {
  return argon2Verify(hashedPassword, plainTextPassword);
};

export const signJwt = (
  payload: Record<string, unknown>,
  key: "accessTokenPrivateKey",
  options: SignOptions = {},
) => {
  console.log("Signing JWT...");
  const privateKey = Buffer.from(customConfig[key], "base64");

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "HS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  key: "accessTokenPublicKey",
): T | null => {
  try {
    console.log("Verifying JWT: ", token);
    const publicKey = Buffer.from(customConfig[key], "base64");

    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};
