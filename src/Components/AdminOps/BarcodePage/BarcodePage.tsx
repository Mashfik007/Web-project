"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminCard from "@/Components/AdminOps/AdminCard/AdminCard";
import {
  FormField,
  ModalButton,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal";
import type { AdminScan } from "@/types/adminOps";

interface BarcodePageProps {
  scans: AdminScan[];
}

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

export default function BarcodePage({ scans }: BarcodePageProps) {
  const [text, setText] = useState("");
  const [size, setSize] = useState(220);
  const feedback = useFeedback();

  return (
    <AdminPageShell
      title="Barcode / QR"
      subtitle="Scan to issue/return or generate QR codes for books."
      framed={false}
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AdminCard>
          <div className="p-5">
            <h2 className="font-semibold text-slate-800">
              Scan to Issue / Return
            </h2>
            <div className="mt-4 flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-sky-200 bg-sky-50/40 text-center">
              <p className="font-medium text-sky-700">
                Point scanner at barcode
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Supports Code 128, QR, ISBN.
              </p>
            </div>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!formHasValues(event.currentTarget, ["bookId"])) {
                  feedback.failed(
                    "Book not found",
                    "Enter a Book ID to search.",
                  );
                  return;
                }
                feedback.success(
                  "Book found",
                  "Ready to issue or return this copy.",
                );
              }}
            >
              <input
                name="bookId"
                placeholder="Or enter Book ID manually..."
                className="input min-w-0 flex-1"
              />
              <ModalButton type="submit">Search</ModalButton>
            </form>
            <p className="mt-5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              Recent scans
            </p>
            <ul className="mt-2 divide-y divide-slate-100">
              {scans.map((scan) => (
                <li
                  key={scan.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">{scan.title}</p>
                    <p className="text-xs text-slate-400">{scan.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{scan.time}</p>
                    <p
                      className={`text-xs font-semibold ${
                        scan.status === "Returned"
                          ? "text-emerald-600"
                          : "text-sky-600"
                      }`}
                    >
                      {scan.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="p-5">
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
            <div className="mt-6 grid grid-cols-2 gap-3">
              <FormField
                label="Member ID"
                name="memberId"
                placeholder="LIB-XXXX"
              />
              <FormField
                label="Book ID"
                name="issueBookId"
                placeholder="LIB-XXXX"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <ModalButton
                onClick={() =>
                  feedback.success("Book issued", "The copy is now on loan.")
                }
              >
                Issue Book
              </ModalButton>
              <ModalButton
                tone="success"
                onClick={() =>
                  feedback.success(
                    "Book returned",
                    "The copy is back in stock.",
                  )
                }
              >
                Return Book
              </ModalButton>
            </div>
          </div>
        </AdminCard>
      </div>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </AdminPageShell>
  );
}
