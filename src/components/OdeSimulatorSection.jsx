import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Brush,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Calculator, FileCode2, FlaskConical, Sigma, SlidersHorizontal } from "lucide-react";
import { odeModelOrder, odeModels } from "../data/models";
import { summarizeOde } from "../utils/solvers";
import NotebookCodeBlock from "./NotebookCodeBlock";
import Reveal from "./Reveal";
import StatTile from "./StatTile";

function formatNumber(value, digits = 5) {
    if (!Number.isFinite(value)) return "-";
    return Number(value).toFixed(digits);
}

function sliderProgress(value, min, max) {
    const ratio = (value - min) / (max - min);
    return Math.max(0, Math.min(100, ratio * 100));
}

export default function OdeSimulatorSection() {
    const [modelKey, setModelKey] = useState("exp");
    const [step, setStep] = useState(0.5);

    const model = odeModels[modelKey];

    const simulation = useMemo(() => summarizeOde(model, step), [model, step]);

    const chartData = useMemo(() => {
        const keyOf = (x) => x.toFixed(6);
        const eulerMap = new Map(simulation.euler.map((point) => [keyOf(point.x), point.y]));
        const rk4Map = new Map(simulation.rk4.map((point) => [keyOf(point.x), point.y]));

        const xSet = new Set([
            ...simulation.exact.map((point) => keyOf(point.x)),
            ...simulation.euler.map((point) => keyOf(point.x)),
            ...simulation.rk4.map((point) => keyOf(point.x)),
        ]);

        return [...xSet]
            .map((key) => Number(key))
            .sort((a, b) => a - b)
            .map((x) => {
                const k = keyOf(x);
                return {
                    x,
                    exact: model.exact(x),
                    euler: eulerMap.get(k) ?? null,
                    rk4: rk4Map.get(k) ?? null,
                };
            });
    }, [simulation, model]);

    const statCards = [
        {
            label: "Error max Euler",
            value: formatNumber(simulation.maxEulerError, 4),
            tone: "orange",
            hint: "Orden O(h)",
        },
        {
            label: "Error max RK4",
            value: formatNumber(simulation.maxRk4Error, 6),
            tone: "blue",
            hint: "Orden O(h^4)",
        },
        {
            label: "Mejora RK4",
            value: `${Math.max(1, Math.round(simulation.improvement)).toLocaleString("es-MX")}x`,
            tone: "green",
            hint: "Respecto a Euler",
        },
        {
            label: "Paso actual h",
            value: formatNumber(step, 2),
            tone: "purple",
            hint: model.subtitle,
        },
    ];

    const rows = simulation.rows.slice(0, 15);

    return (
        <div className="section-shell">
            <Reveal>
                <div className="section-head">
                    <span className="section-tag">Parte 2 · Simulador</span>
                    <h2>Laboratorio numerico en tiempo real</h2>
                    <p>
                        Cambia ecuaciones y tamano de paso para ver, en vivo, como Euler y
                        RK4 divergen o convergen frente a la solucion exacta. Esta version
                        incluye mas ecuaciones para practicar escenarios lineales, no lineales,
                        oscilatorios y logaritmicos.
                    </p>
                </div>
            </Reveal>

            <Reveal delay={0.05}>
                <article className="trajectory-live-card">
                    <header className="trajectory-live-header">
                        <div className="trajectory-live-title">
                            <SlidersHorizontal size={18} />
                            <h3>Controles de trayectoria en vivo</h3>
                        </div>
                        <p>Modifica la ecuacion y el paso h mientras comparas Euler, RK4 y la solucion exacta.</p>
                    </header>

                    <div className="trajectory-live-grid">
                        <section className="trajectory-control-panel" aria-label="Controles de trayectoria">
                            <div className="control-grid trajectory-control-grid">
                                <label className="field">
                                    <span>Selecciona ecuacion</span>
                                    <select value={modelKey} onChange={(event) => setModelKey(event.target.value)}>
                                        {odeModelOrder.map((key) => (
                                            <option key={key} value={key}>
                                                {odeModels[key].label} · {odeModels[key].subtitle}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="field-footnote">Exacta de referencia: {model.exactLabel}</small>
                                </label>

                                <label className="field field-slider">
                                    <div className="field-line">
                                        <span>Paso h</span>
                                        <strong>{step.toFixed(2)}</strong>
                                    </div>
                                    <input
                                        className="range-input"
                                        type="range"
                                        min="0.05"
                                        max="1.5"
                                        step="0.05"
                                        value={step}
                                        style={{
                                            "--fill": `${sliderProgress(step, 0.05, 1.5)}%`,
                                            "--slider-color": "#2f66e2",
                                        }}
                                        onChange={(event) => setStep(Number(event.target.value))}
                                    />
                                    <div className="range-hints">
                                        <small>0.05 preciso</small>
                                        <small>1.50 rapido</small>
                                    </div>
                                </label>
                            </div>
                        </section>

                        <section className="trajectory-chart-panel" aria-label="Grafica de trayectorias">
                            <header>
                                <FlaskConical size={18} />
                                <h3>Comparacion de trayectorias</h3>
                            </header>
                            <p className="field-footnote">
                                Usa el slider inferior para hacer zoom sobre tramos pequenos del eje x.
                            </p>
                            <div className="chart-wrap trajectory-chart-wrap">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 12, right: 18, left: -12, bottom: 6 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 43, 68, 0.1)" />
                                        <XAxis
                                            dataKey="x"
                                            type="number"
                                            domain={["dataMin", "dataMax"]}
                                            tick={{ fill: "#5f6b7d", fontSize: 12 }}
                                        />
                                        <YAxis tick={{ fill: "#5f6b7d", fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #dce2f2",
                                                boxShadow: "0 16px 42px rgba(24, 35, 58, 0.12)",
                                            }}
                                            formatter={(value) => formatNumber(Number(value), 5)}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="exact"
                                            stroke="#17976a"
                                            strokeWidth={2.4}
                                            dot={false}
                                            name="Exacta"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="euler"
                                            stroke="#dd6b3f"
                                            strokeWidth={2.2}
                                            strokeDasharray="6 4"
                                            dot={false}
                                            connectNulls
                                            name="Euler"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="rk4"
                                            stroke="#3069f0"
                                            strokeWidth={2.2}
                                            strokeDasharray="10 4"
                                            dot={false}
                                            connectNulls
                                            name="RK4"
                                        />
                                        <Brush
                                            dataKey="x"
                                            height={24}
                                            stroke="#315ed8"
                                            travellerWidth={10}
                                            tickFormatter={(value) => Number(value).toFixed(1)}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.1}>
                <div className="stat-grid">
                    {statCards.map((card) => (
                        <StatTile
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            tone={card.tone}
                            hint={card.hint}
                        />
                    ))}
                </div>
            </Reveal>

            <Reveal delay={0.16}>
                <article className="story-card">
                    <header>
                        <Sigma size={18} />
                        <h3>Formulas visibles: Euler y RK4</h3>
                    </header>

                    <div className="method-breakdown-grid">
                        <div className="method-breakdown-panel tone-orange">
                            <h4>Metodo de Euler</h4>
                            <p className="formula-inline">y_(n+1) = y_n + h * f(x_n, y_n)</p>
                            <p className="mono-row">x_(n+1) = x_n + h</p>
                            <p className="mono-row">Error global aproximado: O(h)</p>
                            <p className="mono-row">Usa una sola pendiente por paso.</p>
                        </div>

                        <div className="method-breakdown-panel tone-blue">
                            <h4>Metodo Runge-Kutta 4</h4>
                            <p className="formula-inline">k1 = f(x_n, y_n)</p>
                            <p className="formula-inline">k2 = f(x_n + h/2, y_n + h*k1/2)</p>
                            <p className="formula-inline">k3 = f(x_n + h/2, y_n + h*k2/2)</p>
                            <p className="formula-inline">k4 = f(x_n + h, y_n + h*k3)</p>
                            <p className="formula-inline">y_(n+1) = y_n + (h/6) * (k1 + 2k2 + 2k3 + k4)</p>
                            <p className="mono-row">Error global aproximado: O(h^4)</p>
                        </div>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.2}>
                <article className="story-card">
                    <header>
                        <FileCode2 size={18} />
                        <h3>Seccion especial: como funciona en Python</h3>
                    </header>
                    <p>
                        Esta es la estructura base del codigo que usamos para resolver EDO con
                        Euler y RK4 en el proyecto.
                    </p>

                    <div className="python-grid">
                        <div className="python-snippet">
                            <h4>Solver de Euler</h4>
                            <NotebookCodeBlock code={`def euler_solve(f, x0, y0, h, x_end):
    x, y = x0, y0
    points = [(x, y)]

    while x < x_end:
        y = y + h * f(x, y)
        x = x + h
        points.append((x, y))

    return points`} />
                        </div>

                        <div className="python-snippet">
                            <h4>Solver de RK4</h4>
                            <NotebookCodeBlock code={`def rk4_solve(f, x0, y0, h, x_end):
    x, y = x0, y0
    points = [(x, y)]

    while x < x_end:
        k1 = f(x, y)
        k2 = f(x + h/2, y + h*k1/2)
        k3 = f(x + h/2, y + h*k2/2)
        k4 = f(x + h, y + h*k3)

        y = y + (h/6) * (k1 + 2*k2 + 2*k3 + k4)
        x = x + h
        points.append((x, y))

    return points`} />
                        </div>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.28}>
                <article className="table-card">
                    <header>
                        <Calculator size={18} />
                        <h3>Tabla numerica (primeros pasos)</h3>
                    </header>

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>x</th>
                                    <th>Exacta</th>
                                    <th>Euler</th>
                                    <th>Error Euler</th>
                                    <th>RK4</th>
                                    <th>Error RK4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <motion.tr
                                        key={row.x}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22 }}
                                    >
                                        <td>{formatNumber(row.x, 2)}</td>
                                        <td>{formatNumber(row.exact, 5)}</td>
                                        <td>{formatNumber(row.euler, 5)}</td>
                                        <td className="tone-text-orange">{formatNumber(row.eulerError, 5)}</td>
                                        <td>{formatNumber(row.rk4, 5)}</td>
                                        <td className="tone-text-blue">{formatNumber(row.rk4Error, 7)}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>
            </Reveal>
        </div>
    );
}
