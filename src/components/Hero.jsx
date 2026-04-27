import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero({ onExplore }) {
    return (
        <section className="hero-shell" aria-label="Intro principal">
            <motion.div
                className="hero-glow hero-glow-a"
                animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="hero-glow hero-glow-b"
                animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
                transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="hero-panel">
                <motion.span
                    className="hero-badge"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                >
                    <Sparkles size={14} /> Presentacion interactiva profesional
                </motion.span>

                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Metodos Numericos + Epidemiologia SIR
                </motion.h1>

                <motion.p
                    className="hero-copy"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    Una sola pagina, una sola narrativa: primero entiendes la teoria,
                    luego experimentas con simulacion numerica y finalmente llevas todo a
                    un caso epidemiologico real con RK4.
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                >
                    <button type="button" className="btn-primary" onClick={onExplore}>
                        Explorar presentacion <ArrowRight size={16} />
                    </button>
                    <span className="hero-caption">React + Framer Motion + Recharts</span>
                </motion.div>
            </div>
        </section>
    );
}
