import type { Metadata } from "next";
import "./globals.css";
import { LikesProvider } from "@/shared/likes/LikesProvider";
import { SelectedLocationProvider } from "@/shared/location/SelectedLocationProvider";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "JellySafe",
  description: "제주 해파리 안전 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          <LikesProvider>
            <SelectedLocationProvider>{children}</SelectedLocationProvider>
          </LikesProvider>
        </Providers>
      </body>
    </html>
  );
}
