"use client";

import { logout } from "@/Controller/users.controller";

export default function page() {

  function logout_user() {
    logout()
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600" />

        {/* Profile */}
        <div className="relative px-8 pb-8">
          <div className="-mt-16 flex flex-col items-center md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col items-center gap-5 md:flex-row md:items-end">
              <img
                src="https://i.pravatar.cc/200"
                alt="Profile"
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
              />

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-800">
                  Mashfik Hasan
                </h1>
                <p className="text-slate-500">Full Stack Developer</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="mt-5 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 md:mt-0">
                Edit Profile
              </button>

              <button onClick={() =>logout_user()} className="mt-5 rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition hover:bg-red-700 md:mt-0">
                Sign Out
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Full Name
              </label>

              <input
                type="text"
                value="Mashfik Hasan"
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Email
              </label>

              <input
                type="email"
                value="mashfik@example.com"
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Phone Number
              </label>

              <input
                type="text"
                value="+8801712345678"
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Role
              </label>

              <input
                type="text"
                value="Student"
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-black"
              />
            </div>
          </div>

          {/* About */}
          <div className="mt-8">
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              About
            </label>

            <textarea
              rows={5}
              readOnly
              className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-black"
              defaultValue="Passionate full-stack developer who enjoys building scalable web and mobile applications using Next.js, React, TypeScript, Bun, and Node.js."
            />
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-100 p-5 text-center">
              <h2 className="text-2xl font-bold text-blue-600">24</h2>
              <p className="text-sm text-slate-500">Projects</p>
            </div>

            <div className="rounded-xl bg-slate-100 p-5 text-center">
              <h2 className="text-2xl font-bold text-blue-600">120</h2>
              <p className="text-sm text-slate-500">Tasks</p>
            </div>

            <div className="rounded-xl bg-slate-100 p-5 text-center">
              <h2 className="text-2xl font-bold text-blue-600">12</h2>
              <p className="text-sm text-slate-500">Teams</p>
            </div>

            <div className="rounded-xl bg-slate-100 p-5 text-center">
              <h2 className="text-2xl font-bold text-blue-600">98%</h2>
              <p className="text-sm text-slate-500">Completion</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}