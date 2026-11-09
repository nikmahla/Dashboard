import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: { default: "Stockroom", template: "%s | Stockroom" },
  description: "Store admin dashboard built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
