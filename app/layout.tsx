import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopHeader from "./components/TopHeader";

export const metadata: Metadata = {
  title: "Collections",
  description: "Collections Management by Armen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <TopHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
