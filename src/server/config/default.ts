interface CustomConfigType {
  accessTokenExpiresInMinutes: number;
  origin: string;

  dbUri: string;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
}

const customConfig: CustomConfigType = {
  accessTokenExpiresInMinutes: 120,
  origin: "http://localhost:3000",

  dbUri: process.env.DATABASE_URL!,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY!,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY!,
};

export default customConfig;
