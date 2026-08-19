import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white transition-colors duration-300 dark:bg-black">
      <div className="max-w-screen-sm px-4 text-center">
        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-blue-600 lg:text-9xl dark:text-blue-400">
          404
        </h1>

        <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          Something&apos;s missing.
        </p>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we can't find that page. You'll find lots to explore on the
          home page.
        </p>

        <Link
          href="/"
          className="inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
        >
          Back to Homepage
        </Link>
      </div>
    </section>
  );
}
