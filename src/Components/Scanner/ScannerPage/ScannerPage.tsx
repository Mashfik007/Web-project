"use client";

import { Scanner, type IDetectedBarcode, type IScannerError } from "@yudiel/react-qr-scanner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ScannedBook } from "@/data/lookupScannedBook";

interface ScannerPageProps {
  userId: string;
}

function cameraMessage(error: IScannerError) {
  if (error.kind === "insecure-context") {
    return "The camera only starts on localhost or HTTPS. Open this page at http://localhost:3000 on this computer.";
  }
  if (error.kind === "permission-denied") {
    return "Camera permission is blocked. Allow the camera for this site, then reload.";
  }
  if (error.kind === "no-camera") {
    return "No camera was found on this device.";
  }
  if (error.kind === "in-use") {
    return "The camera is already being used by another app.";
  }
  return error.message;
}

export default function ScannerPage({ userId }: ScannerPageProps) {
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [detected, setDetected] = useState<IDetectedBarcode | null>(null);
  const [manual, setManual] = useState("");
  const [book, setBook] = useState<ScannedBook | null>(null);
  const [payment, setPayment] = useState("");
  const [message, setMessage] = useState("");
  const [looking, setLooking] = useState(false);

  async function lookup(value: string) {
    const next = value.trim();
    if (!next) {
      setMessage("Scan or enter a code.");
      return;
    }

    if (next.startsWith("FOLIO PAY")) {
      setPaused(true);
      setPayment(next);
      setBook(null);
      setMessage("");
      setLooking(false);
      return;
    }

    setPaused(true);
    setPayment("");
    setBook(null);
    setLooking(true);
    setMessage("");

    try {
      const response = await fetch(`/api/users/books/lookup?code=${encodeURIComponent(next)}`);
      const body = (await response.json()) as {
        message?: string;
        data?: ScannedBook | null;
      };
      if (response.status === 404) {
        setMessage("Invalid QR code");
        return;
      }
      if (!response.ok || !body.data) {
        setMessage(body.message || "Could not look up that code.");
        return;
      }
      setBook(body.data);
      router.push(`/user/${userId}/browsebook/${body.data.id}`);
    } catch {
      setMessage("Could not look up that code.");
    } finally {
      setLooking(false);
    }
  }

  function handleScan(detectedCodes: IDetectedBarcode[]) {
    const code = detectedCodes[0];
    if (!code?.rawValue) return;
    setDetected(code);
    void lookup(code.rawValue);
  }

  function scanAgain() {
    setPaused(false);
    setDetected(null);
    setBook(null);
    setPayment("");
    setMessage("");
  }

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-slate-800 md:text-4xl">Scanner</h1>
          <p className="text-sm text-sky-600">
            Point the camera at a book QR code or barcode.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
          <Scanner
            onScan={handleScan}
            onError={(error) => setMessage(cameraMessage(error))}
            paused={paused}
            constraints={{
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }}
            styles={{
              container: { width: "100%", height: "100%", minHeight: 360 },
              video: { width: "100%", height: "100%", objectFit: "cover" },
            }}
          />
        </section>

        <form
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setDetected(null);
            void lookup(manual);
          }}
        >
          <input
            value={manual}
            onChange={(event) => setManual(event.target.value)}
            placeholder="Or enter a book ID or ISBN"
            className="input min-w-0 flex-1"
          />
          <button type="submit" className="btn btn-primary">
            Look up
          </button>
        </form>

        {payment ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
            <h2 className="font-semibold text-slate-800">Payment</h2>
            <ul className="mt-3 space-y-1">
              {payment
                .split("\n")
                .slice(1)
                .map((line) => (
                  <li key={line}>{line}</li>
                ))}
            </ul>
            <button type="button" onClick={scanAgain} className="btn btn-ghost btn-sm mt-3">
              Scan again
            </button>
          </article>
        ) : null}

        {looking ? <p className="text-sm text-slate-500">Looking up the catalog…</p> : null}

        {detected ? (
          <p className="text-xs text-slate-400">
            {detected.format}: {detected.rawValue}
          </p>
        ) : null}

        {book ? (
          <article className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <img src={book.coverImage} alt="" className="h-24 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-semibold text-slate-800">{book.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{book.author}</p>
              {book.isbn ? <p className="mt-1 text-xs text-slate-400">ISBN {book.isbn}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/user/${userId}/browsebook/${book.id}`} className="btn btn-primary btn-sm">
                  Open book
                </Link>
                <button type="button" onClick={scanAgain} className="btn btn-ghost btn-sm">
                  Scan again
                </button>
              </div>
            </div>
          </article>
        ) : null}

        {!book && message ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            <p>{message}</p>
            {paused ? (
              <button type="button" onClick={scanAgain} className="btn btn-ghost btn-sm mt-3">
                Scan again
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
