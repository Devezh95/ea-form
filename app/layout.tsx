
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EA FORM — Your Form. Your Rules.",
    template: "%s | EA FORM",
  },
  description:
    "EA FORM — платформа для персональных тренеров. Управляйте клиентами, тренировками, расписанием и прогрессом в одном месте.",
  applicationName: "EA FORM",
  keywords: [
    "EA FORM",
    "фитнес",
    "персональный тренер",
    "управление клиентами",
    "тренировки",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
