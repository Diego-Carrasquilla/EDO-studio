import { motion } from "framer-motion";
import { Compass, Gauge, Sigma, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const methodCards = [
    {
        title: "Metodo de Euler",
        tag: "Base",
        icon: Compass,
        tone: "orange",
        description:
            "Usa la pendiente local para avanzar paso a paso. Es ideal para entender el concepto, pero acumula error rapido si el paso es grande.",
        formula: "y(i+1) = y(i) + h * f(x(i), y(i))",
        metrics: ["Error global: O(h)", "1 evaluacion por paso", "Rapido de implementar"],
    },
    {
        title: "Runge-Kutta 4",
        tag: "Pro",
        icon: Sparkles,
        tone: "blue",
        description:
            "Combina cuatro pendientes estrategicas por paso y logra una precision muy superior. Es la opcion profesional para simulacion estable.",
        formula: "y(i+1) = y(i) + (h/6)(k1 + 2k2 + 2k3 + k4)",
        metrics: ["Error global: O(h^4)", "4 evaluaciones por paso", "Alta estabilidad"],
    },
];

const flowSteps = [
    {
        title: "Definir la EDO",
        copy: "Planteas f(x, y) y la condicion inicial y(x0) = y0 segun el fenomeno fisico o biologico.",
    },
    {
        title: "Elegir tamano de paso",
        copy: "El paso h define el equilibrio entre velocidad y precision. Menor h, mayor fidelidad numerica.",
    },
    {
        title: "Iterar y medir error",
        copy: "Comparas contra solucion exacta (si existe) o contra un metodo de mayor orden para validar calidad.",
    },
];

const eulerSteps = [
    "Partes de (x0, y0) con condicion inicial conocida.",
    "Calculas una sola pendiente local: f(x0, y0).",
    "Avanzas con y1 = y0 + h·f(x0, y0).",
    "Repites el ciclo desde el nuevo punto (x1, y1).",
];

const rk4Steps = [
    "k1 evalua la pendiente al inicio del intervalo.",
    "k2 y k3 corrigen la pendiente en puntos medios.",
    "k4 estima la pendiente al final del paso.",
    "Combinas con pesos 1-2-2-1 para obtener y(i+1).",
];

export default function ExplanationSection() {
    return (
        <div className="section-shell">
            <Reveal>
                <div className="section-head">
                    <span className="section-tag">Parte 1 · Explicacion</span>
                    <h2>Fundamentos que sostienen toda la simulacion</h2>
                    <p>
                        Antes de mover sliders o simular epidemias, necesitas una base clara.
                        Aqui tienes la idea matematica en formato visual y directo.
                    </p>
                </div>
            </Reveal>

            <div className="method-grid">
                {methodCards.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Reveal key={item.title} delay={index * 0.1}>
                            <motion.article
                                className={`method-card tone-${item.tone}`}
                                whileHover={{ y: -6, rotateX: 1.2 }}
                                transition={{ duration: 0.28 }}
                            >
                                <header className="method-head">
                                    <div className="method-icon-wrap">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <span className={`tiny-chip tone-${item.tone}`}>{item.tag}</span>
                                        <h3>{item.title}</h3>
                                    </div>
                                </header>

                                <p>{item.description}</p>

                                <div className="formula-box">
                                    <Sigma size={15} />
                                    <code>{item.formula}</code>
                                </div>

                                <ul className="metric-list">
                                    {item.metrics.map((metric) => (
                                        <li key={metric}>{metric}</li>
                                    ))}
                                </ul>
                            </motion.article>
                        </Reveal>
                    );
                })}
            </div>

            <Reveal delay={0.16}>
                <article className="story-card">
                    <header>
                        <Sigma size={18} />
                        <h3>Como funciona cada metodo por dentro</h3>
                    </header>

                    <div className="method-breakdown-grid">
                        <div className="method-breakdown-panel tone-orange">
                            <h4>Pipeline Euler</h4>
                            {eulerSteps.map((step) => (
                                <p key={step}>{step}</p>
                            ))}
                        </div>

                        <div className="method-breakdown-panel tone-blue">
                            <h4>Pipeline RK4</h4>
                            {rk4Steps.map((step) => (
                                <p key={step}>{step}</p>
                            ))}
                        </div>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.2}>
                <article className="story-card">
                    <header>
                        <Gauge size={18} />
                        <h3>Lectura rapida del trade-off</h3>
                    </header>
                    <p>
                        Euler es excelente para introduccion y prototipos muy simples.
                        RK4 es la eleccion seria cuando necesitas resultados robustos con
                        un costo computacional razonable.
                    </p>
                    <div className="duo-bars">
                        <div>
                            <span>Error de Euler</span>
                            <div className="bar-track">
                                <motion.div
                                    className="bar-fill bar-orange"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "76%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </div>
                        </div>
                        <div>
                            <span>Error de RK4</span>
                            <div className="bar-track">
                                <motion.div
                                    className="bar-fill bar-blue"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "11%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </div>
                        </div>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.24}>
                <article className="process-card">
                    <header>
                        <Compass size={18} />
                        <h3>Pipeline numerico profesional</h3>
                    </header>

                    <div className="process-grid">
                        {flowSteps.map((step, idx) => (
                            <motion.div
                                className="process-step"
                                key={step.title}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08, duration: 0.45 }}
                            >
                                <span>{idx + 1}</span>
                                <h4>{step.title}</h4>
                                <p>{step.copy}</p>
                            </motion.div>
                        ))}
                    </div>
                </article>
            </Reveal>
        </div>
    );
}
