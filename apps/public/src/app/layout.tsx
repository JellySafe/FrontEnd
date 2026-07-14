import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LikesProvider } from "@/shared/likes/LikesProvider";
import { SelectedLocationProvider } from "@/shared/location/SelectedLocationProvider";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "JellySafe",
  description: "제주 해파리 안전 서비스",
};

// iOS 안전영역(홈 인디케이터)을 직접 제어하기 위해 viewport-fit=cover 지정
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
