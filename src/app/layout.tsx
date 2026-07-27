import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import { JsonLd } from "@/features/seo";
import { metadataGenerator } from "@/features/seo/services/metadata-generator";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = metadataGenerator.default();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd
          data={[
            JsonLd.organization(),
            JsonLd.website(),
          ]}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
