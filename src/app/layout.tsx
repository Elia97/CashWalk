import "./globals.css";
import Image from "next/image";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ImpersonationIndicator } from "@/components/auth/impersonation-indicator";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { AuthButton } from "@/components/auth/auth-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CashWalk",
  description: "Manage your finances effectively",
};

export type NavbarItem = {
  href: string;
  label: string;
  icon: string;
};

const NAVBAR_ITEMS: NavbarItem[] = [
  { href: "/overview", label: "Overview", icon: "layout-dashboard" },
  { href: "/accounts", label: "Accounts", icon: "wallet" },
  { href: "/transactions", label: "Transactions", icon: "arrow-right-left" },
  { href: "/analytics", label: "Analytics", icon: "chart-column" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark min-h-screen`}
      >
        <header className="py-6 px-4 flex justify-center relative h-[84px]">
          <Link
            href="/"
            className="absolute top-6 left-4 lg:left-8 inline-flex items-center"
          >
            <Image
              priority={true}
              src="/CashWalk.svg"
              alt="CashWalk"
              width={40}
              height={40}
            />
            <span className="font-bold text-lg">CashWalk</span>
          </Link>
          <DesktopNavigation navbarItems={NAVBAR_ITEMS} />
          <div className="absolute top-6 right-4 lg:right-8">
            <AuthButton />
          </div>
        </header>
        <main className="px-4 mb-6 container mx-auto pb-16 lg:pb-0">
          {children}
          <Toaster position="top-center" />
          <ImpersonationIndicator />
        </main>
        <footer></footer>
        <MobileNavigation navbarItems={NAVBAR_ITEMS} />
      </body>
    </html>
  );
}
