"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { people } from "@/lib/appData";

export default function LoginPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("denzel");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }

      window.localStorage.setItem("fpc-current-user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Could not reach the login route.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10 text-white">
      <div className="aura absolute left-1/2 top-[-22rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute bottom-[-16rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-violet-500/20 blur-3xl" />

      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 118, damping: 18 }} className="glass relative z-10 w-full max-w-[42rem] rounded-[2rem] p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-2xl shadow-sky-400/20">
              <img src="/fpc-mark.png" alt="" className="h-11 w-11 rounded-xl object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-sky-100/50">Private team hub</p>
              <h1 className="text-xl font-semibold">FPC Media Command</h1>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><Sparkles size={18} /></div>
        </div>

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-black/25 p-5">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-sky-400/15 text-sky-100"><LockKeyhole size={22} /></div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Who is working today?</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">Choose your name so services, videos, uploads, and checklist changes show who handled them.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            {people.map((person) => (
              <button key={person.id} type="button" onClick={() => setSelected(person.id)} className={`rounded-[1.35rem] border p-3 text-center transition ${selected === person.id ? "border-sky-300/50 bg-sky-400/15" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"}`}>
                <div className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${person.color} text-sm font-bold text-white`}>{person.initials}</div>
                <p className="mt-2 text-sm font-semibold">{person.name}</p>
                <p className="text-xs capitalize text-white/38">{person.role}</p>
              </button>
            ))}
          </div>

          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Private app password" className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none ring-sky-400/30 transition placeholder:text-white/28 focus:border-sky-300/40 focus:ring-4" />
          {error && <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}
          <button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60">
            {loading ? "Opening..." : "Open Dashboard"}<ArrowRight size={18} />
          </button>
        </section>
      </motion.form>
    </main>
  );
}
