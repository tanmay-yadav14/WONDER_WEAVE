import { HeaderBlock } from "./HeaderBlock"
import { motion } from "framer-motion";
import { features } from "../data/features";


export function Features () {
    return (
                <section id="features" className="py-20">
          <div className="mx-auto w-full max-w-7xl px-4">
            <HeaderBlock
              eyebrow="Why Choose Us"
              title="Made for Memorable Journeys"
              subtitle="Everything you need to plan, personalize, and experience the best of India."
            />

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="group relative overflow-hidden rounded-xl border bg-white dark:bg-white dark:border-slate-800 p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-full w-full bg-gradient-to-br from-orange-50 via-rose-50 to-emerald-50" />
                  </div>
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-orange-100 via-pink-100 to-emerald-100 p-3 text-orange-600 ring-1 ring-orange-200/60">
                      {<f.icon />}
                    </div>
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="mt-2 text-muted-foreground">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
    )
}