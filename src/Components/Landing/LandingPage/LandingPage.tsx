import { browseBooks } from "@/data/fakeBrowseData";
import Image from "next/image";

const features = [
  {
    title: "Blind Date with a Book",
    text: "Get a surprise pick based on mood, not the cover.",
    link: "Surprise Me",
    icon: "/svg/sparkles.svg",
    iconBg: "bg-sky-50",
  },
  {
    title: "Community Shelf",
    text: "See what friends are reading and borrow from their shelves.",
    link: "Explore Community",
    icon: "/svg/users.svg",
    iconBg: "bg-violet-50",
  },
  {
    title: "Reading Streak Tracker",
    text: "Keep a daily habit and watch your streak grow.",
    link: "View Streak",
    icon: "/svg/flame.svg",
    iconBg: "bg-teal-50",
  },
];

const actions = [
  { label: "Search Catalog", icon: "/svg/search.svg" },
  { label: "Borrow a Book", icon: "/svg/book.svg" },
  { label: "Return Books", icon: "/svg/rotate-ccw.svg" },
  { label: "Discover For You", icon: "/svg/shuffle.svg" },
];

const offers = [
  {
    title: "Book Borrowing & Catalogue",
    icon: "/svg/book.svg",
    body: "Search the live catalogue, place holds, and borrow physical or digital copies in a few taps.",
  },
  {
    title: "Community Shelf & Social Reading",
    icon: "/svg/users.svg",
    body: "Follow other readers, peek at their shelves, and send borrow requests when a title is free.",
  },
  {
    title: "Personalized Recommendations",
    icon: "/svg/sparkles.svg",
    body: "For You mixes your history, ratings, and category taste into a short list worth opening.",
  },
  {
    title: "Reading Streak & Habit Tracker",
    icon: "/svg/flame.svg",
    body: "Log a little reading each day. The streak view keeps the habit honest without being noisy.",
  },
  {
    title: "Blind Date with a Book",
    icon: "/svg/heart.svg",
    body: "Skip the cover. Get a wrapped surprise pick with a teaser, then decide if you want to borrow it.",
  },
  {
    title: "Reviews, Ratings & Reading History",
    icon: "/svg/pencil.svg",
    body: "Rate what you finish, leave a short note, and keep a history you can actually search later.",
  },
  {
    title: "Reading Stats & Category Insights",
    icon: "/svg/chart.svg",
    body: "Monthly charts, category breakdowns, and pace stats so you can see how your reading year is going.",
  },
];

const trending = browseBooks.slice(0, 6);

export default function LandingPage() {
  return (
    <>
      <section className="bg-white px-4 py-14 sm:px-8 lg:px-12 lg:py-20 xl:px-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              Book lovers&apos; paradise
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Discover Your{" "}
              <span className="text-primary font-serif italic">Next Read.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
              Borrow, track, and discuss books with a community of readers. Your
              personal library, everywhere you go.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary">
                Browse Collection
                <Image
                  src="/svg/arrow-right.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 brightness-0 invert"
                />
              </button>
              <button type="button" className="btn btn-outline btn-primary">
                My Shelf
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm">
              <div>
                <p className="font-serif text-2xl font-bold text-slate-900">
                  24K+
                </p>
                <p className="text-slate-400">Books</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-slate-900">
                  3.2K
                </p>
                <p className="text-slate-400">Readers</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-slate-900">
                  14d
                </p>
                <p className="text-slate-400">Avg. Read</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-xl">
            <div className="mb-3 flex items-center gap-2 px-2">
              <span className="size-2.5 rounded-full bg-red-300" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-300" />
              <div className="ml-2 flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-slate-400">
                <Image src="/svg/search.svg" alt="" width={12} height={12} />
                Search the catalogue
              </div>
            </div>
            <div className="flex overflow-hidden rounded-xl bg-white">
              <aside className="hidden w-16 flex-col items-center gap-4 bg-[linear-gradient(to_bottom,#6E8FAD_0%,#FFFFFF_35%,#579FDA_88%,#0EA5E9_130%)] py-4 sm:flex">
                <Image src="/svg/home.svg" alt="" width={16} height={16} />
                <Image src="/svg/book.svg" alt="" width={16} height={16} />
                <Image src="/svg/shelf.svg" alt="" width={16} height={16} />
                <Image src="/svg/users.svg" alt="" width={16} height={16} />
              </aside>
              <div className="flex-1 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Continue reading
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {trending.slice(0, 3).map((book) => (
                    <Image
                      key={book.id}
                      src={book.image}
                      alt={book.title}
                      width={120}
                      height={160}
                      className="h-28 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  This month
                </p>
                <div className="mt-3 flex h-20 items-end gap-2">
                  {[40, 70, 55, 90, 65, 80, 50].map((h, i) => (
                    <span
                      key={i}
                      className="bg-primary/80 flex-1 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-14 sm:px-8 lg:px-12 xl:px-20">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Explore Features
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((item) => (
            <article key={item.title} className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <span
                  className={`flex size-10 items-center justify-center rounded-lg ${item.iconBg}`}
                >
                  <Image src={item.icon} alt="" width={18} height={18} />
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500">{item.text}</p>
                <p className="text-primary mt-2 text-sm font-medium">
                  {item.link} →
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-8 lg:px-12 xl:px-20">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Trending This Week
          </h2>
          <span className="text-primary text-sm">View all →</span>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {trending.map((book) => (
            <article key={book.id}>
              <Image
                src={book.image}
                alt={book.title}
                width={200}
                height={280}
                className="h-48 w-full rounded-xl object-cover shadow-sm sm:h-56"
              />
              <h3 className="mt-3 truncate text-sm font-semibold text-slate-800">
                {book.title}
              </h3>
              <p className="truncate text-xs text-slate-400">{book.author}</p>
              <p className="mt-1 text-xs text-amber-500">
                ★ {book.rating.toFixed(1)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-14 sm:px-8 lg:px-12 xl:px-20">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Quick Actions
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {actions.map((item) => (
            <article
              key={item.label}
              className="card bg-base-100 shadow-sm"
            >
              <div className="card-body items-center py-8 text-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-sky-50">
                  <Image src={item.icon} alt="" width={20} height={20} />
                </span>
                <p className="text-sm font-medium text-slate-700">
                  {item.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              What we offer
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything a modern reader needs.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Borrowing, community, streaks, and stats in one library account.
              Open a row to see how each piece works.
            </p>
            <div className="mt-8 flex h-24 max-w-xs items-end gap-2">
              {[45, 80, 60, 95, 70, 88, 52].map((h, i) => (
                <span
                  key={i}
                  className="bg-primary/80 flex-1 rounded-t-md"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Loved by 3,200+ readers
            </p>
          </div>

          <div className="space-y-2">
            {offers.map((item, index) => (
              <div
                key={item.title}
                className="collapse-arrow border-base-300 bg-base-100 collapse border"
              >
                <input
                  type="radio"
                  name="folio-features"
                  defaultChecked={index === 0}
                />
                <div className="collapse-title flex items-center gap-3 font-semibold">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                    <Image src={item.icon} alt="" width={16} height={16} />
                  </span>
                  {item.title}
                </div>
                <div className="collapse-content text-sm text-slate-500">
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
