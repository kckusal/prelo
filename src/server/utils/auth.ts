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
  const privateKey = customConfig[key];
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256", // RS256 algorithm requires asymmetric RSA key pair
  });
};

export const verifyJwt = <T>(
  token: string,
  key: "accessTokenPublicKey",
): T | null => {
  const publicKey = customConfig[key];

  try {
    console.log("Verifying JWT: ", token);

    return jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as T;
  } catch (error) {
    console.log(error);
    throw new Error("Auth token verification failed!");
  }
};
