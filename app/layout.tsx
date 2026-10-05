import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import { MotionProvider } from "@/components/shared/motion";
import { Toaster } from "@/components/ui/sonner";
import { getSiteConfigSafe } from "@/lib/queries/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
});

const DESCRIPTION =
  "เว็บไซต์กีฬาสีภายในโรงเรียน ตารางการแข่งขัน ผลการแข่งขัน และคะแนนรวม";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfigSafe();
  const title = `${config.eventName} ${config.eventYear}`;
  return {
    title: { default: title, template: `%s · ${title}` },
    description: DESCRIPTION,
    openGraph: {
      title,
      description: DESCRIPTION,
      type: "website",
      locale: "th_TH",
      siteName: title,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f5f5f5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${inter.variable} ${notoThai.variable}`}>
      <body className="min-h-dvh">
        <MotionProvider>{children}</MotionProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
