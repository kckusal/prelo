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

export const signJwt = (options: {
  payload: object;
  configName: "jwtSigningSecretKey";
  signOptions: SignOptions;
}) => {
  const { payload, configName, signOptions } = options;
  console.log("Signing JWT...");
  const secretKey = customConfig[configName];

  const jwtToken = jwt.sign(payload, secretKey, {
    ...(signOptions ?? {}),
    algorithm: "HS256", // HS256 algorithm uses symmetric key
  });

  return jwtToken;
};

export const verifyJwt = <T>(options: {
  token: string;
  configName: "jwtSigningSecretKey";
}): T | null => {
  const { token, configName } = options;
  const secretKey = customConfig[configName];

  try {
    console.log("Verifying JWT: ", token);

    const decoded = jwt.verify(token, secretKey, {
      algorithms: ["HS256"],
    }) as T;

    return decoded;
  } catch (error) {
    console.log(error);
    throw new Error("Auth token verification failed!");
  }
};
