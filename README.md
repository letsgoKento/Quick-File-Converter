# 画像拡張子変換ツール

PNG / JPG / JPEG / WEBP / GIF / BMPなどの画像を、ブラウザ内でPNG・JPG・WEBPへ変換できるNext.js製Webアプリです。

## 特徴

- ドラッグ＆ドロップ、またはファイル選択で画像を追加
- 複数ファイルの一括変換
- 変換前にファイル名、元形式、サイズ、プレビューを表示
- 出力形式はPNG / JPG / WEBPから選択
- JPG / WEBPの画質を1〜100で指定
- JPG変換時は透過背景を白背景に合成
- 変換後の個別ダウンロード
- 複数ファイルはZIPで一括ダウンロード
- エラーが起きたファイルをカード上に表示
- 変換処理はブラウザ内で完結し、元画像をサーバーに保存しない設計
- AdSense用の広告スペースコンポーネントを用意

## ファイル構成

```text
拡張子変換ツール/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ AdSlot.tsx
│  └─ ImageConverter.tsx
├─ .eslintrc.json
├─ .gitignore
├─ next-env.d.ts
├─ next.config.mjs
├─ package.json
├─ README.md
└─ tsconfig.json
```

## 実行方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## ビルド

```bash
npm run build
npm run start
```

## Vercelへのデプロイ方法

1. このフォルダをGitHubリポジトリへpushします。
2. Vercelで「Add New Project」を選び、該当リポジトリを選択します。
3. Framework PresetはNext.jsを選択します。
4. Build Commandは `npm run build`、Output Directoryは未指定のままで問題ありません。
5. Deployを押すと公開できます。

## AdSense用の広告枠

`components/AdSlot.tsx` を広告スペースとして用意しています。AdSense審査後は、このコンポーネント内にAdSenseのコードを差し込めます。

## プライバシー設計

このアプリは画像ファイルをサーバーへアップロードして保存するAPIを持ちません。画像の読み込み、canvasへの描画、形式変換、ZIP生成はユーザーのブラウザ上で行います。
