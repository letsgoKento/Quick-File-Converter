"use client";

import JSZip from "jszip";
import {
  Archive,
  CheckCircle2,
  Download,
  FileImage,
  ImagePlus,
  Loader2,
  Play,
  RotateCcw,
  Trash2,
  TriangleAlert,
  UploadCloud
} from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

type OutputFormat = "png" | "jpg" | "webp";
type Status = "ready" | "converting" | "done" | "error";

type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  sourceFormat: string;
  sizeLabel: string;
  status: Status;
  progress: number;
  outputUrl?: string;
  outputName?: string;
  outputSize?: string;
  error?: string;
};

const acceptedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/bmp"];
const outputTypes: Record<OutputFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp"
};
const supportedExtensions = new Set(["PNG", "JPG", "JPEG", "WEBP", "GIF", "BMP"]);

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function extensionFromFile(file: File) {
  const ext = file.name.split(".").pop()?.toUpperCase();
  if (ext && ext !== file.name.toUpperCase()) return ext;
  return file.type.replace("image/", "").toUpperCase() || "UNKNOWN";
}

function isSupportedImage(file: File) {
  const ext = extensionFromFile(file);
  return acceptedTypes.includes(file.type) || (file.type === "" && supportedExtensions.has(ext));
}

function outputFileName(name: string, format: OutputFormat) {
  const base = name.replace(/\.[^/.]+$/, "");
  return `${base || "converted"}.${format}`;
}

function revokeItemUrls(item: ImageItem) {
  URL.revokeObjectURL(item.previewUrl);
  if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
}

async function blobFromCanvas(canvas: HTMLCanvasElement, format: OutputFormat, quality: number) {
  const mime = outputTypes[format];
  const normalizedQuality = format === "png" ? undefined : quality / 100;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("画像の書き出しに失敗しました。"));
      },
      mime,
      normalizedQuality
    );
  });
}

async function drawImageToCanvas(file: File, outputFormat: OutputFormat) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { alpha: outputFormat !== "jpg" });

  if (!ctx) {
    bitmap.close();
    throw new Error("ブラウザがcanvas変換に対応していません。");
  }

  if (outputFormat === "jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas;
}

