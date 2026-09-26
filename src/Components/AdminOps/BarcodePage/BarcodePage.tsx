"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminCard from "@/Components/AdminOps/AdminCard/AdminCard";
import { ModalButton, StatusModal, useFeedback } from "@/Components/Modal";

function downloadQRCode() {
  const svg = document.getElementById("qr-code-element");
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "qrcode.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
}

export default function BarcodePage() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(220);
  const feedback = useFeedback();

  return (
    <AdminPageShell
      title="Barcode / QR"
      subtitle="Generate a QR code from a book ID."
      framed={false}
    >
      <AdminCard>
        <div className="mx-auto max-w-xl p-5">
          <h2 className="font-semibold text-slate-800">Generate QR Code</h2>
          <p className="mt-1 text-xs text-slate-400">
            Copy a book ID from Books, then paste it here. A member scan opens that book.
          </p>
          <fieldset className="fieldset mt-4 p-0">
            <legend className="fieldset-legend">Book ID</legend>
            <div className="flex gap-2">
              <input
                id="qr-input"
                name="qrBookId"
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste a copied book ID"
                className="input min-w-0 flex-1"
              />
              <ModalButton
                onClick={() => {
                  void navigator.clipboard.readText().then(
                    (value) => {
                      const next = value.trim();
                      if (!next) {
                        feedback.failed("Nothing to paste", "Copy a book ID first.");
                        return;
                      }
                      setText(next);
                    },
                    () => {
                      feedback.failed(
                        "Could not paste",
                        "Allow clipboard access, or paste with the keyboard.",
                      );
                    },
                  );
                }}
              >
                Paste
              </ModalButton>
            </div>
          </fieldset>
          <label className="mt-3 flex items-center gap-3 text-xs text-slate-500">
            Size
            <input
              type="range"
              min={128}
              max={320}
              step={16}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="range range-xs range-primary flex-1"
            />
            <span className="w-10 text-right">{size}</span>
          </label>
          <div className="mt-5 flex min-h-56 items-center justify-center rounded-xl border border-slate-100 bg-white p-4 text-center text-sm text-slate-400">
            {text ? (
              <QRCodeSVG
                id="qr-code-element"
                value={text}
                size={size}
                level="H"
                includeMargin
              />
            ) : (
              <p>Enter a Book ID or URL to see the QR code.</p>
            )}
          </div>
          {text ? (
            <div className="mt-4">
              <ModalButton onClick={downloadQRCode}>Download SVG</ModalButton>
            </div>
          ) : null}
        </div>
      </AdminCard>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </AdminPageShell>
  );
}
