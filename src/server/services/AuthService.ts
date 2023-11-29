import { db } from "../db";
import {
  compareUserPassword,
  signJwt,
  hashUserPassword,
  verifyJwt,
} from "../utils/auth";
import customConfig from "../config/default";

import { type TRPCContext } from "../api/trpc";

// [...] Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const accessTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + customConfig.accessTokenExpiresInMinutes * 60 * 1000,
  ),
};

interface LoginParam {
  email: string;
  password: string;
}

interface RegisterParam {
  firstName: string;
  lastName?: string | undefined;
  email: string;
  password: string;
}

interface JwtAccessTokenPayload {
  user: { id: number; firstName: string; email: string };
}

export class AuthService {
  static async login(ctx: TRPCContext, { email, password }: LoginParam) {
    // Validate if user exists in our database
    console.log("Checking if user with this email exists: ", email);
    const user = await db.user.findFirst({
      where: { email },
    });

    if (user) {
      console.log("Matching password provided...");
      const isPasswordMatching = await compareUserPassword({
        hashedPassword: user.passwordHash,
        plainTextPassword: password,
      });
      if (!isPasswordMatching) {
        throw new Error("No user found with these credentials.");
      }
      const jwtPayload: JwtAccessTokenPayload = {
        user: {
          id: user.id,
          firstName: user.firstName,
          email: user.email,
        },
      };

      // Create access token
      const accessToken = signJwt({
        payload: jwtPayload,
        configName: "jwtSigningSecretKey",
        signOptions: {
          expiresIn: `${customConfig.accessTokenExpiresInMinutes}m`,
        },
      });

      // send access token in cookie
      console.log("Setting access token in cookie...");

      // TODO: Fix SSR cookie set

      // ctx.res.cookies.set("access_token", accessToken, {
      //   ...accessTokenCookieOptions,
      //   sameSite: "lax",
      // });

      // ctx.res.cookies.set("logged_in", "true", {
      //   ...accessTokenCookieOptions,
      //   httpOnly: false,
      // });

      return { accessToken };
    } else {
      throw new Error("No user found with these credentials.");
    }
  }

  static async register({
    email,
    firstName,
    lastName = "",
    password,
  }: RegisterParam) {
    // check if user with this email already exists
    console.log("Checking if user with this email already exists...");
    const existingUser = await db.user.findFirst({
      select: { id: true },
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists with this email!");
    }

    // generate user password hash
    console.log("Hashing user password...");
    const passwordHash = await hashUserPassword(password);

    console.log("Creating user...");
    return await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
    });
  }

  static async getMe({ authToken }: { authToken: string }) {
    if (!authToken) return { user: null };

    const jwtPayload = verifyJwt<JwtAccessTokenPayload>({
      token: authToken,
      configName: "jwtSigningSecretKey",
    });

    if (!jwtPayload?.user?.id) {
      throw new Error("Invalid JWT access token!");
    }

    console.log("Getting user...");
    const user = await db.user.findFirst({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: jwtPayload.user.id },
    });

    return { user };
  }
}
