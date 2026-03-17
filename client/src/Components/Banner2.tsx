import { motion } from "framer-motion";
import { GradientButton } from "./ui/gradient-button";

export function Banner2 () {
    return (
         <section className="py-16 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-600 text-white relative overflow-hidden">
          <div className="absolute inset-y-0 -right-10 w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="mx-auto w-full max-w-screen-2xl px-4 text-center relative">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6"
            >
              Ready to Begin Your Indian Adventure?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="max-w-[720px] mx-auto text-white/90 mb-8 text-lg"
            >
              Join thousands of travelers discovering the wonders of India with personalized itineraries.
            </motion.p>
            <GradientButton>Start Planning Today</GradientButton>
          </div>
        </section>
    )
}