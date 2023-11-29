interface CustomConfigType {
  accessTokenExpiresInMinutes: number;
  origin: string;

  dbUri: string;
  jwtSigningSecretKey: string;
}

const customConfig: CustomConfigType = {
  accessTokenExpiresInMinutes: 120,
  origin: "http://localhost:3000",

  dbUri: process.env.DATABASE_URL!,
  jwtSigningSecretKey: process.env.JWT_SIGNING_SECRET_KEY!,
};

export default customConfig;
