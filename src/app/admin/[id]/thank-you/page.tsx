export default function Page() {
  return (
    <main className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-black">
      <video
        src="/thankyou.mp4"
        controls
        autoPlay
        playsInline
        className="max-h-full max-w-full"
      />
    </main>
  );
}
