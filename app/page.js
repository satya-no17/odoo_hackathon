import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Traveloop
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold">
          Plan multi-city trips, track costs, and share itineraries.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Hackathon MVP with demo login, trip planning, city stops, activities,
          packing, notes, and public itinerary links.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded bg-teal-700 px-5 py-3 text-white" href="/auth/signup">
            Sign up
          </Link>
          <Link className="rounded border px-5 py-3" href="/auth/login">
            Login
          </Link>
          <Link className="rounded border px-5 py-3" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