export default function ImageConverter() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [format, setFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState(95);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestItemsRef = useRef<ImageItem[]>([]);

  const completedItems = useMemo(() => items.filter((item) => item.status === "done" && item.outputUrl), [items]);
  const hasMultipleCompleted = completedItems.length > 1;
  const totalProgress = items.length
    ? Math.round(items.reduce((sum, item) => sum + item.progress, 0) / items.length)
    : 0;

  useEffect(() => {
    latestItemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      latestItemsRef.current.forEach(revokeItemUrls);
    };
  }, []);

  const addFiles = (fileList: FileList | File[]) => {
    const nextItems = Array.from(fileList).map<ImageItem>((file) => {
      const isSupported = isSupportedImage(file);

      return {
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        sourceFormat: extensionFromFile(file),
        sizeLabel: formatBytes(file.size),
        status: isSupported ? "ready" : "error",
        progress: isSupported ? 0 : 100,
        error: isSupported ? undefined : "対応していない、または画像として読み込めない形式です。"
      };
    });

    setItems((current) => [...current, ...nextItems]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  const removeItem = (id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) revokeItemUrls(target);
      return current.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach(revokeItemUrls);
    setItems([]);
  };

  const updateItem = (id: string, patch: Partial<ImageItem>) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (patch.outputUrl && item.outputUrl && patch.outputUrl !== item.outputUrl) {
          URL.revokeObjectURL(item.outputUrl);
        }
        return { ...item, ...patch };
      })
    );
  };

  const convertOne = async (item: ImageItem) => {
    updateItem(item.id, { status: "converting", progress: 12, error: undefined });
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = await drawImageToCanvas(item.file, format);
    updateItem(item.id, { progress: 68 });
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const blob = await blobFromCanvas(canvas, format, quality);
    const outputUrl = URL.createObjectURL(blob);
    updateItem(item.id, {
      status: "done",
      progress: 100,
      outputUrl,
      outputName: outputFileName(item.file.name, format),
      outputSize: formatBytes(blob.size)
    });
  };

  const convertAll = async () => {
    const targets = items.filter((item) => item.status !== "error");
    if (!targets.length) return;

    setIsConverting(true);
    for (const item of targets) {
      try {
        await convertOne(item);
      } catch (error) {
        updateItem(item.id, {
          status: "error",
          progress: 100,
          error: error instanceof Error ? error.message : "変換中にエラーが発生しました。"
        });
      }
    }
    setIsConverting(false);
  };

  const downloadZip = async () => {
    const zip = new JSZip();

    for (const item of completedItems) {
      if (!item.outputUrl || !item.outputName) continue;
      const blob = await fetch(item.outputUrl).then((response) => response.blob());
      zip.file(item.outputName, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `converted-images-${format}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="converter-shell" aria-label="画像変換エリア">
      <div
        className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="drop-icon" aria-hidden="true">
          <UploadCloud size={34} />
        </div>
        <div>
          <h2>ここに画像をドロップ</h2>
          <p>PNG / JPG / JPEG / WEBP / GIF / BMP などを複数まとめて追加できます。</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus size={18} aria-hidden="true" />
          ファイルを選択
        </button>
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
          multiple
          onChange={handleFileChange}
        />
      </div>

      <div className="control-panel">
        <div className="format-group" aria-label="出力形式">
          {(["png", "jpg", "webp"] as OutputFormat[]).map((option) => (
            <button
              key={option}
              type="button"
              className={format === option ? "format-pill is-active" : "format-pill"}
              onClick={() => setFormat(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>

        <label className="quality-control">
          <span>
            画質
            <strong>{quality}</strong>
          </span>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            disabled={format === "png"}
            onChange={(event) => setQuality(Number(event.target.value))}
          />
        </label>

        <div className="action-row">
          <button className="primary-button" type="button" onClick={convertAll} disabled={!items.length || isConverting}>
            {isConverting ? <Loader2 className="spin" size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}
            {isConverting ? "変換中..." : "変換開始"}
          </button>
          <button className="ghost-button" type="button" onClick={clearAll} disabled={!items.length || isConverting}>
            <RotateCcw size={18} aria-hidden="true" />
            クリア
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="progress-panel" aria-label="変換進捗">
          <div>
            <span>全体の進捗</span>
            <strong>{totalProgress}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
      )}

      {hasMultipleCompleted && (
        <button className="zip-button" type="button" onClick={downloadZip}>
          <Archive size={19} aria-hidden="true" />
          ZIPで一括ダウンロード
        </button>
      )}

      <div className="file-grid" aria-live="polite">
        {items.map((item) => (
          <article className={`file-card status-${item.status}`} key={item.id}>
            <div className="preview-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt={`${item.file.name}のプレビュー`} />
              <span className="status-badge">
                {item.status === "done" && <CheckCircle2 size={15} aria-hidden="true" />}
                {item.status === "error" && <TriangleAlert size={15} aria-hidden="true" />}
                {item.status === "converting" && <Loader2 className="spin" size={15} aria-hidden="true" />}
                {item.status === "ready" && <FileImage size={15} aria-hidden="true" />}
                {item.status === "done" ? "完了" : item.status === "error" ? "エラー" : item.status === "converting" ? "変換中" : "待機中"}
              </span>
            </div>
            <div className="file-meta">
              <h3 title={item.file.name}>{item.file.name}</h3>
              <dl>
                <div>
                  <dt>元形式</dt>
                  <dd>{item.sourceFormat}</dd>
                </div>
                <div>
                  <dt>サイズ</dt>
                  <dd>{item.sizeLabel}</dd>
                </div>
                {item.outputSize && (
                  <div>
                    <dt>変換後</dt>
                    <dd>{item.outputSize}</dd>
                  </div>
                )}
              </dl>
              <div className="mini-progress">
                <span style={{ width: `${item.progress}%` }} />
              </div>
              {item.error && <p className="error-text">{item.error}</p>}
            </div>
            <div className="card-actions">
              {item.outputUrl && item.outputName && (
                <a className="download-button" href={item.outputUrl} download={item.outputName}>
                  <Download size={17} aria-hidden="true" />
                  ダウンロード
                </a>
              )}
              <button className="icon-button" type="button" onClick={() => removeItem(item.id)} aria-label={`${item.file.name}を削除`}>
                <Trash2 size={17} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
