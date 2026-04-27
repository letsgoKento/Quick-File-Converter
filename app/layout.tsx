import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "画像拡張子変換ツール | PNG・JPG・WEBPをブラウザで一括変換",
    template: "%s | 画像拡張子変換ツール"
  },
  description:
    "PNG、JPG、JPEG、WEBP、GIF、BMPなどの画像を、PNG・JPG・WEBPへまとめて変換できる画像拡張子変換ツールです。処理はブラウザ内で完結し、画像をサーバーに保存しません。",
  applicationName: "画像拡張子変換ツール",
  creator: "Quick File Converter",
  publisher: "Quick File Converter",
  keywords: [
    "画像変換",
    "拡張子変換",
    "PNG JPG 変換",
    "WEBP 変換",
    "画像コンバーター",
    "ブラウザ変換"
  ],
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png"
      }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  openGraph: {
    title: "画像拡張子変換ツール | PNG・JPG・WEBPをブラウザで一括変換",
    description:
      "複数の画像をPNG・JPG・WEBPへ簡単に一括変換。処理はブラウザ内で完結し、元画像はサーバーに保存されません。",
    type: "website",
    locale: "ja_JP",
    siteName: "画像拡張子変換ツール"
  },
  twitter: {
    card: "summary_large_image",
    title: "画像拡張子変換ツール | PNG・JPG・WEBPを一括変換",
    description: "PNG・JPG・WEBPへ直感的に変換できる、ブラウザ完結型の画像変換ツール。"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9092971490160530"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
