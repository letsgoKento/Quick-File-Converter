import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import AdSlot from "../components/AdSlot";
import ImageConverter from "../components/ImageConverter";

const faqs = [
  {
    question: "アップロードした画像はサーバーに保存されますか？",
    answer:
      "保存されません。変換処理はブラウザ内のcanvasを使って行う設計で、元画像を外部サーバーへ送信しません。"
  },
  {
    question: "JPGに変換すると透過部分はどうなりますか？",
    answer:
      "JPGは透過に対応していないため、透過部分は自動的に白背景へ合成してから変換します。"
  },
  {
    question: "複数ファイルをまとめて変換できますか？",
    answer:
      "できます。変換後は個別ダウンロードに加えて、複数ファイルをZIPで一括ダウンロードできます。"
  },
  {
    question: "変換できない画像がある場合は？",
    answer:
      "ブラウザが読み込めない形式や破損したファイルは、カード上に分かりやすくエラーとして表示します。"
  }
];

export default function Home() {
  return (
    <div className="page-with-ads">
      <AdSlot className="side-ad side-ad-left" label="左広告スペース" />

      <main className="page-main">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Browser Image Converter</p>
            <h1>画像拡張子変換ツール</h1>
            <p className="lead">
              PNG、JPG、WEBPなどの画像を、ドラッグ＆ドロップだけで上品に、すばやく変換。
              処理はブラウザ内で完結するため、元画像をサーバーに保存しません。
            </p>
            <div className="trust-row" aria-label="主な特徴">
              <span>
                <ShieldCheck size={18} aria-hidden="true" />
                ローカル処理
              </span>
              <span>
                <Zap size={18} aria-hidden="true" />
                一括変換
              </span>
              <span>
                <Sparkles size={18} aria-hidden="true" />
                高品質出力
              </span>
            </div>
          </div>
        </section>

        <ImageConverter />

        <AdSlot label="広告掲載スペース" />

        <section className="content-grid" aria-label="ツールの説明">
          <article>
            <h2>使い方</h2>
            <ol>
              <li>画像ファイルを中央のエリアへドラッグ、またはボタンから選択します。</li>
              <li>出力形式をPNG、JPG、WEBPから選び、必要に応じて画質を調整します。</li>
              <li>変換開始を押すと、完了した画像を個別またはZIPでダウンロードできます。</li>
            </ol>
          </article>
          <article>
            <h2>対応形式</h2>
            <p>
              読み込みはPNG、JPG、JPEG、WEBP、GIF、BMPなど、主要ブラウザが画像として扱える形式に対応しています。
              出力はPNG、JPG、WEBPから選択できます。
            </p>
          </article>
          <article>
            <h2>プライバシー</h2>
            <p>
              画像変換はユーザーのブラウザ内で行われます。アップロードした画像をサーバーへ保存しないため、
              個人用の写真や業務用素材も扱いやすい設計です。
            </p>
          </article>
        </section>

        <section className="faq-section" aria-label="よくある質問">
          <h2>よくある質問</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <AdSlot className="side-ad side-ad-right" label="右広告スペース" />
    </div>
  );
}
