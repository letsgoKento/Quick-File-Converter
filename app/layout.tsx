import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "画像拡張子変換ツール | PNG・JPG・WEBPをブラウザで変換",
  description:
    "PNG、JPG、JPEG、WEBP、GIF、BMPなどの画像を、ブラウザ内でPNG・JPG・WEBPへまとめて変換できる無料の画像拡張子変換ツールです。画像はサーバーに保存されません。",
  keywords: [
    "画像変換",
    "拡張子変換",
    "PNG JPG 変換",
    "WEBP 変換",
    "画像コンバーター",
    "ブラウザ変換"
  ],
  openGraph: {
    title: "画像拡張子変換ツール",
    description:
      "複数画像をPNG・JPG・WEBPへ一括変換。処理はブラウザ内で完結し、元画像はサーバーに保存されません。",
    type: "website",
    locale: "ja_JP",
    siteName: "画像拡張子変換ツール"
  },
  twitter: {
    card: "summary_large_image",
    title: "画像拡張子変換ツール",
    description: "PNG・JPG・WEBPへ直感的に変換できるブラウザ完結型ツール。"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0f17"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
