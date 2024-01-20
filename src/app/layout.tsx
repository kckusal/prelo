import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";

import { AppLayout } from "./_components/app-layout";
import { RippleInitializer } from "./_components/lib/client-only";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "PReLO - Personalized Reading List Organizer",
  description: "PReLO helps you organize your reading list.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <RippleInitializer />

        <TRPCReactProvider cookies={cookies().toString()}>
          <AppLayout>{children}</AppLayout>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
