"use client";

import { useState } from "react";
import { AdminPageShell } from "@/Components/AdminCatalog/AdminCatalogUi";
import { AdminCard } from "@/Components/AdminOps/AdminOpsUi";
import {
  FormField,
  ModalButton,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { AdminScan } from "@/types/adminOps";

interface BarcodePageProps {
  scans: AdminScan[];
}

export default function BarcodePage({ scans }: BarcodePageProps) {
  const [generated, setGenerated] = useState(false);
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
            <h2 className="font-semibold text-slate-800">Scan to Issue / Return</h2>
            <div className="mt-4 flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-sky-200 bg-sky-50/40 text-center">
              <p className="font-medium text-sky-700">Point scanner at barcode</p>
              <p className="mt-1 text-xs text-slate-400">
                Supports Code 128, QR, ISBN.
              </p>
            </div>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!formHasValues(event.currentTarget, ["bookId"])) {
                  feedback.failed("Book not found", "Enter a Book ID to search.");
                  return;
                }
                feedback.success("Book found", "Ready to issue or return this copy.");
              }}
            >
              <input
                name="bookId"
                placeholder="Or enter Book ID manually..."
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
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
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!formHasValues(event.currentTarget, ["qrBookId"])) {
                  feedback.failed("Could not generate", "Enter a Book ID first.");
                  setGenerated(false);
                  return;
                }
                setGenerated(true);
                feedback.success("QR generated", "Print or scan this code at the desk.");
              }}
            >
              <FormField
                label="Book ID"
                name="qrBookId"
                placeholder="e.g., LIB-2024-00342"
              />
              <div className="flex items-end">
                <ModalButton type="submit">Generate</ModalButton>
              </div>
            </form>
            <div className="mt-5 flex h-40 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-center text-sm text-slate-400">
              {generated ? "QR preview ready" : "Enter a Book ID and click Generate."}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <FormField label="Member ID" name="memberId" placeholder="LIB-XXXX" />
              <FormField label="Book ID" name="issueBookId" placeholder="LIB-XXXX" />
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
                  feedback.success("Book returned", "The copy is back in stock.")
                }
              >
                Return Book
              </ModalButton>
            </div>
          </div>
        </AdminCard>
      </div>

      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </AdminPageShell>
  );
}
